# Encode Week3: Tokenized Ballot Project

This project demonstrates the use of ERC20Votes to get a past snapshot of voting power. This token can be used to vote on multiple proposal.

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v18 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

🚨 If you are using a version < v18 you will need to remove `openssl-legacy-provider` from the `start` script in `package.json`

> ### The MyERC20Votes Address on Sepolia Network is: `0x1734E67eE6c21f2Ff59CC9F9B209f798f2448862`
>
> ### The TokenizedBallot Address on Sepolia Network is: `0xBEd8efAbfB986EF7b791CDE1694FC1EB56db0DFc`

---

### Vote for your fav Food Chain: (0 index based)

0. Wendys
1. Starbucks
2. McDonalds
3. KFC
4. Dunkin

---

> 1️⃣ clone/fork 🏗
> Encode-Week-Three-Project:

```bash
git clone https://github.com/bdomingu/Encode-Week-Three-Project.git
```

> 2️⃣ install and start your 👷‍ Hardhat chain:

```bash
cd Encode-Week-Three-Project
yarn install
```

> 3️⃣ cp `.env.example` to `.env` and fill the required keys

```bash
cp .env.example .env
```

# Usage

> #### Run the script of choice with `yarn ts-node --files ./scripts/<script name>`

1. To deploy the MyVoteToken contract, run
   ```
   yarn ts-node --files ./scripts/01-deploy-myerc20votes.ts
   ```
   > > e.g: `yarn ts-node --files ./scripts/01-deploy-ballot.ts`
2. To mint tokens to a address, run

   ```
   yarn ts-node --files ./scripts/02-mintTokens.ts --votesContractAddress <MyERC20Votes_Contract_Address> --minterAddress <Minter_Address> --mintAmount <Mint_Amount>
   ```

   > > e.g: `yarn ts-node --files ./scripts/02-mintTokens.ts --votesContractAddress 0xBc04B42E46366716841Afd78728a712AC8c768D6 --minterAddress 0xF6d38b257b4DD900BABe5B0f48A877943C0f1312 --mintAmount 100`

3. To delegate vote, run

   ```
   yarn ts-node --files ./scripts/03-delegateTokens.ts --votesContractAddress <MyERC20Votes_Contract_Address> --delegateAddress <Delegate_Address>
   ```

   > > e.g: `yarn ts-node --files ./scripts/03-delegateTokens.ts --votesContractAddress 0xBc04B42E46366716841Afd78728a712AC8c768D6 --delegateAddress 0x9BB7c044FD16573754815bc854f67fdE8370f701`

### In order to vote you need to deploy the Tokenized Ballot Contract.

4. To deploy the Tokenized Ballot contract, run
   ```
   yarn ts-node --files ./scripts/04-deploy-tokenizedBallot.ts <MyERC20Votes_Contract_Address> <Proposal_Names>
   ```
   > > e.g: `yarn ts-node --files ./scripts/04-deploy-tokenizedBallot.ts 0x1734E67eE6c21f2Ff59CC9F9B209f798f2448862 Wendys Starbucks McDonalds KFC Dunkin`
5. To vote, run
   ```
   yarn ts-node --files ./scripts/vote.ts <BALLOT_ADDRESS> <PROPOSAL NUMBER>
   ```
   > > e.g: `yarn ts-node --files ./scripts/vote.ts 0x66eb0E81E85952816f4e629a929ce3D5f2B36fDB 1`
6. To get the winning proposal, run
   ```
   yarn ts-node --files ./scripts/winningProposal.ts <BALLOT_ADDRESS>
   ```
   > > e.g: `yarn ts-node --files ./scripts/winningProposal.ts 0x66eb0E81E85952816f4e629a929ce3D5f2B36fDB`
