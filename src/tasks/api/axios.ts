import { HttpsProxyAgent } from "https-proxy-agent"
import UserAgent from "user-agents"
import axios, { AxiosInstance } from "axios"

const createAxiosInstance = (proxy: string): AxiosInstance => {
  const userAgent = new UserAgent({
    deviceCategory: "desktop",
  })

  const axiosInstance = axios.create({
    httpsAgent: proxy ? new HttpsProxyAgent(proxy) : false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": userAgent.random().toString(),
    },
  })

  return axiosInstance
}

export { createAxiosInstance }
