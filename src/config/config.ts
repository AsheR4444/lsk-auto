import { ConfigType } from "./types"

const config: ConfigType = {
  ethAmountToSwap: {
    from: 0.00004,
    to: 0.0005,
  },
  minBalance: 0.001,
  actionsDelay: {
    from: 43200,
    to: 86400,
  },
  delayInCaseOfError: 120,
  maxRetries: 10,
}

export { config }
