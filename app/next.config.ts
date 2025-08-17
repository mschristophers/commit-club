import type { NextConfig } from "next";
import * as dotenv from "dotenv";

// Load environment variables from root directory
dotenv.config({ path: "../.env.local" });

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC: process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC,
    NEXT_PUBLIC_COMMIT_CLUB_ADDRESS: process.env.NEXT_PUBLIC_COMMIT_CLUB_ADDRESS,
  },
};

export default nextConfig;
