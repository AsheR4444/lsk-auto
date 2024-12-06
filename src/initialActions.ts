import { AxiosInstance } from "axios"

import { claimUsdcHolding, claimUsdtHolding, claimLskHolding, Controller } from "./tasks"
import { getRandomNumber, sleep } from "./helpers"

const initialActions = async (controller: Controller, axiosInstance: AxiosInstance) => {
  const doUsdcAction = async () => {
    await controller.velodrome.swapEthToUsdc()
    await sleep(getRandomNumber(5, 50))
    await claimUsdcHolding(controller.wallet, axiosInstance)
  }

  const doUsdtAction = async () => {
    await controller.velodrome.swapEthToUsdt()
    await sleep(getRandomNumber(5, 50))
    await claimUsdtHolding(controller.wallet, axiosInstance)
  }

  const doLskAction = async () => {
    await controller.velodrome.swapEthToLsk()
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
