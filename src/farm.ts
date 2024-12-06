import { Op } from "sequelize"
import { chromium, LaunchOptions } from "playwright"

import { claimAllTasks, Controller } from "./tasks"
import {
  getRandomAction,
  getRandomNumber,
  logger,
  sleep,
  updateExpired,
  updateInitialActions,
  updateNextActionDate,
} from "./helpers"
import { getNextWallet, Wallet } from "./db/database"
import { config } from "./config"
import { createAxiosInstance } from "./tasks/api/axios"
import { initialActions } from "./initialActions"
import { formatProxy } from "./helpers/formatProxy"

const DELAY = 10

const farm = async () => {
  await updateExpired()

  const nextWallet = await getNextWallet()
  logger.info(`The next closest action will be performed at ${nextWallet?.nextActionDate}`)

  while (true) {
    const wallet = await Wallet.findOne({
      where: {
        nextActionDate: {
          [Op.lt]: new Date(),
        },
      },
    })

    if (!wallet) {
      await sleep(DELAY)
      continue
    }

    if (wallet) {
      const options: LaunchOptions = {
        headless: false,
        proxy: wallet?.proxy ? { ...formatProxy(wallet.proxy) } : void 0,
      }
      const browser = await chromium.launch(options)
      const context = await browser.newContext()

      const axiosInstance = createAxiosInstance(wallet.proxy)
      const controller = new Controller(wallet, context)

      if (!wallet.isInitialDone) {
        await initialActions(controller, axiosInstance)
        await updateNextActionDate(wallet.privateKey, config.delayInCaseOfError)
        await updateInitialActions(wallet.privateKey)

        const nextWallet = await getNextWallet()
        logger.info(`The next closest action will be performed at ${nextWallet?.nextActionDate}`)

        await browser.close()
        continue
      }

      const action = await getRandomAction(controller)
      await claimAllTasks(wallet, axiosInstance)

      if (action === "Insufficient balance") {
        logger.error(`${wallet.name}: Insufficient balance`)
        return
      }

      const status = await action()

      if (!status.includes("Failed")) {
        logger.info(status)
        await updateNextActionDate(wallet.privateKey, getRandomNumber(config.actionsDelay.from, config.actionsDelay.to))
        await claimAllTasks(wallet, axiosInstance)

        const nextWallet = await getNextWallet()

        logger.info(`The next closest action will be performed at ${nextWallet?.nextActionDate}`)
      } else {
        logger.error(status)
        await updateNextActionDate(wallet.privateKey, config.delayInCaseOfError)
      }

      await browser.close()
    }
  }
}

export { farm }
