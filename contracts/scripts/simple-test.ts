import { network } from "hardhat";
import { keccak256, stringToHex, parseEther } from "viem";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Testing CommitClub contract on Flow EVM Testnet...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);

  const { viem } = await network.connect();

  console.log("\n👤 Using default wallet");

  // Get contract instance
  const commitClub = await viem.getContractAt("CommitClub", CONTRACT_ADDRESS);

  // Get current next commitment ID
  const nextCommitmentId = await commitClub.read.nextCommitmentId();
  console.log("📊 Next commitment ID:", nextCommitmentId.toString());

  // Test parameters
  const commitmentName = "Test NYC Meetup";
  const stakeAmount = parseEther("0.01"); // 0.01 FLOW
  const minCheckIns = 2;
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
  const secretCode = "NYC2024";
  const codeHash = keccak256(stringToHex(secretCode));

  console.log("\n📝 Creating new commitment...");
  console.log("Name:", commitmentName);
  console.log("Stake Amount:", stakeAmount.toString(), "wei");
  console.log("Min Check-ins:", minCheckIns);
  console.log("Deadline:", new Date(Number(deadline) * 1000).toISOString());
  console.log("Secret Code:", secretCode);

  // Create commitment
  const createTx = await commitClub.write.createCommit([
    commitmentName,
    stakeAmount,
    minCheckIns,
    deadline,
    codeHash
  ]);

  console.log("✅ Commitment created! TX:", createTx);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + createTx);

  // The commitment ID will be the previous nextCommitmentId
  const commitmentId = nextCommitmentId;
  console.log("🎯 Commitment ID:", commitmentId.toString());

  // Join the commitment
  console.log("\n🤝 Joining commitment...");
  const joinTx = await commitClub.write.joinCommit([commitmentId], {
    value: stakeAmount
  });

  console.log("✅ Joined commitment! TX:", joinTx);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + joinTx);

  // Check in with the secret code
  console.log("\n✅ Checking in with secret code...");
  const checkInTx = await commitClub.write.checkIn([commitmentId, secretCode]);

  console.log("✅ Checked in! TX:", checkInTx);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + checkInTx);

  // Create a second commitment for more events
  console.log("\n📝 Creating second commitment...");
  const nextCommitmentId2 = await commitClub.read.nextCommitmentId();
  console.log("📊 Next commitment ID for second commitment:", nextCommitmentId2.toString());
  
  const createTx2 = await commitClub.write.createCommit([
    "Coffee Meetup",
    parseEther("0.005"),
    3,
    BigInt(Math.floor(Date.now() / 1000) + 7200),
    keccak256(stringToHex("COFFEE2024"))
  ]);

  console.log("✅ Second commitment created! TX:", createTx2);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + createTx2);

  const commitmentId2 = nextCommitmentId2;
  console.log("🎯 Second Commitment ID:", commitmentId2.toString());

  // Join second commitment
  console.log("\n🤝 Joining second commitment...");
  const joinTx2 = await commitClub.write.joinCommit([commitmentId2], {
    value: parseEther("0.005")
  });

  console.log("✅ Joined second commitment! TX:", joinTx2);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + joinTx2);

  // Check in to second commitment
  console.log("\n✅ Checking in to second commitment...");
  const checkInTx2 = await commitClub.write.checkIn([commitmentId2, "COFFEE2024"]);

  console.log("✅ Checked in to second commitment! TX:", checkInTx2);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + checkInTx2);

  console.log("\n🎉 All transactions completed successfully!");
  console.log("\n📊 Summary of events generated:");
  console.log("1. 2 CommitmentCreated events");
  console.log("2. 2 Joined events");
  console.log("3. 2 CheckedIn events");
  console.log("\n🔍 View all events on Flowscan: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
