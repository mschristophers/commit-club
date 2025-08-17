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

## Technical Architecture

### Smart Contracts (Solidity)

**Core Contract**: `CommitClub.sol`
- **Solidity Version**: ^0.8.24 (latest stable)
- **Security**: OpenZeppelin Contracts v5.4.0
  - `ReentrancyGuard`: Prevents reentrancy attacks on financial functions
  - `Address`: Safe address operations for payable transfers
- **Gas Optimization**: Solidity optimizer enabled (200 runs)
- **Error Handling**: Custom errors for better gas efficiency and UX

**Key Features**:
- N-of-M check-in system with refunds if threshold not met
- Time-based deadline enforcement
- Secret code verification via keccak256 hashing
- Automatic reward distribution to attendees
- Comprehensive event logging for frontend integration

**Data Structures**:
```solidity
struct Commitment {
    address organizer;
    uint256 stakeAmount;
    uint16 minCheckIns;
    uint64 deadline;
    bytes32 codeHash;
    bool settled;
    uint256 totalStaked;
}
```

### Frontend Application (Next.js 15)

**Framework**: Next.js 15.4.6 with App Router
- **React**: 19.1.0 (latest)
- **TypeScript**: Full type safety throughout
- **Build Tool**: Turbopack for faster development
- **Styling**: Tailwind CSS v4 with PostCSS

**Key Dependencies**:
- **Authentication**: Privy v2.21.3 (email/SMS + embedded wallets)
- **Blockchain**: Viem v2.33.3 + Wagmi v2.16.3 (modern web3 stack)
- **State Management**: Zustand v5.0.7 (lightweight, TypeScript-first)
- **UI Enhancements**: 
  - `qrcode.react` v4.2.0 (QR code generation)
  - `canvas-confetti` v1.9.3 (celebration effects)

**Architecture Patterns**:
- **Custom Hooks**: `usePrivyWallet`, `useCommitClub` for blockchain interactions
- **Store Pattern**: Zustand stores for UI state and demo data
- **Component Composition**: Reusable components with TypeScript interfaces

### Development Tools

**Smart Contract Development**:
- **Hardhat**: v3.0.0 with TypeScript support
- **Testing**: 
  - Solidity tests with Forge-std
  - Node.js integration tests
  - 9 comprehensive test cases
- **Deployment**: Hardhat Ignition for deployment management
- **Networks**: Flow EVM Testnet (Chain ID: 545)

**Frontend Development**:
- **Linting**: ESLint v9 with Next.js config
- **Type Checking**: TypeScript v5 with strict mode
- **Hot Reload**: Turbopack for instant updates
- **Environment**: Dotenv for configuration management

### Blockchain Integration

**Supported Networks**:
- **Flow EVM Testnet**: Primary deployment (fast, cheap transactions)
- **Arbitrum Sepolia**: Alternative testnet
- **Base Sepolia**: Alternative testnet

**Wallet Integration**:
- **Privy**: Embedded wallet solution
- **Multi-chain**: Automatic chain switching
- **Gas Estimation**: Built-in gas optimization

### Security Features

**Smart Contract Security**:
- ✅ Reentrancy protection on all financial functions
- ✅ Input validation and custom errors
- ✅ Time-based access controls
- ✅ Secure random number generation (keccak256)
- ✅ Safe transfer patterns

**Frontend Security**:
- ✅ Environment variable protection
- ✅ Type-safe blockchain interactions
- ✅ Input sanitization
- ✅ Error boundary implementation

### Performance Optimizations

**Smart Contracts**:
- Gas-optimized data structures
- Efficient mapping patterns
- Minimal storage operations
- Optimized Solidity compiler settings

**Frontend**:
- Next.js App Router for optimal routing
- Turbopack for faster builds
- Tailwind CSS for minimal CSS bundle
- Lazy loading and code splitting

### Smart Contract API

**Core Functions**:

