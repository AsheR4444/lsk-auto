import "dotenv/config"
import { BrowserContext } from "playwright"
import { expect } from "playwright/test"
import { installMockWallet } from "@raznorabochiy/wallet-mock"
import { lisk } from "viem/chains"
import { Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"

import { getTokenBalance, logger, sleep } from "../helpers"
import { Token, ETHToken, LSKToken, USDTToken, USDCToken, WETHToken } from "../contracts"
import { getRandomNumber } from "../helpers/getRandomNumber"
import { config } from "../config"
import { Wallet } from "../db/database"

class Velodrome {
  wallet: Wallet
  context: BrowserContext

  constructor(wallet: Wallet, context: BrowserContext) {
    this.wallet = wallet
    this.context = context

    this.swapEthToLsk = this.swapEthToLsk.bind(this)
    this.swapEthToUsdc = this.swapEthToUsdc.bind(this)
    this.swapEthToUsdt = this.swapEthToUsdt.bind(this)
    this.swapEthToWeth = this.swapEthToWeth.bind(this)
    this.swapUsdtToEth = this.swapUsdtToEth.bind(this)
    this.swapUsdcToEth = this.swapUsdcToEth.bind(this)
    this.swapLskToEth = this.swapLskToEth.bind(this)
    this.swapWethToEth = this.swapWethToEth.bind(this)
    this.swapLskToUsdc = this.swapLskToUsdc.bind(this)
    this.swapLskToUsdt = this.swapLskToUsdt.bind(this)
    this.swapLskToWeth = this.swapLskToWeth.bind(this)
    this.swapUsdtToWeth = this.swapUsdtToWeth.bind(this)
    this.swapUsdtToUsdc = this.swapUsdtToUsdc.bind(this)
    this.swapUsdtToLsk = this.swapUsdtToLsk.bind(this)
    this.swapUsdcToLsk = this.swapUsdcToLsk.bind(this)
    this.swapUsdcToUsdt = this.swapUsdcToUsdt.bind(this)
    this.swapUsdcToWeth = this.swapUsdcToWeth.bind(this)
    this.swapWethToLsk = this.swapWethToLsk.bind(this)
    this.swapWethToUsdc = this.swapWethToUsdc.bind(this)
    this.swapWethToUsdt = this.swapWethToUsdt.bind(this)
  }

  async #swap(fromToken: Token, toToken: Token, amount: string) {
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        const page = await this.context.newPage()
        await page.bringToFront()
        logger.info(`Wallet ${this.wallet.name} | Started to swap ${fromToken.name} to ${toToken.name}`)
        const fromTokenIsETH = fromToken.name === ETHToken.name

        await installMockWallet({
          page,
          account: privateKeyToAccount(this.wallet.privateKey as Hex),
          defaultChain: lisk,
        })

        await page.goto(
          `https://velodrome.finance/swap?from=${fromToken.address}&to=${toToken.address}&chain0=1135&chain1=1135`,
        )

        await page.fill("input[required]", amount)

        if (!fromTokenIsETH) {
          const buttonAllow = page.locator('text="Allow"')

          await expect(buttonAllow).toBeEnabled({ timeout: 10 * 1000 })
          await buttonAllow.click()
          await sleep(10)
        }

        const button = page.locator(`text="Swap ${fromToken.name} for ${toToken.name}"`)
        await expect(button).toBeEnabled({ timeout: 10 * 1000 })
        await button.click()
        await sleep(10)

        const txLink = page.locator('text="swapped for"')

        await expect(txLink).toBeVisible({ timeout: 5 * 1000 })

        return `Wallet ${this.wallet.name} | Swapped ${amount} ${fromToken.name} to ${toToken.name} Succesfully! | via Velodrome\nTx ${await txLink.getAttribute("href")}`
      } catch (e) {
        logger.error(`${this.wallet.name} | Error occurred: ${e} `)
        const page = this.context.pages()[0]
        await page.close()

        if (attempt < config.maxRetries) {
          logger.info(`Wallet ${this.wallet.name} | Retrying... (Attempt ${attempt} of ${config.maxRetries})`)
        }
      }
    }
    return `Wallet ${this.wallet.name} Failed to swap ${fromToken.name} to ${toToken.name}`
  }

  // FROM ETH
  async swapEthToLsk() {
    const amount = getRandomNumber(config.ethAmountToSwap.from, config.ethAmountToSwap.to).toString()

    return await this.#swap(ETHToken, LSKToken, amount)
  }
  async swapEthToUsdc() {
    const amount = getRandomNumber(config.ethAmountToSwap.from, config.ethAmountToSwap.to).toString()

    return await this.#swap(ETHToken, USDCToken, amount)
  }
  async swapEthToUsdt() {
    const amount = getRandomNumber(config.ethAmountToSwap.from, config.ethAmountToSwap.to).toString()

    return await this.#swap(ETHToken, USDTToken, amount)
  }
  async swapEthToWeth() {
    const amount = getRandomNumber(config.ethAmountToSwap.from, config.ethAmountToSwap.to).toString()

    return await this.#swap(ETHToken, WETHToken, amount)
  }

  /* TO ETH */
  // FROM LSK
  async swapLskToEth() {
    const amount = await getTokenBalance(this.wallet.address, LSKToken)

    return await this.#swap(LSKToken, ETHToken, amount)
  }
  async swapLskToUsdc() {
    const amount = await getTokenBalance(this.wallet.address, LSKToken)

    return await this.#swap(LSKToken, USDCToken, amount)
  }
  async swapLskToUsdt() {
    const amount = await getTokenBalance(this.wallet.address, LSKToken)

    return await this.#swap(LSKToken, USDTToken, amount)
  }
  async swapLskToWeth() {
    const amount = await getTokenBalance(this.wallet.address, LSKToken)

    return await this.#swap(LSKToken, WETHToken, amount)
  }

  // FROM USDT
  async swapUsdtToEth() {
    const amount = await getTokenBalance(this.wallet.address, USDTToken)

    return await this.#swap(USDTToken, ETHToken, amount)
  }
  async swapUsdtToUsdc() {
    const amount = await getTokenBalance(this.wallet.address, USDTToken)

    return await this.#swap(USDTToken, USDCToken, amount)
  }
  async swapUsdtToLsk() {
    const amount = await getTokenBalance(this.wallet.address, USDTToken)

    return await this.#swap(USDTToken, LSKToken, amount)
  }
  async swapUsdtToWeth() {
    const amount = await getTokenBalance(this.wallet.address, USDTToken)

    return await this.#swap(USDTToken, WETHToken, amount)
  }

  // FROM USDC
  async swapUsdcToEth() {
    const amount = await getTokenBalance(this.wallet.address, USDCToken)

    return await this.#swap(USDCToken, ETHToken, amount)
  }
  async swapUsdcToLsk() {
    const amount = await getTokenBalance(this.wallet.address, USDCToken)

    return await this.#swap(USDCToken, LSKToken, amount)
  }
  async swapUsdcToUsdt() {
    const amount = await getTokenBalance(this.wallet.address, USDCToken)

    return await this.#swap(USDCToken, USDTToken, amount)
  }
  async swapUsdcToWeth() {
    const amount = await getTokenBalance(this.wallet.address, USDCToken)

    return await this.#swap(USDCToken, WETHToken, amount)
  }

  // FROM WETH
  async swapWethToEth() {
    const amount = await getTokenBalance(this.wallet.address, WETHToken)

    return await this.#swap(WETHToken, ETHToken, amount)
  }

  async swapWethToLsk() {
    const amount = await getTokenBalance(this.wallet.address, WETHToken)

    return await this.#swap(WETHToken, LSKToken, amount)
  }

  async swapWethToUsdc() {
    const amount = await getTokenBalance(this.wallet.address, WETHToken)

    return await this.#swap(WETHToken, USDCToken, amount)
  }

  async swapWethToUsdt() {
    const amount = await getTokenBalance(this.wallet.address, WETHToken)

    return await this.#swap(WETHToken, USDTToken, amount)
  }
}

export { Velodrome }
