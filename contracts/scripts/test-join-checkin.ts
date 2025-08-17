import { network } from "hardhat";
import { parseEther } from "viem";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Testing join and check-in to new commitments on Flow EVM Testnet...");
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

  // Try to join and check in to some of the newer commitments
  const commitmentsToTest = [
    { id: 6n, stakeAmount: parseEther("0.02"), secretCode: "HACK2024" },
    { id: 7n, stakeAmount: parseEther("0.015"), secretCode: "NFT2024" },
    { id: 8n, stakeAmount: parseEther("0.025"), secretCode: "DEFI2024" },
    { id: 9n, stakeAmount: parseEther("0.01"), secretCode: "GAME2024" },
    { id: 10n, stakeAmount: parseEther("0.04"), secretCode: "INVEST2024" }
  ];

  for (let i = 0; i < commitmentsToTest.length; i++) {
    const commitment = commitmentsToTest[i];
    
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
