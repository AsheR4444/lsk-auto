import path from "path"

const ROOT_DIR = path.resolve()
const SRC_DIR = path.join(ROOT_DIR, "src")
const DB_PATH = path.join(SRC_DIR, "wallets.db")

export { DB_PATH, SRC_DIR }
