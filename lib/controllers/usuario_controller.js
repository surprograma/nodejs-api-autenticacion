import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';

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
  const contraseniaEncriptada = await bcrypt.hash(req.body.contrasenia, 10);

  const usuarioNuevo = await Usuario.create({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    fechaNacimiento: req.body.fechaNacimiento,
    avatarUrl: req.body.avatarUrl,
    contraseniaEncriptada,
  });

  // TODO: quitar la contraseniaEncriptada de lo que devuelve
  res.status(201).json({ data: usuarioNuevo });
};