```solidity
// Create a new commitment
function createCommit(
    string calldata name,
    uint256 stakeAmount,
    uint16 minCheckIns,
    uint64 deadline,
    bytes32 codeHash
) external returns (uint256 id)

// Join a commitment by staking
function joinCommit(uint256 id) external payable nonReentrant

// Check in using secret code
function checkIn(uint256 id, string calldata code) external

// Settle and distribute rewards
function settle(uint256 id) external nonReentrant
```

**Events**:
```solidity
event CommitmentCreated(uint256 indexed id, address indexed organizer, string name, uint256 stakeAmount, uint16 minCheckIns, uint64 deadline);
event Joined(uint256 indexed id, address indexed user, uint256 amount);
event CheckedIn(uint256 indexed id, address indexed user);
event Settled(uint256 indexed id, address[] attendees, uint256 amountPerPerson);
```

**Custom Errors**:
```solidity
error CommitmentNotFound();
error CommitmentExpired();
error CommitmentSettled();
error InvalidStakeAmount();
error AlreadyJoined();
error AlreadyCheckedIn();
error InsufficientPayment();
error ThresholdNotMet();
error OnlyOrganizer();
```

### Frontend Architecture

**State Management**:
```typescript
// UI Store (Zustand)
interface UIStore {
  toasts: Toast[];
  selectedChain: Chain;
  addToast: (message: string, type: ToastType) => void;
  setSelectedChain: (chain: Chain) => void;
}

// Demo Store (Zustand)
interface DemoStore {
  commitments: Commitment[];
  addCommitment: (commitment: Commitment) => string;
  joinCommitment: (id: string, address: string) => void;
  checkInToCommitment: (id: string, address: string) => void;
}
```

**Custom Hooks**:
```typescript
// Blockchain interactions
const { connected, ready, address } = usePrivyWallet();
const { addCommitment, joinCommitment } = useCommitClub();
```

**Component Structure**:
```
src/
├── app/                    # Next.js App Router pages
│   ├── c/[id]/            # Dynamic commitment pages
│   ├── new/               # Create commitment page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── TopBar.tsx         # Navigation and wallet connection
│   ├── CommitmentDetails.tsx # Commitment display
│   └── Toast.tsx          # Notification system
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state stores
├── lib/                   # Utility libraries
└── types/                 # TypeScript type definitions
```

### Deployment & Environment

**Environment Variables** (`.env.local`):
```bash
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Blockchain Configuration
PRIVATE_KEY=your_wallet_private_key_without_0x
FLOW_EVM_TESTNET_RPC=https://testnet.evm.nodes.onflow.org
NEXT_PUBLIC_COMMIT_CLUB_ADDRESS=0xE7658266c49E975ABcC6ce6f5f60629f61dca4CB

# Alternative Networks (optional)
SEPOLIA_RPC_URL=your_sepolia_rpc_url
SEPOLIA_PRIVATE_KEY=your_sepolia_private_key
```

**Deployment Process**:
1. **Smart Contracts**: Hardhat Ignition for reproducible deployments
2. **Frontend**: Vercel-ready with Next.js static optimization
3. **Environment**: Multi-environment support (dev/staging/prod)

**Network Configuration**:
```typescript
// Hardhat config networks
flowTestnet: {
  url: "https://testnet.evm.nodes.onflow.org",
  chainId: 545,
  accounts: [process.env.PRIVATE_KEY]
}
```

**Gas Optimization**:
- **Contract Size**: ~15KB (under limit)
- **Gas Usage**: ~150k gas for commitment creation
- **Optimization**: Solidity optimizer with 200 runs

## Learn More

- [Hardhat 3 Getting Started](https://hardhat.org/docs/getting-started) - How to build smart contracts
- [Privy React Setup](https://docs.privy.io/basics/react/setup) - How to add easy user login
- [Flow EVM Using](https://developers.flow.com/evm/using) - How to use the Flow blockchain
- [Flow EVM Faucet](https://developers.flow.com/evm/faucet) - Get free test money
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) - Security best practices
- [Viem Documentation](https://viem.sh/) - Modern Ethereum TypeScript interface
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management