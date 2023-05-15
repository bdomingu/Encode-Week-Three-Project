import { ethers, network } from "hardhat"
import { MyERC20Votes__factory } from "../typechain-types"

const developmentChains = ["hardhat", "localhost"]

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
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
