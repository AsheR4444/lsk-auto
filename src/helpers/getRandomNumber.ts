import Big from "big.js"

function getRandomNumber(min: number, max: number) {
  const minBig = new Big(min)
  const maxBig = new Big(max)

  const randomFraction = Big(Math.random())

  const randomNumber = minBig.plus(randomFraction.times(maxBig.minus(minBig)))

  return randomNumber.toNumber()
}

export { getRandomNumber }
