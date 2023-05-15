import { ethers, network } from "hardhat"
import { TokenizedBallot__factory } from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

// const votesTokenAddress = process.argv[2]
// const parsedArgs.voteAmount! = process.argv[3]
// const DELEGATE_VALUE = ethers.utils.parseEther(process.argv[4])

interface Flags {
  tokenizedContractAddress: string | null

  proposalNumber: string | null
  voteAmount: string | null
}

function parseArgs(): Flags {
  const args: string[] = process.argv.slice(2) // Remove first two elements

  const flags: Flags = {
    tokenizedContractAddress: null,
    proposalNumber: null,
    voteAmount: null,
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

async function main() {
  const parsedArgs: Flags = parseArgs()
  const [deployer, account1, account2] = await ethers.getSigners()
  const tokenizedBallotContract = new TokenizedBallot__factory(deployer)
  const votesTokenContract = await tokenizedBallotContract.attach(
    parsedArgs.tokenizedContractAddress!
  )

  const votesFromAccount1 = await tokenizedBallotContract
    .connect(account1)
    .vote(0, ethers.utils.parseEther(parsedArgs.voteAmount!))
  const votesFromAccount1Tx = await votesFromAccount1.wait()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
