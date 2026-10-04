# Secure Blockchain Voting System

## Overview
A decentralized voting application that uses Solidity smart contracts and a local Ethereum-compatible blockchain to provide transparent, tamper-resistant vote recording and automated vote counting.

## Problem Statement
Traditional centralized voting records are susceptible to tampering, hidden audits, and single points of failure. This academic project demonstrates how blockchain technology can provide transparent and tamper-resistant transaction recording for election systems.

## Objectives
- Decentralized vote recording
- Smart-contract-based validation
- One-vote-per-wallet enforcement
- Transparent vote counting
- Blockchain transaction verification

## Architecture
React (Frontend Dashboard)
↓
MetaMask (Web3 Wallet Provider)
↓
Ganache (Local RPC)
↓
Solidity Smart Contract (SecureVoting)
↓
Blockchain Transactions (State Changes)

## Technology Stack
- **Solidity**: Smart contract programming language
- **Truffle**: EVM framework for compiling and testing
- **Ganache**: Local Ethereum-compatible blockchain
- **React**: Modern frontend library for the dashboard UI
- **Web3.js**: Ethereum JavaScript API
- **MetaMask**: Browser extension for identity management and transaction signing
- **JavaScript**: Client-side logic and tests

## Smart Contract Mechanism
The `SecureVoting` smart contract is responsible for the core logic:
- `addCandidate()`: Allows the administrator to register candidates before the election starts.
- `startElection()`: Transitions the election state to Active, enabling voters to cast votes.
- `endElection()`: Stops the election, preventing further votes.
- `vote()`: Validates that the election is active, the candidate is valid, and the voter has not voted before, then records the vote and emits an event.

## Voting Flow
The complete transaction lifecycle:
1. User connects MetaMask to the Ganache local network.
2. The user navigates to the dashboard and selects a candidate.
3. The user signs the vote transaction via MetaMask.
4. The transaction is validated by the `SecureVoting` contract.
5. The state is permanently updated on the Ganache blockchain.
6. The frontend automatically updates the candidate vote count and displays the blockchain transaction details (hash, block, gas used).

## Security Mechanisms
- **Require Validations**: Smart contract functions enforce rigorous constraints using `require()`.
- **Voter Restriction**: Each wallet address is mapped to a boolean to enforce one-person-one-vote.
- **Admin Authorization**: Only the contract deployer can add candidates or manage the election state.
- **Election State**: Prevents voting before start or after end.
- **Candidate Validation**: Rejects votes for non-existent candidate IDs.

## Installation
First, clone the repository and install dependencies.
```sh
npm install
cd client
npm install
```

## Ganache Setup
Start Ganache locally on port 7545:
```sh
npx ganache -p 7545 -h 127.0.0.1
```

## Smart Contract Deployment
Deploy the `SecureVoting` contract to the Ganache network:
```sh
npx truffle compile
npx truffle migrate --reset
```

## Frontend
Start the React application dashboard:
```sh
cd client
npm start
```

## MetaMask
1. Install the MetaMask extension.
2. Add a Custom Network:
   - Network Name: Ganache Local
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: 1337
3. Import an account using a private key from your Ganache instance.

## Demonstration
1. Start Ganache and the React application.
2. The Admin (deployer account) connects and adds Candidates.
3. The Admin clicks "Start Election".
4. A Voter connects their account.
5. The Voter clicks "Cast Vote" on a candidate.
6. The Voter confirms the MetaMask transaction.
7. The Dashboard displays the transaction hash and updated vote counts.
8. The Admin clicks "End Election".

## Project Structure
```
secure-blockchain-voting/
├── client/          # React frontend dashboard
├── contracts/       # Solidity smart contracts
├── migrations/      # Truffle deployment scripts
├── test/            # Truffle unit tests
├── docs/            # Academic documentation
├── SETUP.md         # Environment setup guide
└── README.md        # Project documentation
```

## Limitations
This is an academic/local blockchain demonstration. It does not provide absolute election security for production government elections and does not implement advanced features like zero-knowledge proofs for voter anonymity.

## Team
Developed by Rohhith and Team.
