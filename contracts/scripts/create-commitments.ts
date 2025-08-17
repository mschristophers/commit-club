import { network } from "hardhat";
import { keccak256, stringToHex, parseEther } from "viem";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Creating multiple commitments on Flow EVM Testnet...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);

  const { viem } = await network.connect();

  console.log("\n👤 Using default wallet");

  // Get contract instance
  const commitClub = await viem.getContractAt("CommitClub", CONTRACT_ADDRESS);

  // Create multiple commitments with different parameters
  const commitments = [
    {
      name: "Central Park Run",
      stakeAmount: parseEther("0.01"),
      minCheckIns: 3,
      secretCode: "RUN2024"
    },
    {
      name: "Coffee Meetup",
      stakeAmount: parseEther("0.005"),
      minCheckIns: 2,
      secretCode: "COFFEE2024"
    },
    {
      name: "Tech Conference",
      stakeAmount: parseEther("0.05"),
      minCheckIns: 5,
      secretCode: "TECH2024"
    },
    {
      name: "Book Club",
      stakeAmount: parseEther("0.02"),
      minCheckIns: 4,
      secretCode: "BOOK2024"
    },
    {
      name: "Art Gallery Opening",
      stakeAmount: parseEther("0.03"),
      minCheckIns: 6,
      secretCode: "ART2024"
    }
  ];

  for (let i = 0; i < commitments.length; i++) {
    const commitment = commitments[i];
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 7200); // 2 hours from now
    const codeHash = keccak256(stringToHex(commitment.secretCode));

    console.log(`\n📝 Creating commitment ${i + 1}: ${commitment.name}`);
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

  console.log("\n🎉 All commitment creation attempts completed!");
  console.log("\n📊 Summary:");
  console.log(`✅ Attempted to create ${commitments.length} commitments`);
  console.log("✅ Each successful creation generates a CommitmentCreated event");
  console.log("\n🔍 View all events on Flowscan: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
