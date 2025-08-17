import { network } from "hardhat";
import { keccak256, stringToHex, parseEther } from "viem";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Generating final events on Flow EVM Testnet...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);

  const { viem } = await network.connect();

  console.log("\n👤 Using default wallet");

  // Get contract instance
  const commitClub = await viem.getContractAt("CommitClub", CONTRACT_ADDRESS);

  // Create a few more commitments with different scenarios
  const finalCommitments = [
    {
      name: "Blockchain Meetup",
      stakeAmount: parseEther("0.015"),
      minCheckIns: 2,
      secretCode: "BLOCKCHAIN2024"
    },
    {
      name: "Crypto Trading Session",
      stakeAmount: parseEther("0.025"),
      minCheckIns: 3,
      secretCode: "TRADING2024"
    },
    {
      name: "DeFi Workshop",
      stakeAmount: parseEther("0.035"),
      minCheckIns: 4,
      secretCode: "DEFI2024"
    }
  ];

  for (let i = 0; i < finalCommitments.length; i++) {
    const commitment = finalCommitments[i];
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const codeHash = keccak256(stringToHex(commitment.secretCode));

    console.log(`\n📝 Creating final commitment ${i + 1}: ${commitment.name}`);
    console.log("Stake Amount:", commitment.stakeAmount.toString(), "wei");
    console.log("Min Check-ins:", commitment.minCheckIns);
    console.log("Secret Code:", commitment.secretCode);

    try {
      const createTx = await commitClub.write.createCommit([
        commitment.name,
        commitment.stakeAmount,
        commitment.minCheckIns,
        deadline,
        codeHash
      ]);

      console.log("✅ Commitment created! TX:", createTx);
      console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + createTx);
      
      // Wait a bit between transactions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log("❌ Failed to create commitment:", error.message);
    }
  }

  console.log("\n🎉 Final events generation completed!");
  console.log("\n📊 Summary of all events generated:");
  console.log("✅ Multiple CommitmentCreated events");
  console.log("✅ Multiple Joined events");
  console.log("✅ Multiple CheckedIn events");
  console.log("✅ Various stake amounts and check-in thresholds");
  console.log("\n🔍 View all events on Flowscan: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
  console.log("\n🎯 You should now see plenty of activity on your contract!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
