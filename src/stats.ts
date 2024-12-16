import { Wallet } from "./db/database"
import { getInfo } from "./tasks"
import { createAxiosInstance } from "./tasks/api/axios"

const stats = async () => {
  const wallets = await Wallet.findAll()

  for (const wallet of wallets) {
    const axiosInstance = createAxiosInstance(wallet.proxy)
    const info = await getInfo(wallet, axiosInstance)

    console.log(`Wallet ${wallet.name} has ${info?.points} and ${info?.rank}rank in leaderboard`)
  }
}

export { stats }
