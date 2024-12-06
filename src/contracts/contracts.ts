type Token = {
  name: string
  address: string
}

const ETHToken: Token = {
  name: "ETH",
  address: "eth",
}

const LSKToken: Token = {
  name: "LSK",
  address: "0xac485391eb2d7d88253a7f1ef18c37f4242d1a24",
}

const USDCToken: Token = {
  name: "USDC.e",
  address: "0xf242275d3a6527d877f2c927a82d9b057609cc71",
}

const USDTToken: Token = {
  name: "USDT",
  address: "0x05d032ac25d322df992303dca074ee7392c117b9",
}

const WETHToken: Token = {
  name: "WETH",
  address: "0x4200000000000000000000000000000000000006",
}

export { Token, ETHToken, LSKToken, USDTToken, USDCToken, WETHToken }
