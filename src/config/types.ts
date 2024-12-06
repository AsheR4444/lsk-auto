type FromTo = {
  from: number
  to: number
}

type ConfigType = {
  ethAmountToSwap: FromTo
  minBalance: number
  actionsDelay: FromTo
  delayInCaseOfError: number
  maxRetries: number
}

export type { FromTo, ConfigType }
