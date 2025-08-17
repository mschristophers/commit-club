# Commit Club

A tiny "N-of-M check-in pot" for NYC meetups (e.g., Central Park runs) built with Next.js, Privy, and Hardhat 3.

## Quick Start

### Prerequisites
- Node.js v22+
- Yarn package manager
- Flow EVM Testnet account (get testnet FLOW from [faucet](https://testnet-faucet.onflow.org/))

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   yarn install
   cd app && yarn install
   ```

2. **Configure environment**
   ```bash
   # In contracts/ directory
   cp .env.example .env
   # Add your Flow EVM Testnet private key
   ```

3. **Deploy smart contract**
   ```bash
   # In contracts/ directory
   yarn build
   yarn deploy
   ```

4. **Start the app**
   ```bash
   # In app/ directory
   yarn dev
   ```

## Project Structure

```
commit-club/
├── contracts/          # Hardhat 3 project
│   ├── CommitClub.sol  # Smart contract
│   ├── hardhat.config.ts
│   └── package.json
├── app/               # Next.js frontend
│   ├── src/app/       # App router pages
│   └── src/components/
└── README.md
```

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Authentication**: Privy React SDK (embedded wallet, email/phone login)
- **Blockchain**: Hardhat 3, Solidity, Flow EVM Testnet
- **State Management**: Zustand
- **UI**: QR codes, confetti animations

## Development

- `cd contracts && yarn build` - Compile contracts
- `cd contracts && yarn test` - Run contract tests
- `cd contracts && yarn deploy` - Deploy to Flow EVM Testnet
- `cd app && yarn dev` - Start Next.js dev server

## Documentation

- [Hardhat 3 Getting Started](https://hardhat.org/docs/getting-started)
- [Privy React SDK Setup](https://docs.privy.io/basics/react/setup)
- [Flow EVM Documentation](https://developers.flow.com/evm/using)
- [Flow EVM Testnet Faucet](https://testnet-faucet.onflow.org/)