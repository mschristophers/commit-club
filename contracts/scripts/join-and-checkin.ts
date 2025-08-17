import { network } from "hardhat";
import { parseEther } from "viem";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Joining and checking in to commitments on Flow EVM Testnet...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);

  const { viem } = await network.connect();

  console.log("\n👤 Using default wallet");

  // Get contract instance
  const commitClub = await viem.getContractAt("CommitClub", CONTRACT_ADDRESS);

  // Get current next commitment ID to see how many commitments exist
  const nextCommitmentId = await commitClub.read.nextCommitmentId();
  console.log("📊 Next commitment ID:", nextCommitmentId.toString());
  console.log("📊 Total commitments created:", (nextCommitmentId - 1n).toString());

  // Try to join and check in to the first few commitments
  const commitmentsToJoin = [
    { id: 1n, stakeAmount: parseEther("0.01"), secretCode: "NYC2024" },
    { id: 2n, stakeAmount: parseEther("0.01"), secretCode: "RUN2024" },
    { id: 3n, stakeAmount: parseEther("0.005"), secretCode: "COFFEE2024" },
    { id: 4n, stakeAmount: parseEther("0.05"), secretCode: "TECH2024" },
    { id: 5n, stakeAmount: parseEther("0.02"), secretCode: "BOOK2024" }
  ];

  for (let i = 0; i < commitmentsToJoin.length; i++) {
    const commitment = commitmentsToJoin[i];
    
    console.log(`\n🤝 Attempting to join commitment ${commitment.id}...`);
    
    try {
      // Try to join
      const joinTx = await commitClub.write.joinCommit([commitment.id], {
        value: commitment.stakeAmount
      });

      console.log("✅ Joined commitment! TX:", joinTx);
      console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + joinTx);
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to check in
      console.log(`✅ Attempting to check in to commitment ${commitment.id}...`);
      const checkInTx = await commitClub.write.checkIn([commitment.id, commitment.secretCode]);

      console.log("✅ Checked in! TX:", checkInTx);
      console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + checkInTx);
      
      // Wait a bit between commitments
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log("❌ Failed:", error.message);
    }
  }

  console.log("\n🎉 All join and check-in attempts completed!");
  console.log("\n📊 Summary:");
  console.log("✅ Attempted to join and check in to multiple commitments");
  console.log("✅ Each successful join generates a Joined event");
  console.log("✅ Each successful check-in generates a CheckedIn event");
  console.log("\n🔍 View all events on Flowscan: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
