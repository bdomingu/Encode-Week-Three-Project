import { ethers, network } from "hardhat"
import { TokenizedBallot__factory } from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

const votesContract = process.argv[2]

const proposals = process.argv.slice(3)
// const proposals = ["Alpha", "Beta", "Gamma"]

async function main() {
  const [deployer, account1, account2] = await ethers.getSigners()
  console.log("Following are the PROPOSALS for the Tokenized BALLOT")
  console.log(">>>>>>")

  proposals.forEach((proposal, index) => {
    console.log(`Proposal ${index}: ${proposal}`)
  })
  const tokenizedBallotFactory = new TokenizedBallot__factory(deployer)
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    proposals.map(ethers.utils.formatBytes32String),
    votesContract
  )
  console.log("Deploying TokenizedBallot Contract")
  console.log("------------------------------------------------------------")
  const deployTvTx = await tokenizedBallotContract.deployTransaction.wait()
  console.log(
    `Ballot contract Deployed at: ${tokenizedBallotContract.address} and the transaction hash is :${deployTvTx.transactionHash} at block: ${deployTvTx.blockNumber}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
