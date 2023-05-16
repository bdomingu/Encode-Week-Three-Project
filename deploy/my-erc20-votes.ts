import { ethers, network } from "hardhat"
import { MyERC20Votes__factory } from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

const MINT_VALUE = ethers.utils.parseEther("10")

async function main() {
  const [deployer, account1, account2] = await ethers.getSigners()
  const contractFactory = new MyERC20Votes__factory(deployer)
  const contract = await contractFactory.deploy()
  const receipt = await contract.deployTransaction.wait()
  console.log(
    `The MyERC20Votes is deployed at: ${contract.address} \n and the Tx Hash is: ${receipt.transactionHash}\n`
  )
  console.log(
    "--------------------------------------------------------------------------------------"
  )
  const mintTx = await contract.mint(account1.address, MINT_VALUE)
  const mintTxReceipt = await mintTx.wait()
  console.log(
    `Minted ${ethers.utils.formatEther(MINT_VALUE)} tokens to the address ${
      account1.address
    } \nTransaction Hash is: ${mintTxReceipt.transactionHash} at block ${
      receipt.blockNumber
    }\n `
  )
  const balanceBN = await contract.balanceOf(account1.address)
  console.log(
    `Account: ${account1.address} has ${ethers.utils.formatEther(
      balanceBN
    )} of Tokens\n`
  )
  const votes = await contract.getVotes(account1.address)
  console.log(
    `Account: ${account1.address} has ${ethers.utils.formatEther(
      votes
    )} voting power before delegating\n`
  )
  const delegateTx = await contract.connect(account1).delegate(account1.address)
  await delegateTx.wait()
  console.log()
  const votesAfter = await contract.getVotes(account1.address)
  console.log(
    `Account: ${account1.address} has ${ethers.utils.formatEther(
      votesAfter
    )} voting power after delegating\n`
  )

  const transferTx = await contract
    .connect(account1)
    .transfer(account2.address, MINT_VALUE.div(2))
  await transferTx.wait()
  const votesAfterTransfer = await contract.getVotes(account1.address)
  console.log(
    `Account: ${account1.address} has ${ethers.utils.formatEther(
      votesAfterTransfer
    )} voting power after transferring ${ethers.utils.formatEther(
      MINT_VALUE.div(2)
    )} tokens to ${account2.address}\n`
  )
  const lastBlock = await ethers.provider.getBlock("latest")
  const pastVotes = await contract.getPastVotes(
    account1.address,
    lastBlock.number - 1
  )
  console.log(ethers.utils.formatEther(pastVotes))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
