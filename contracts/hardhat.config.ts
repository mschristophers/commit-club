import type { HardhatUserConfig } from "hardhat/config";
import { configVariable } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

// Load environment variables from root directory
dotenv.config({ path: "../.env.local" });

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    "flow-testnet": {
      type: "http",
      chainType: "l1",
      url: process.env.FLOW_EVM_TESTNET_RPC || "https://testnet.evm.nodes.onflow.org",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here" ? [process.env.PRIVATE_KEY] : [],
      chainId: 3569,
    },
  },
};

export default config;
