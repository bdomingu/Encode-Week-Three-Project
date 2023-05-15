import { ethers, network } from "hardhat"
import { MyERC20Votes__factory } from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

// const MINT_VALUE = ethers.utils.parseEther(process.argv[4])

interface Flags {
  votesContractAddress: string | null
  minterAddress: string | null
  mintAmount: string | null
}

function parseArgs(): Flags {
  const args: string[] = process.argv.slice(2) // Remove first two elements

  const flags: Flags = {
    votesContractAddress: null,
    minterAddress: null,
    mintAmount: null,
  }

  for (let i = 0; i < args.length; i++) {
    const arg: string = args[i]
    if (arg.startsWith("--")) {
      const flag: keyof Flags = arg.slice(2) as keyof Flags // Type assertion
      const value: string | undefined = args[i + 1] // Get the value of the flag

      if (flag in flags) {
        flags[flag] = value || null // Assign value or null if value is undefined
      } else {
        console.log(`Unknown flag: ${flag}`)
      }
    }
  }

  return flags
}

// // Parse the arguments
// const parsedArgs: Flags = parseArgs()
// console.log("Votes Contract Address:", parsedArgs.votesContractAddress)

async function main() {
  const parsedArgs: Flags = parseArgs()
  const [deployer, account1, account2] = await ethers.getSigners()

  let votesTokenAddress = parsedArgs.votesContractAddress
  const minterAddress = parsedArgs.minterAddress
  const contractFactory = new MyERC20Votes__factory(deployer)
  const votesTokenContract = await contractFactory.attach(votesTokenAddress!)
  const mintTx = await votesTokenContract.mint(
    minterAddress!,
    ethers.utils.parseEther(parsedArgs.mintAmount!)
  )
  const mintTxReceipt = await mintTx.wait()
  console.log(
    `Minted ${ethers.utils.formatEther(
      ethers.utils.parseEther(parsedArgs.mintAmount!)
    )} tokens to the address ${minterAddress} \nTransaction Hash is: ${
      mintTxReceipt.transactionHash
    } at block ${mintTxReceipt.blockNumber}\n `
  )

  const balanceBN = await votesTokenContract.balanceOf(minterAddress!)
  console.log(
    `Account: ${minterAddress} has ${ethers.utils.formatEther(
      balanceBN
    )} number of Tokens\n`
  )

  const votes = await votesTokenContract.getVotes(minterAddress!)
  if (ethers.utils.formatEther(votes) === "0.0") {
    console.log(
      `Account: ${minterAddress} has ${ethers.utils.formatEther(
        votes
      )} voting power. Please delegate to token to desired address for Voting Power`
    )
  } else {
    console.log(
      `Account: ${minterAddress} has ${ethers.utils.formatEther(
        votes
      )} voting power!\n`
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
