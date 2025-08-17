import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CommitClubModule", (m) => {
  const commitClub = m.contract("CommitClub");

  return { commitClub };
});
