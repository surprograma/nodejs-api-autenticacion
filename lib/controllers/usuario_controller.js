import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// TODO: mover el factor de carga a una configuración del entorno
const encriptar = (contrasenia) => bcrypt.hash(contrasenia, 10);

// TODO: mover esto a configuración del entorno
const SECRET = 'P1rul0!';
const DURACION_SEGUNDOS = 120;

const generarJWT = (usuario) =>
  jwt.sign(
    { id: usuario.id, correoElectronico: usuario.correoElectronico },
    SECRET,
    {
      expiresIn: DURACION_SEGUNDOS,
    }
  );

export const index = async (req, res) => {
  const data = await Usuario.findAll({});
  res.json({ data });
};

export const show = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (usuario) {
    res.json({ data: usuario });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un usuario con id ${req.params.id}` });
  }
};

export const create = async (req, res) => {
  const contraseniaEncriptada = await encriptar(req.body.contrasenia);

  const usuario = await Usuario.create({
    ...req.body,
    contraseniaEncriptada,
  });

  res
    .status(201)
    .json({ data: { ...usuario.toJSON(), token: await generarJWT(usuario) } });
};

export const login = async (req, res) => {
  const usuario = await Usuario.conCorreoYContrasenia(
    req.body.correoElectronico,
    req.body.contrasenia
  );

  if (!usuario) {
    return res
      .status(401)
      .json({ mensaje: 'Ups, no encontramos a nadie con esas credenciales' });
  }

  res.status(200).json({
    data: { ...usuario.toJSON(), token: await generarJWT(usuario) },
  });
};
