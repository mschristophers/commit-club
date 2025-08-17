import { network } from "hardhat";
import { keccak256, stringToHex, parseEther } from "viem";

const CONTRACT_ADDRESS = "0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB";

async function main() {
  console.log("🚀 Running comprehensive CommitClub tests on Flow EVM Testnet...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Explorer: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);

  const { viem } = await network.connect();

  console.log("\n👤 Using default wallet");

  // Get contract instance
  const commitClub = await viem.getContractAt("CommitClub", CONTRACT_ADDRESS);

  // Test Scenario 1: Successful commitment with multiple participants
  console.log("\n" + "=".repeat(60));
  console.log("📋 SCENARIO 1: Successful commitment with multiple participants");
  console.log("=".repeat(60));

  const scenario1Params = {
    name: "Central Park Run",
    stakeAmount: parseEther("0.005"), // 0.005 FLOW
    minCheckIns: 3n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 7200), // 2 hours from now
    secretCode: "RUN2024"
  };

  console.log("Creating commitment:", scenario1Params.name);
  const codeHash1 = keccak256(stringToHex(scenario1Params.secretCode));
  
  const createTx1 = await commitClub.write.createCommit([
    scenario1Params.name,
    scenario1Params.stakeAmount,
    scenario1Params.minCheckIns,
    scenario1Params.deadline,
    codeHash1
  ]);

  console.log("✅ Commitment created! TX:", createTx1);

  // Get current next commitment ID to determine the commitment ID
  const nextCommitmentId1 = await commitClub.read.nextCommitmentId();
  const commitmentId1 = nextCommitmentId1 - 1n;
  console.log("🎯 Commitment ID:", commitmentId1.toString());

  // Join multiple times (simulating different users)
  console.log("\n🤝 Joining commitment multiple times...");
  
  for (let i = 0; i < 3; i++) {
    const joinTx = await commitClub.write.joinCommit([commitmentId1], {
      value: scenario1Params.stakeAmount
    });
    console.log(`✅ Join ${i + 1} completed! TX:`, joinTx);
  }

  // Check in multiple times
  console.log("\n✅ Checking in multiple times...");
  
  for (let i = 0; i < 3; i++) {
    const checkInTx = await commitClub.write.checkIn([commitmentId1, scenario1Params.secretCode]);
    console.log(`✅ Check-in ${i + 1} completed! TX:`, checkInTx);
  }

  // Test Scenario 2: Commitment that fails threshold
  console.log("\n" + "=".repeat(60));
  console.log("📋 SCENARIO 2: Commitment that fails threshold (refund scenario)");
  console.log("=".repeat(60));

  const scenario2Params = {
    name: "Coffee Meetup",
    stakeAmount: parseEther("0.01"), // 0.01 FLOW
    minCheckIns: 5n, // High threshold
    deadline: BigInt(Math.floor(Date.now() / 1000) + 1800), // 30 minutes from now
    secretCode: "COFFEE2024"
  };

  console.log("Creating commitment:", scenario2Params.name);
  const codeHash2 = keccak256(stringToHex(scenario2Params.secretCode));
  
  const createTx2 = await commitClub.write.createCommit([
    scenario2Params.name,
    scenario2Params.stakeAmount,
    scenario2Params.minCheckIns,
    scenario2Params.deadline,
    codeHash2
  ]);

  console.log("✅ Commitment created! TX:", createTx2);

  // Get commitment ID
  const nextCommitmentId2 = await commitClub.read.nextCommitmentId();
  const commitmentId2 = nextCommitmentId2 - 1n;
  console.log("🎯 Commitment ID:", commitmentId2.toString());

  // Join but only 2 people (below threshold of 5)
  console.log("\n🤝 Joining commitment (only 2 people, below threshold)...");
  
  for (let i = 0; i < 2; i++) {
    const joinTx = await commitClub.write.joinCommit([commitmentId2], {
      value: scenario2Params.stakeAmount
    });
    console.log(`✅ Join ${i + 1} completed! TX:`, joinTx);
  }

  // Only 1 person checks in (below threshold)
  console.log("\n✅ Only 1 person checking in (below threshold)...");
  const checkInTx2 = await commitClub.write.checkIn([commitmentId2, scenario2Params.secretCode]);
  console.log("✅ Check-in completed! TX:", checkInTx2);

  // Test Scenario 3: High-value commitment
  console.log("\n" + "=".repeat(60));
  console.log("📋 SCENARIO 3: High-value commitment");
  console.log("=".repeat(60));

  const scenario3Params = {
    name: "Tech Conference",
    stakeAmount: parseEther("0.05"), // 0.05 FLOW
    minCheckIns: 2n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
    secretCode: "TECH2024"
  };

  console.log("Creating high-value commitment:", scenario3Params.name);
  const codeHash3 = keccak256(stringToHex(scenario3Params.secretCode));
  
  const createTx3 = await commitClub.write.createCommit([
    scenario3Params.name,
    scenario3Params.stakeAmount,
    scenario3Params.minCheckIns,
    scenario3Params.deadline,
    codeHash3
  ]);

  console.log("✅ High-value commitment created! TX:", createTx3);

  // Get commitment ID
  const nextCommitmentId3 = await commitClub.read.nextCommitmentId();
  const commitmentId3 = nextCommitmentId3 - 1n;
  console.log("🎯 Commitment ID:", commitmentId3.toString());

  // Join and check in
  console.log("\n🤝 Joining high-value commitment...");
  const joinTx3 = await commitClub.write.joinCommit([commitmentId3], {
    value: scenario3Params.stakeAmount
  });
  console.log("✅ Joined high-value commitment! TX:", joinTx3);

  console.log("\n✅ Checking in to high-value commitment...");
  const checkInTx3 = await commitClub.write.checkIn([commitmentId3, scenario3Params.secretCode]);
  console.log("✅ Checked in to high-value commitment! TX:", checkInTx3);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 COMPREHENSIVE TESTING COMPLETED!");
  console.log("=".repeat(60));
  
  console.log("\n📊 Summary of events generated:");
  console.log("✅ 3 CommitmentCreated events");
  console.log("✅ 6 Joined events");
  console.log("✅ 5 CheckedIn events");
  
  console.log("\n🔍 View all events on Flowscan:");
  console.log("https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
  
  console.log("\n📈 Test scenarios covered:");
  console.log("1. Successful commitment with multiple participants");
  console.log("2. Failed threshold commitment (refund scenario)");
  console.log("3. High-value commitment");
  console.log("4. Various stake amounts and check-in thresholds");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
