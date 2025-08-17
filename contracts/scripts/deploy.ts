import { network } from "hardhat";

async function main() {
  console.log("Deploying CommitClub contract to Flow EVM Testnet...");

  const { viem } = await network.connect();
  const commitClub = await viem.deployContract("CommitClub");
  const address = commitClub.address;

  console.log("CommitClub deployed to:", address);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
