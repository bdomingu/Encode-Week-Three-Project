import { ethers, network } from "hardhat"
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types"

const PROPOSALS = ["Alpha", "Beta", "Gamma"]

interface Flags {
  tokenizedContractAddress: string | null
}

function parseArgs(): Flags {
  const args: string[] = process.argv.slice(2) // Remove first two elements

  const flags: Flags = {
    tokenizedContractAddress: null,
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

async function getVoteCountSummary(_contract: TokenizedBallot) {
  console.log("\n==================Vote Count Summary===================")
  for (let i = 0; i < PROPOSALS.length; i++) {
    let proposal = await _contract.proposals(i)
    console.log(
      `Proposal N.${i + 1}: ${ethers.utils.parseBytes32String(
        proposal.name
      )} has ${ethers.utils.formatUnits(proposal.voteCount)} votes`
    )
  }
}

async function main() {
  const parsedArgs: Flags = parseArgs()

  const [deployer, account1, account2] = await ethers.getSigners()
  const tokenizedBallotContract = new TokenizedBallot__factory(deployer)
  const votesTokenContract = await tokenizedBallotContract.attach(
    parsedArgs.tokenizedContractAddress!
  )

  const winningProposalNumber = await votesTokenContract.winningProposal()

  const winningProposal = await votesTokenContract.proposals(
    winningProposalNumber
  )
  const winningProposalVoteCount = winningProposal.voteCount
  const winnerName = await votesTokenContract.winnerName()
  // console.log(`The winning proposal number is: ${winningProposal.toString()}`);
  console.log(
    `The winning proposal so far is ${ethers.utils.parseBytes32String(
      winnerName
    )} with ${ethers.utils.formatEther(winningProposalVoteCount)} votes`
  )
  getVoteCountSummary(votesTokenContract)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
