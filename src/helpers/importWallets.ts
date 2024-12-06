import { Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"

import wallets from "../config/wallets.json"
import { getWallet, Wallet } from "../db/database"

const importWallets = async () => {
  let imported = 0
  let edited = 0
  const total = wallets.length

  for (const wallet of wallets) {
    const walletInstance = await getWallet(wallet.privateKey)

    if (walletInstance && (walletInstance.proxy !== wallet.proxy || walletInstance.name !== wallet.name)) {
      await Wallet.update({ proxy: wallet.proxy, name: wallet.name }, { where: { privateKey: wallet.privateKey } })
      ++edited
    }

    if (!walletInstance) {
      const address = privateKeyToAccount(wallet.privateKey as Hex).address
      await Wallet.create({ ...wallet, address: address as string })
      ++imported
    }
  }

  console.log("----------")
  console.log("Done!")
  console.log(`Imported wallets: ${imported}/${total}`)
  console.log(`Changed wallets: ${edited}/${total}`)
  console.log(`Total: ${total}`)
  console.log("----------")
}

export { importWallets }
