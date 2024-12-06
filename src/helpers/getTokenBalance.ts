import { lisk } from "viem/chains"
import { Token } from "../contracts"
import { createPublicClient, erc20Abi, formatEther, Hex, http } from "viem"
import Big from "big.js"

const getTokenBalance = async (wallet: string, token?: Token, unit: "wei" | "gwei" = "wei") => {
  const client = createPublicClient({
    chain: lisk,
    transport: http(),
  })

  if (token) {
    const balance = await client.readContract({
      address: token.address as Hex,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [wallet as Hex],
    })

    const decimals = await client.readContract({
      address: token.address as Hex,
      abi: erc20Abi,
      functionName: "decimals",
    })

    const formattedBalance = new Big(balance.toString()).div(new Big(10).pow(decimals))

    return formattedBalance.toString()
  }

  const balance = await client.getBalance({
    address: wallet as Hex,
  })

  return formatEther(balance, unit)
}

export { getTokenBalance }
