import Big from "big.js"

import { config } from "../config"
import { getTokenBalance } from "./getTokenBalance"
import { LSKToken, USDCToken, USDTToken, WETHToken } from "../contracts"
import { Controller } from "../tasks"
import { getRandomNumber } from "./getRandomNumber"

const getRandomAction = async (controller: Controller) => {
  const possibleActions: Array<() => Promise<string>> = []

  const ethBalance = await getTokenBalance(controller.wallet.address)

  if (!new Big(ethBalance).gt(config.minBalance)) return "Insufficient balance"

  const usdtBalance = Number(await getTokenBalance(controller.wallet.address, USDTToken))
  const usdcBalance = Number(await getTokenBalance(controller.wallet.address, USDCToken))
  const wethBalance = Number(await getTokenBalance(controller.wallet.address, WETHToken))
  const lskBalance = Number(await getTokenBalance(controller.wallet.address, LSKToken))

  const requiredBalance = new Big(config.minBalance).plus(config.ethAmountToSwap.to)
  const isBalanceSufficientToSwapEth = new Big(ethBalance).gt(requiredBalance)

  if (lskBalance) {
    possibleActions.push(
      ...[
        controller.velodrome.swapLskToEth,
        controller.velodrome.swapLskToUsdc,
        controller.velodrome.swapLskToUsdt,
        controller.velodrome.swapLskToWeth,
      ],
    )
  }

  if (usdtBalance) {
    possibleActions.push(
      ...[
        controller.velodrome.swapUsdtToEth,
        controller.velodrome.swapUsdtToLsk,
        controller.velodrome.swapUsdtToUsdc,
        controller.velodrome.swapUsdtToWeth,
      ],
    )
  }

  if (usdcBalance) {
    possibleActions.push(
      ...[
        controller.velodrome.swapUsdcToEth,
        controller.velodrome.swapUsdcToWeth,
        controller.velodrome.swapUsdcToLsk,
        controller.velodrome.swapUsdcToUsdt,
      ],
    )
  }

  if (wethBalance) {
    possibleActions.push(
      ...[
        controller.velodrome.swapWethToEth,
        controller.velodrome.swapWethToLsk,
        controller.velodrome.swapWethToUsdc,
        controller.velodrome.swapWethToUsdt,
      ],
    )
  }

  if (isBalanceSufficientToSwapEth) {
    possibleActions.push(
      ...[
        controller.velodrome.swapEthToLsk,
        controller.velodrome.swapEthToUsdc,
        controller.velodrome.swapEthToUsdt,
        controller.velodrome.swapEthToWeth,
      ],
    )
  }

  let action: (() => Promise<string>) | null = null

  while (!action) {
    const index = Math.floor(getRandomNumber(0, possibleActions.length - 1))
    action = possibleActions[index]
  }

  return action
}

export { getRandomAction }
