import path from "path"
import fs from "fs"
import winston from "winston"

import { SRC_DIR } from "../config"

const logDir = path.join(SRC_DIR, "logs")

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level.toUpperCase()}: ${message}`
})

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp({ format: "DD-MM-YY HH:mm" }), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(SRC_DIR, "logs", "app.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      tailable: true,
    }),
  ],
})

export { logger }
