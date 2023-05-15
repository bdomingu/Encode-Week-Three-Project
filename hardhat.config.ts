import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "./tasks/accounts"

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  solidity: "0.8.18",
  paths: { tests: "tests" },
}

export default config
