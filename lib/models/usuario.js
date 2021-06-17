import { omit } from 'ramda';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Usuario extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        fechaNacimiento: DataTypes.DATEONLY,
        avatarUrl: DataTypes.STRING,
        contraseniaEncriptada: DataTypes.STRING,
        correoElectronico: DataTypes.STRING,

        // Este "campo" no se persiste, se calcula a partir de otro/s.
        edad: {
          // Definimos el tipo (INTEGER) y de qué atributo/s depende (fechaNacimiento).
          type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ['fechaNacimiento']),
          get: function () {
            return Math.floor(
              (new Date() - new Date(this.get('fechaNacimiento'))) /
                (1000 * 60 * 60 * 24 * 365.25)
            );
          },
        },
      },
      {
        sequelize,
        modelName: 'Usuario',
      }
    );
  }

  static async conCorreoYContrasenia(correoElectronico, contrasenia) {
    const usuario = await this.findOne({
      where: { correoElectronico },
    });

    if (!usuario) {
      return null;
    }

    const contraseniaValida = await bcrypt.compare(
      contrasenia,
      usuario.contraseniaEncriptada
    );

    return contraseniaValida ? usuario : null;
  }

  esTocayoDe(otroUsuario) {
    return otroUsuario.nombre === this.nombre;
  }

  // Sobreescribimos este método para que no llegue la contraseña al cliente
  toJSON() {
    return omit(['contraseniaEncriptada'], super.toJSON());
  }
}
