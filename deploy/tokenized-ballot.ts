import { ethers, network } from "hardhat"
import {
  MyERC20Votes__factory,
  TokenizedBallot__factory,
} from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

const MINT_VALUE = ethers.utils.parseEther("10")

const proposals = ["Alpha", "Beta", "Gamma"]

async function main() {
  const [deployer, account1, account2] = await ethers.getSigners()
  const votesFactory = new MyERC20Votes__factory(deployer)
  const votesContract = await votesFactory.deploy()
  const receipt = await votesContract.deployTransaction.wait()
  console.log("Deploying Votes Contract")
  console.log("------------------------------------------------------------")
  console.log(
    `Votes contract Deployed at: ${votesContract.address} and the transaction hash is :${receipt.transactionHash} at block: ${receipt.blockNumber}`
  )

  const deployerMint = await votesContract.mint(account1.address, MINT_VALUE)
  const deployerMintTx = await deployerMint.wait()
  console.log(
    `Minted ${ethers.utils.formatEther(MINT_VALUE)} to address ${
      account1.address
    } at block: ${deployerMintTx.blockNumber}`
  )

  const balanceBN = await votesContract.balanceOf(account1.address)
  console.log(
    `Account: ${account1.address} has ${ethers.utils.formatEther(
      balanceBN
    )} number of Tokens\n`
  )

  const votingPowerDeployerAfterMinting = await votesContract.getVotes(
    account1.address
  )
  console.log(
    `Get Votes after minting: ${ethers.utils.formatEther(
      votingPowerDeployerAfterMinting
    )} `
  )

  const deployerDelegate = await votesContract
    .connect(account1)
    .delegate(account1.address)
  const delegateTx = await deployerDelegate.wait()
  console.log(
    `Delegated to address ${account1.address} at block: ${delegateTx.blockNumber}`
  )
  const votingPowerDeployerAfterDelegating = await votesContract.getVotes(
    account1.address
  )
  console.log(
    `Get Votes after delegating: ${ethers.utils.formatEther(
      votingPowerDeployerAfterDelegating
    )} at block: `
  )
  console.log("Following are the PROPOSALS for the Tokenized BALLOT")
  console.log(">>>>>>")

  proposals.forEach((proposal, index) => {
    console.log(`Proposal ${index}: ${proposal}`)
  })
  const tokenizedBallotFactory = new TokenizedBallot__factory(deployer)
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    proposals.map(ethers.utils.formatBytes32String),
    votesContract.address
  )
  console.log("Deploying TokenizedBallot Contract")
  console.log("------------------------------------------------------------")
  const deployTvTx = await tokenizedBallotContract.deployTransaction.wait()
  console.log(
    `Ballot contract Deployed at: ${tokenizedBallotContract.address} and the transaction hash is :${deployTvTx.transactionHash} at block: ${deployTvTx.blockNumber}`
  )
  const targetBlockNumber = await tokenizedBallotContract.targetBlockNumber()
  await network.provider.send("hardhat_mine", [])
  const votingPowerAccount1 = await tokenizedBallotContract.votingPower(
    account1.address
  )
  console.log(
    `Voting power of ${
      account1.address
    } at target block ${targetBlockNumber} is: ${ethers.utils.formatEther(
      votingPowerAccount1
    )}`
  )

  const votesFromAccount1 = await tokenizedBallotContract
    .connect(account1)
    .vote(0, ethers.utils.parseEther("4"))
  const votesFromAccount1Tx = await votesFromAccount1.wait()

  const votingPowerAccount1AfterVoting =
    await tokenizedBallotContract.votingPower(account1.address)
  console.log(ethers.utils.formatEther(votingPowerAccount1AfterVoting))

  try {
    const anotherVoteFromAccount1 = await tokenizedBallotContract
      .connect(account1)
      .vote(1, ethers.utils.parseEther("5"))
    const anotherVoteFromAccount1Tx = await anotherVoteFromAccount1.wait()

    const votingPowerAccount1AfterAnotherVoting =
      await tokenizedBallotContract.votingPower(account1.address)
    console.log(ethers.utils.formatEther(votingPowerAccount1AfterAnotherVoting))
  } catch (err) {
    if (err instanceof Error) {
      // ✅ TypeScript knows err is Error
      console.log(err.message)
    } else {
      console.log("Unexpected error", err)
    }
  }

  try {
    const another2VoteFromAccount1 = await tokenizedBallotContract
      .connect(account1)
      .vote(2, ethers.utils.parseEther("1"))
    const another2VoteFromAccount1Tx = await another2VoteFromAccount1.wait()

    const votingPowerAccount1AfterAnother2Voting =
      await tokenizedBallotContract.votingPower(account1.address)
    console.log(
      ethers.utils.formatEther(votingPowerAccount1AfterAnother2Voting)
    )
  } catch (err) {
    if (err instanceof Error) {
      // ✅ TypeScript knows err is Error
      console.log(err.message)
    } else {
      console.log("Unexpected error", err)
    }
  }

  const winningProposalNumber = await tokenizedBallotContract.winningProposal()

  const winningProposal = await tokenizedBallotContract.proposals(
    winningProposalNumber
  )
  const winningProposalVoteCount = winningProposal.voteCount
  const winnerName = await tokenizedBallotContract.winnerName()
  // console.log(`The winning proposal number is: ${winningProposal.toString()}`);
  console.log(
    `The winning proposal so far is ${ethers.utils.parseBytes32String(
      winnerName
    )} with ${ethers.utils.formatEther(winningProposalVoteCount)} votes`
  )

  return
  //   console.log("Deploying TokenizedBallot Contract")
  //   console.log("------------------------------------------------------------")
  //   const deployTvTx = await tokenizedBallotContract.deployTransaction.wait()
  //   console.log(
  //     `Ballot contract Deployed at: ${tokenizedBallotContract.address} and the transaction hash is :${deployTvTx.transactionHash} at block: ${deployTvTx.blockNumber}`
  //   )
  //   const targetBlock = await tokenizedBallotContract.targetBlockNumber()
  //   console.log(targetBlock.toString(), deployTvTx.blockNumber)

  //   await network.provider.send("hardhat_mine", [])

  //   const lastBlock = await ethers.provider.getBlock("latest")
  // const targetBlock = await tokenizedBallotContract.targetBlockNumber()

  // console.log(
  //   `Get Votes after delegating: ${ethers.utils.formatEther(
  //     votingPowerDeployerAfterDelegating
  //   )} at block: `
  // )
  // await network.provider.send("hardhat_mine", [])
  // await network.provider.send("hardhat_mine", [])

  // const targetBlockNumber = await tokenizedBallotContract.targetBlockNumber()
  // console.log(targetBlockNumber)

  // const getPastVotesDeployer = await votesContract.getPastVotes(
  //   deployer.address,
  //   targetBlockNumber
  // )
  // console.log(` The GetPastVotes at block: ${targetBlockNumber.toString()} is:
  //   ${ethers.utils.formatEther(getPastVotesDeployer)}`)
  // const votingPower = await tokenizedBallotContract.votingPower(
  //   deployer.address
  // )
  // console.log(
  //   `The votingPower of ${
  //     deployer.address
  //   } at block: ${targetBlockNumber.toString()} is: ${votingPower}`
  // )

  // //   const tokenBalanceDeployer = await votesContract.balanceOf(deployer.address)
  // //   console.log(tokenBalanceDeployer)

  // //   await network.provider.send("hardhat_mine", [])

  // //   const votingPowerDeployerAfterClaiming = await votesContract.getVotes(
  // //       deployer.address
  // //       )
  // //       console.log(votingPowerDeployerAfterClaiming.toString())

  // const votesFromDeployer = await tokenizedBallotContract.vote(0, 5)
  // const votersFromDeployerTx = await votesFromDeployer.wait()

  // const votingPowerDeployerAfterVoting = await votesContract.getVotes(
  //   deployer.address
  // )
  // console.log(votingPowerDeployerAfterVoting.toString())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
