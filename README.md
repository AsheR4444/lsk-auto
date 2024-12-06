# Lisk

<div align="center">
  <img src="image.png">
</div>


## 🔔Join my Telegram community:
CHANNEL: [DegenCoding](https://t.me/degencoding)


## 🚀 Features
1. **Swaps on [Velodrome Finance](https://velodrome.finance/)**
 - ETH to token
 - Token to token
 - Token to ETH

List of tokens
 - WETH
 - USDT
 - USDC.e
 - LSK

2. Claiming tasks on Lisk airdrop [page](https://portal.lisk.com/airdrop)

## 💻 Requirements
- Node 20.17
- Funded and registred wallets on the Lisk network 
- Working proxies (HTTP only)

## 🛠️ Installation
1. **Clone the repository**
```bash
   git clone https://github.com/AsheR4444/lsk-auto
```
2. **Install dependencies**
```bash
    npm i
```
## ⚙️ Getting Started
1. Configure options inside ``./src/config/config.ts``
```ts
const config: ConfigType = {
    ethAmountToSwap: {
        from: 0.00004, // minimum amount of swap
        to: 0.0005, // maximum amount of swap
    },
    minBalance: 0.001, // minimum balance. if your balance is less than or equal to this value, all swaps will be stopped
    actionsDelay: {
        from: 4200, // minimum delay in seconds
        to: 8400, // maximum delay in seconds
    },
    delayInCaseOfError: 120, // delay in case of error in seconds
    maxRetries: 10, // if all attempts failed, the repeat will pass through delayInCaseOfError
}
```
2. Add wallets to ``./src/config.json`` like it shows in example inside ``./src/config.example.json``
```json
[
    {
        "name": "name",
        "privateKey": "private key",
        "proxy": "http://login:password@ip:port"
    }
]
```
## 🔜 Before you start farming
**Import data into the local database**
1. Run script 
```bash
    npm start
```
2. Select option called "Import your wallets to DB"
## 🚀 **Usage**
1. Run script 
```bash
    npm start
```
2. Select option called "Farm"