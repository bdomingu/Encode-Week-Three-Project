import { ethers, network } from "hardhat"
import { MyERC20Votes__factory } from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

// const votesTokenAddress = process.argv[2]
// const parsedArgs.delegateAddress! = process.argv[3]
// const DELEGATE_VALUE = ethers.utils.parseEther(process.argv[4])

interface Flags {
  votesContractAddress: string | null
  delegateAddress: string | null
}

function parseArgs(): Flags {
  const args: string[] = process.argv.slice(2) // Remove first two elements

  const flags: Flags = {
    votesContractAddress: null,
    delegateAddress: null,
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
  const contractFactory = new MyERC20Votes__factory(deployer)
  const votesTokenContract = await contractFactory.attach(
    parsedArgs.votesContractAddress!
  )

  const balanceBN = await votesTokenContract.balanceOf(
    parsedArgs.delegateAddress!
  )
  console.log(
    `Account: ${parsedArgs.delegateAddress!} has ${ethers.utils.formatEther(
      balanceBN
    )} number of Tokens\n`
  )

  const votes = await votesTokenContract.getVotes(parsedArgs.delegateAddress!)
  console.log(
    `Account: ${parsedArgs.delegateAddress!} has ${ethers.utils.formatEther(
      votes
    )} voting power before delegating\n`
  )
  const delegateTx = await votesTokenContract
    .connect(account2)
    .delegate(parsedArgs.delegateAddress!)
  await delegateTx.wait()
  const votesAfter = await votesTokenContract.getVotes(
    parsedArgs.delegateAddress!
  )
  console.log(
    `Account: ${parsedArgs.delegateAddress!} has ${ethers.utils.formatEther(
      votesAfter
    )} voting power after delegating\n`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
