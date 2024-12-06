import { ConfigType } from "./types"

const config: ConfigType = {
  ethAmountToSwap: {
    from: 0.000123,
    to: 0.0002,
  },
  minBalance: 0.0005,
  actionsDelay: {
    from: 28800,
    to: 43200,
  },
  delayInCaseOfError: 120,
  maxRetries: 10,
}

export { config }
