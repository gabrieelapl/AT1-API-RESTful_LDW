import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Filme extends Model {
  declare id: number;
  declare titulo: string;
  declare genero: string;
  declare ano_lancamento: number;
  declare nota: number;
  declare disponibilidade_plataforma: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Filme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ano_lancamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nota: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
    },
    disponibilidade_plataforma: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'movies',
    timestamps: true,
  }
);