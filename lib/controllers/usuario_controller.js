import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// TODO: mover el factor de carga a una configuración del entorno
const encriptar = (contrasenia) => bcrypt.hash(contrasenia, 10);

// TODO: mover esto a configuración del entorno
const SECRET = 'P1rul0!';
const DURACION_SEGUNDOS = 120;

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

  const usuarioNuevo = await Usuario.create({
    ...req.body,
    contraseniaEncriptada,
  });

  // TODO: quitar la contraseniaEncriptada de lo que devuelve
  // TODO: hacer que devuelva un JWT
  res.status(201).json({ data: usuarioNuevo });
};

const usuarioNoExiste = (res) =>
  res
    .status(401)
    .json({ mensaje: 'Ups, no encontramos a nadie con esas credenciales' });

export const login = async (req, res) => {
  const usuario = await Usuario.findOne({
    where: {
      correoElectronico: req.body.correoElectronico,
    },
  });

  if (!usuario) {
    return usuarioNoExiste(res);
  }

  const coincidenContrasenia = await bcrypt.compare(
    req.body.contrasenia,
    usuario.contraseniaEncriptada
  );

  if (!coincidenContrasenia) {
    return usuarioNoExiste(res);
  }

  const token = await jwt.sign(
    { id: usuario.id, correoElectronico: usuario.correoElectronico },
    SECRET,
    {
      expiresIn: DURACION_SEGUNDOS,
    }
  );

  res.status(200).json({
    mensaje: `¡Hola ${usuario.nombre}! Qué bueno volver a verte :)`,
    token,
  });
};
