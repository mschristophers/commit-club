import { network } from "hardhat";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Checking in to commitments with correct codes...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);

  const { viem } = await network.connect();

  console.log("\n👤 Using default wallet");

  // Get contract instance
  const commitClub = await viem.getContractAt("CommitClub", CONTRACT_ADDRESS);

  // Try to check in to the commitments we successfully joined
  // Based on the previous run, we successfully joined commitments 1 and 2
  const checkIns = [
    { id: 1n, secretCode: "NYC2024" },
    { id: 2n, secretCode: "RUN2024" }
  ];

  for (let i = 0; i < checkIns.length; i++) {
    const checkIn = checkIns[i];
    
    console.log(`\n✅ Attempting to check in to commitment ${checkIn.id} with code "${checkIn.secretCode}"...`);
    
    try {
      const checkInTx = await commitClub.write.checkIn([checkIn.id, checkIn.secretCode]);

      console.log("✅ Checked in! TX:", checkInTx);
      console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + checkInTx);
      
      // Wait a bit between check-ins
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log("❌ Failed:", error.message);
    }
  }

  console.log("\n🎉 All check-in attempts completed!");
  console.log("\n📊 Summary:");
  console.log("✅ Attempted to check in to commitments we successfully joined");
  console.log("✅ Each successful check-in generates a CheckedIn event");
  console.log("\n🔍 View all events on Flowscan: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
