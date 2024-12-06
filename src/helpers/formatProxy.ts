const formatProxy = (proxy: string) => {
  const [credentials, server] = proxy.replace("http://", "").split("@")
  const [username, password] = credentials.split(":")

  return {
    server: `${server}`,
    username,
    password,
  }
}

export { formatProxy }

//194.88.106.169:9999
