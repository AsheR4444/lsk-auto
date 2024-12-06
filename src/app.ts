import "dotenv/config"
import prompts from "prompts"

import { importWallets, logInfo } from "./helpers"
import { createDataBase } from "./db/database"
import { farm } from "./farm"

const createDb = async () => {
  await createDataBase()
  await importWallets()
}

const main = async () => {
  logInfo()

  const response = await prompts({
    type: "select",
    name: "action",
    message: "Choose option",
    choices: [
      { title: "Import data", value: "import", description: "Import your wallets to DB" },
      { title: "Farm", value: "farm", description: "Just farm" },
    ],
  })
  if (response.action === "import") await createDb()
  if (response.action === "farm") await farm()
}

main()
