import { Model, InferAttributes, InferCreationAttributes, DataTypes, Sequelize, Op } from "sequelize"

import { DB_PATH } from "../config"

const DB = new Sequelize(`sqlite:///${DB_PATH}`, {
  dialect: "sqlite",
  storage: DB_PATH,
  logging: false,
})

class Wallet extends Model<InferAttributes<Wallet>, InferCreationAttributes<Wallet>> {
  declare privateKey: string
  declare name: string
  declare proxy: string
  declare nextActionDate: Date | null
  declare isInitialDone: boolean | null
  declare address: string
}

Wallet.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    privateKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proxy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextActionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isInitialDone: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "wallets",
    sequelize: DB,
  },
)

const getWallet = async (privateKey: string) => {
  const wallet = await Wallet.findOne({
    where: { privateKey },
  })

  return wallet
}

const getNextWallet = async () => {
  return await Wallet.findOne({
    where: {
      nextActionDate: {
        [Op.gte]: new Date(),
      },
    },
    order: [["nextActionDate", "ASC"]],
  })
}

const createDataBase = async () => {
  await DB.sync()
}

export { Wallet, getWallet, createDataBase, DB, getNextWallet }
