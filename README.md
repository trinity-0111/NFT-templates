# NFT Templates

This project provides Solidity Smart Contract templates for various NFT types. 

## Usage

All contracts are compilable and come with Unit tests.

### Develop from templates

Modify contracts as necessary, you can expect to use general hardhat commands. Examples:
```shell
npx hardhat compile
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat coverage
```

### Deploy and Verify
Add a `.env` file at your root directory of the project with the following vars.
```shell
PRIVATE_KEY=12232435ggfgst5464
ETHERSCAN_API_KEY=YFYQ7FIDAIF
MAINNET_URL=https://mainnet.infura.io/v3/gdsewfxb3te
ROPSTEN_URL=https://ropsten.infura.io/v3/gds32fdsgs
```

You can deploy to an EVM supported blockchain of your choice. Here is an example to deploy `SimpleNFT` to Ropsten.
* `npx hardhat run scripts/SimpleNFT-deploy.ts --network ropsten`

To verify the contract through etherscan, create an etherscan account and API key, and update your `.env` with the key. 
* `npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS TOTAL_SUPPLY BASE_URI START_PRICE PRICE_INCREMENT_SIZE`

## Specification
### SimpleNFT
`SimpleNFT` is a simple NFT Solidity smart contract template that supports the following features:
* Max total supply (set at the time of deployment)
* Incremental pricing after each mint
* Updatable Base URI (by owner of contract only)
* Updatable price incremental size (by owner of contract only)