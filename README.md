# Commit Club

A tiny "N-of-M check-in pot" for NYC meetups (e.g., Central Park runs) built with Next.js, Privy, and Hardhat 3.

## Project Structure

```
commit-club/
├── contracts/          # Hardhat 3 project with Solidity contracts
├── app/               # Next.js 14+ frontend with Privy auth
└── README.md          # This file
```

## Quick Setup

### Prerequisites

- Node.js v22 or later
- npm or pnpm

### 1. Install Dependencies

```bash
# Install contracts dependencies
cd contracts
npm install

# Install app dependencies  
cd ../app
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- `NEXT_PUBLIC_PRIVY_APP_ID` - Get from [Privy Console](https://console.privy.io/)
- `PRIVATE_KEY` - Your wallet private key for contract deployment (without 0x prefix)
- `FLOW_EVM_TESTNET_RPC` - Flow EVM Testnet RPC URL (already set)
- `NEXT_PUBLIC_COMMIT_CLUB_ADDRESS` - Will be set after contract deployment

**Note**: Both the contracts and app projects read from this centralized `.env.local` file.

### 3. Development

```bash
# Terminal 1: Run contracts tests
cd contracts
npm test

# Terminal 2: Run Next.js app
cd app
npm run dev
```

Visit `http://localhost:3000` to see the app.

### 4. Deploy to Flow EVM Testnet

```bash
# 1. Get FLOW from faucet: https://thirdweb.com/testnet
# 2. Set PRIVATE_KEY in contracts/.env
# 3. Deploy:
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network flowTestnet
```

## Scripts

### Contracts
- `npm test` - Run all tests
- `npm run test:solidity` - Run Solidity tests only
- `npm run test:nodejs` - Run TypeScript tests only
- `npm run build` - Compile contracts
- `npm run deploy` - Deploy to Flow EVM Testnet

### App
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Tech Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript)
- **Auth**: Privy React SDK (embedded wallet, email/phone login)
- **Smart Contracts**: Hardhat 3 + Solidity
- **Blockchain**: Flow EVM Testnet
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Web3**: Viem + Wagmi

## Documentation

- [Hardhat 3 Getting Started](https://hardhat.org/docs/getting-started)
- [Privy React Setup](https://docs.privy.io/basics/react/setup)
- [Flow EVM Using](https://developers.flow.com/evm/using)
- [Flow EVM Faucet](https://developers.flow.com/evm/faucet)