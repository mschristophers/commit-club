import { network } from "hardhat";

async function main() {
  console.log("Deploying Greeter contract to Flow EVM Testnet...");

  const { viem } = await network.connect();
  const greeter = await viem.deployContract("Greeter", ["Hello, Flow EVM Testnet!"]);
  const address = greeter.address;

  console.log("Greeter deployed to:", address);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
