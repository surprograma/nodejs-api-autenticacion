import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BCRYPT_ROUNDS, JWT_DURACION, JWT_SECRET } from '../config';

const encriptar = (contrasenia) => bcrypt.hash(contrasenia, BCRYPT_ROUNDS);

const generarJWT = (usuario) =>
  jwt.sign(
    { id: usuario.id, correoElectronico: usuario.correoElectronico },
    JWT_SECRET,
    { expiresIn: JWT_DURACION }
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
