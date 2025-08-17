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

  // Test parameters
  const commitmentName = "Test NYC Meetup";
  const stakeAmount = parseEther("0.01"); // 0.01 FLOW
  const minCheckIns = 2n;
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
  const secretCode = "NYC2024";
  const codeHash = keccak256(stringToHex(secretCode));

  console.log("\n📝 Creating new commitment...");
  console.log("Name:", commitmentName);
  console.log("Stake Amount:", stakeAmount.toString(), "wei");
  console.log("Min Check-ins:", minCheckIns.toString());
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

  // Wait for transaction to be mined
  const createReceipt = await viem.waitForTransactionReceipt({ hash: createTx });
  console.log("📦 Transaction mined in block:", createReceipt.blockNumber);

  // Get the commitment ID from the event
  const logs = await viem.getLogs({
    address: CONTRACT_ADDRESS,
    event: {
      type: 'event',
      name: 'CommitmentCreated',
      inputs: [
        { type: 'uint256', name: 'id', indexed: true },
        { type: 'address', name: 'organizer', indexed: true },
        { type: 'string', name: 'name', indexed: false },
        { type: 'uint256', name: 'stakeAmount', indexed: false },
        { type: 'uint16', name: 'minCheckIns', indexed: false },
        { type: 'uint64', name: 'deadline', indexed: false }
      ]
    },
    fromBlock: createReceipt.blockNumber,
    toBlock: createReceipt.blockNumber
  });

  if (logs.length === 0) {
    throw new Error("No CommitmentCreated event found");
  }

  const commitmentId = logs[0].args.id;
  console.log("\n🎯 Commitment ID:", commitmentId);

  // Join the commitment
  console.log("\n🤝 Joining commitment...");
  const joinTx = await commitClub.write.joinCommit([commitmentId], {
    value: stakeAmount
  });

  console.log("✅ Joined commitment! TX:", joinTx);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + joinTx);

  const joinReceipt = await viem.waitForTransactionReceipt({ hash: joinTx });
  console.log("📦 Join transaction mined in block:", joinReceipt.blockNumber);

  // Check in with the secret code
  console.log("\n✅ Checking in with secret code...");
  const checkInTx = await commitClub.write.checkIn([commitmentId, secretCode]);

  console.log("✅ Checked in! TX:", checkInTx);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + checkInTx);

  const checkInReceipt = await viem.waitForTransactionReceipt({ hash: checkInTx });
  console.log("📦 Check-in transaction mined in block:", checkInReceipt.blockNumber);

  // Wait a bit to ensure deadline has passed
  console.log("\n⏰ Waiting for deadline to pass...");
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

  // Settle the commitment
  console.log("\n💰 Settling commitment...");
  const settleTx = await commitClub.write.settleCommit([commitmentId]);

  console.log("✅ Commitment settled! TX:", settleTx);
  console.log("View on Flowscan: https://evm-testnet.flowscan.io/tx/" + settleTx);

  const settleReceipt = await viem.waitForTransactionReceipt({ hash: settleTx });
  console.log("📦 Settlement transaction mined in block:", settleReceipt.blockNumber);

  console.log("\n🎉 All transactions completed successfully!");
  console.log("\n📊 Summary of events generated:");
  console.log("1. CommitmentCreated - New commitment created");
  console.log("2. Joined - User joined the commitment");
  console.log("3. CheckedIn - User checked in with secret code");
  console.log("4. Settled - Commitment settled and funds distributed");
  console.log("\n🔍 View all events on Flowscan: https://evm-testnet.flowscan.io/address/" + CONTRACT_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
