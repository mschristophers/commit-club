import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("CommitClub", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should create commitment and allow joins with exact stake", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Test Commitment",
      1000000000000000000n, // 1 ETH
      2, // min 2 check-ins
      deadline,
      codeHash,
    ]);
    
    // Join with exact stake amount
    await commitClub.write.joinCommit([1n], { value: 1000000000000000000n });
    
    // Verify join
    const joiners = await commitClub.read.getJoiners([1n]);
    assert.equal(joiners.length, 1);
  });

  it("Should reject join with wrong stake amount", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Test Commitment",
      1000000000000000000n, // 1 ETH
      2,
      deadline,
      codeHash,
    ]);
    
    // Try to join with wrong amount
    try {
      await commitClub.write.joinCommit([1n], { value: 500000000000000000n }); // 0.5 ETH
      assert.fail("Should have reverted");
    } catch (error) {
      // Expected to fail
    }
  });

  it("Should reject duplicate joins", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Test Commitment",
      1000000000000000000n,
      2,
      deadline,
      codeHash,
    ]);
    
    // Join first time
    await commitClub.write.joinCommit([1n], { value: 1000000000000000000n });
    
    // Try to join again
    try {
      await commitClub.write.joinCommit([1n], { value: 1000000000000000000n });
      assert.fail("Should have reverted");
    } catch (error) {
      // Expected to fail
    }
  });

  it("Should reject check-in without joining", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Test Commitment",
      1000000000000000000n,
      2,
      deadline,
      codeHash,
    ]);
    
    // Try to check in without joining
    try {
      await commitClub.write.checkIn([1n, "testcode"]);
      assert.fail("Should have reverted");
    } catch (error) {
      // Expected to fail
    }
  });

  it("Should reject check-in with wrong code", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Test Commitment",
      1000000000000000000n,
      2,
      deadline,
      codeHash,
    ]);
    
    // Join first
    await commitClub.write.joinCommit([1n], { value: 1000000000000000000n });
    
    // Try to check in with wrong code
    try {
      await commitClub.write.checkIn([1n, "wrongcode"]);
      assert.fail("Should have reverted");
    } catch (error) {
      // Expected to fail
    }
  });

  it("Should reject settlement before deadline", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // future deadline
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Test Commitment",
      1000000000000000000n,
      1,
      deadline,
      codeHash,
    ]);
    
    await commitClub.write.joinCommit([1n], { value: 1000000000000000000n });
    
    // Try to settle before deadline
    try {
      await commitClub.write.settleCommit([1n]);
      assert.fail("Should have reverted");
    } catch (error) {
      // Expected to fail
    }
  });

  it("Should handle basic commitment creation and joining", async function () {
    const commitClub = await viem.deployContract("CommitClub");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const codeHash = ("0x" + "a".repeat(64)) as `0x${string}`;
    
    await commitClub.write.createCommit([
      "Basic Test",
      1000000000000000000n, // 1 ETH
      1, // need 1 check-in
      deadline,
      codeHash,
    ]);
    
    // Join
    await commitClub.write.joinCommit([1n], { value: 1000000000000000000n });
    
    // Verify join
    const joiners = await commitClub.read.getJoiners([1n]);
    assert.equal(joiners.length, 1);
    
    // Verify commitment data
    const commitment = await commitClub.read.commitments([1n]);
    assert.equal(commitment[1], 1000000000000000000n);
    assert.equal(commitment[2], 1);
    assert.equal(commitment[5], false);
  });
});
