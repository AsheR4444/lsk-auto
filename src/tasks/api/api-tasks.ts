import { AxiosInstance } from "axios"

import { claimTaskQuery, walletInfoQuery } from "./queries"
import { Task } from "../types"
import { getRandomNumber, logger, sleep } from "../../helpers"
import { Wallet } from "../../db/database"
import { config } from "../../config"
import chalk from "chalk"

const claimTask = async (address: string, taskId: number, taskDescription: string, axiosInstance: AxiosInstance) => {
  try {
    logger.info(`Claiming task: ${taskDescription}`)

    const response = await axiosInstance.post("https://portal-api.lisk.com/graphql", claimTaskQuery(address, taskId))
    const updateStatus = response.data?.data?.userdrop?.updateTaskStatus

    if (updateStatus?.success) {
      logger.info(`Task ${taskDescription} successfully claimed!`)
    } else {
      logger.info(`Failed to claim task ${taskDescription}`)
    }
  } catch (error) {
    logger.error(`Error claiming task ${taskDescription}: ${error}`)
  }
}

const claimAllTasks = async (wallet: Wallet, axiosInstance: AxiosInstance) => {
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const info = await getInfo(wallet, axiosInstance)

      if (info?.tasks.length) {
        for (const task of info.tasks) {
          await claimTask(wallet.address, task.id, task.description, axiosInstance)
          await sleep(getRandomNumber(2, 5))
        }
      }

      logger.info(chalk.green(`Wallet ${wallet.name} | all tasks are claimed`))
      return true
    } catch (e) {
      logger.info(
        `Wallet ${wallet.name} | fail while claiming tasks | Retrying... (Attempt ${attempt} of ${config.maxRetries})`,
      )
    }
  }
  logger.error(chalk.red(`Wallet ${wallet.name} | fail to claim tasks after ${config.maxRetries} retries`))
  return false
}

const getInfo = async (
  wallet: Wallet,
  axiosInstance: AxiosInstance,
): Promise<
  | {
      points: number
      rank: number
      referrals: number
      tasks: Task[]
    }
  | undefined
> => {
  try {
    logger.info(`Wallet ${wallet.name} | Getting Lisk tasks data`)

    const response = await axiosInstance.post("https://portal-api.lisk.com/graphql", walletInfoQuery(wallet.address))

    const data = response.data?.data?.userdrop?.user
    const tasks = response.data?.data?.userdrop?.user?.tasks?.flatMap((taskGroup) => taskGroup.tasks)

    return {
      points: data.points,
      referrals: data.referrals.totalCount,
      rank: data.rank,
      tasks: tasks.filter((task) => !task.progress.isCompleted),
    }
  } catch (error) {
    logger.error(error)
    return
  }
}

const claimLskHolding = async (wallet: Wallet, axiosInstance: AxiosInstance) => {
  await claimTask(wallet.address, 7, "Hold any amount of LSK", axiosInstance)
}

const claimUsdcHolding = async (wallet: Wallet, axiosInstance: AxiosInstance) => {
  await claimTask(wallet.address, 8, "Hold any amount of USDC", axiosInstance)
}

const claimUsdtHolding = async (wallet: Wallet, axiosInstance: AxiosInstance) => {
  await claimTask(wallet.address, 9, "Hold any amount of USDT", axiosInstance)
}

export { claimAllTasks, claimLskHolding, claimUsdcHolding, claimUsdtHolding }
