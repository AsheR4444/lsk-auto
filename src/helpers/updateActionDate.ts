import chalk from "chalk"

import { getRandomNumber } from "./getRandomNumber"
import { Wallet } from "../db/database"
import { config } from "../config"

const updateExpired = async () => {
  const now = new Date()

  const wallets = await Wallet.findAll({
    where: {
      nextActionDate: null,
    },
  })

  if (!wallets.length) return

  for (const { privateKey, name } of wallets) {
    const randomSeconds = getRandomNumber(0, config.actionsDelay.to / 2) * 1000
    const nextActionDate = new Date(now.getTime() + randomSeconds)

    await Wallet.update(
      {
        nextActionDate,
      },
      {
        where: {
          privateKey: privateKey,
        },
      },
    )

    console.log(chalk.green(`${name}: Action time was re-generated:`))
    console.log(chalk.green(`${nextActionDate}`))
  }
}

const updateNextActionDate = async (privateKey: string, seconds: number) => {
  try {
    const now = new Date()
    const randomSeconds = getRandomNumber(0, seconds) * 1000

    await Wallet.update(
      { nextActionDate: new Date(now.getTime() + randomSeconds) },
      {
        where: {
          privateKey,
        },
      },
    )

    return true
  } catch (e) {
    return false
  }
}

const updateInitialActions = async (privateKey: string) => {
  try {
    await Wallet.update(
      { isInitialDone: true },
      {
        where: {
          privateKey,
        },
      },
    )

    return true
  } catch (e) {
    return false
  }
}

export { updateExpired, updateNextActionDate, updateInitialActions }
