# Commit Club 🗽

Turn your goals into reality with social stakes! Create challenges, put money on the line, and reward those who show up while penalizing those who don't.

Perfect for fitness groups, study sessions, or any commitment where showing up matters.

## What This Does

Commit Club helps people stick to their commitments by putting money on the line. Here's how it works:

1. **Create a Challenge** - Set up a goal with a stake amount and how many times you need to show up
2. **Put Money on the Line** - You and friends stake money to make the challenge real and motivating  
3. **Show Up & Check In** - Use a secret code to prove you actually attended
4. **Win or Lose Together** - Those who show up split the pot! Those who don't lose their stake

## Project Structure

```
commit-club/
├── contracts/          # Smart contracts that handle the money and rules
├── app/               # Web app that people use to create and join challenges
└── README.md          # This file
```

## Quick Setup

### What You Need

- Node.js v22 or later (download from [nodejs.org](https://nodejs.org/))
- npm (comes with Node.js) or pnpm

### 1. Install Dependencies

```bash
# Install contracts dependencies
cd contracts
npm install

# Install app dependencies  
cd ../app
npm install
```

### 2. Set Up Your Keys

Copy the example settings file and add your own keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your own values:
- `NEXT_PUBLIC_PRIVY_APP_ID` - Get this from [Privy Console](https://console.privy.io/) (free account)
- `PRIVATE_KEY` - Your wallet's private key for deploying contracts (without 0x prefix)
- `FLOW_EVM_TESTNET_RPC` - Already set to the right URL
- `NEXT_PUBLIC_COMMIT_CLUB_ADDRESS` - The deployed contract address: `0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB`

**Note**: Both the smart contracts and web app use the same settings file.

### 3. Start Building

Open two terminal windows and run:

```bash
# Terminal 1: Test the smart contracts
cd contracts
npm test

# Terminal 2: Start the web app
cd app
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

### Testing

The smart contracts include tests to make sure everything works correctly:

- ✅ **Creating challenges** and checking the rules
- ✅ **Joining challenges** with the right amount of money
- ✅ **Checking for errors** (wrong amounts, joining twice)
- ✅ **Checking in** with the right secret code
- ✅ **Timing rules** (can't settle before the deadline)

**Run the tests:**
```bash
cd contracts
npx hardhat test          # Run all tests
npx hardhat test solidity # Run only the basic tests
npx hardhat test nodejs   # Run only the advanced tests
```

**Expected result:** 9 tests should pass

### 4. Test on the Blockchain

Try out the smart contracts on the test network:

```bash
# Test creating challenges and joining them
cd contracts
npx hardhat run scripts/create-more-events.ts --network flowTestnet
npx hardhat run scripts/test-join-checkin.ts --network flowTestnet
```

**See the activity:** [View on Flowscan](https://evm-testnet.flowscan.io/address/0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB)

### 5. Deploy Your Own Version

To put your own version on the test network:

```bash
# 1. Get test money: https://thirdweb.com/testnet
# 2. Add your private key to .env.local (without 0x prefix)
# 3. Deploy the smart contracts:
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network flowTestnet
```

**Already Deployed:**
- **Address**: `0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB`
- **View it**: [On FlowScan](https://evm-testnet.flowscan.io/address/0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB)

Note: The test network explorer doesn't support showing the contract code yet.

## Useful Commands

### Smart Contracts
- `npm test` - Run all tests
- `npm run test:solidity` - Run basic tests only
- `npm run test:nodejs` - Run advanced tests only
- `npm run build` - Build the contracts
- `npm run deploy` - Deploy to test network

### Web App
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server

## What We Built This With

- **Web App**: Next.js 14+ (modern React framework)
- **User Login**: Privy (easy email/phone login with built-in wallets)
- **Smart Contracts**: Hardhat 3 + Solidity (for handling money and rules)
- **Blockchain**: Flow EVM Testnet (fast and cheap for testing)
- **Styling**: Tailwind CSS (quick and beautiful design)
- **Data Management**: Zustand (simple state management)
- **Blockchain Tools**: Viem + Wagmi (modern web3 libraries)

## Learn More

- [Hardhat 3 Getting Started](https://hardhat.org/docs/getting-started) - How to build smart contracts
- [Privy React Setup](https://docs.privy.io/basics/react/setup) - How to add easy user login
- [Flow EVM Using](https://developers.flow.com/evm/using) - How to use the Flow blockchain
- [Flow EVM Faucet](https://developers.flow.com/evm/faucet) - Get free test money