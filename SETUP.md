# Environment
- **Node.js**: v26.4.0
- **npm**: v11.17.0
- **Truffle**: Local dev dependency installed via npm
- **Ganache**: Local dev dependency installed via npm (Ganache CLI)
- **React**: v17.0.2
- **Solidity**: >=0.4.22 <0.9.0

# How to start Ganache
Run the local blockchain daemon:
```sh
npx ganache -p 7545 -h 127.0.0.1
```

# How to deploy the contract
Compile and migrate using Truffle:
```sh
npx truffle compile
npx truffle migrate --reset
```

# How to start React
Start the frontend development server:
```sh
cd client
npm start
```

# How to connect MetaMask
1. Add custom network: `http://127.0.0.1:7545` (Chain ID 1337).
2. Import a Ganache account using its private key (available in the Ganache CLI output).

# How to perform a vote
1. Connect with the Admin account (the first account that deployed the contract) and add candidates.
2. Click "Start Election".
3. Switch MetaMask to a voter account.
4. Click "Cast Vote" on the desired candidate.
5. Confirm the transaction in MetaMask.

# Blockchain transaction flow
See `docs/blockchain-flow.md` for a complete academic explanation of the transaction lifecycle.
