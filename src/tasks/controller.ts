import { BrowserContext } from "playwright"
import { Wallet } from "../db/database"
import { Velodrome } from "./velodrome"

class Controller {
  wallet: Wallet
  velodrome: Velodrome

  constructor(wallet: Wallet, context: BrowserContext) {
    this.wallet = wallet
    this.velodrome = new Velodrome(wallet, context)
  }
}

export { Controller }
