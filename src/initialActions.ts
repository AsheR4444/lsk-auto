import { AxiosInstance } from "axios"

import { claimUsdcHolding, claimUsdtHolding, claimLskHolding, Controller } from "./tasks"
import { getRandomNumber, logger, sleep } from "./helpers"

const initialActions = async (controller: Controller, axiosInstance: AxiosInstance) => {
  const doUsdcAction = async () => {
    const res = await controller.velodrome.swapEthToUsdc()
    logger.info(res)
    await sleep(getRandomNumber(5, 50))
    await claimUsdcHolding(controller.wallet, axiosInstance)
  }

  const doUsdtAction = async () => {
    const res = await controller.velodrome.swapEthToUsdt()
    logger.info(res)
    await sleep(getRandomNumber(5, 50))
    await claimUsdtHolding(controller.wallet, axiosInstance)
  }

  const doLskAction = async () => {
    const res = await controller.velodrome.swapEthToLsk()
    logger.info(res)
    await sleep(getRandomNumber(5, 50))
    await claimLskHolding(controller.wallet, axiosInstance)
  }

  const actions = [doUsdcAction, doUsdtAction, doLskAction]

  const shuffledActions = actions.sort(() => Math.random() - 0.5)

  for (const action of shuffledActions) {
    await action()
    await sleep(getRandomNumber(120, 3000))
  }
}

export { initialActions }
