## Good Will Gwei Backend

This is the backend component of the Good Will Gwei project, a blockchain-based donation platform leveraging the power of smart contracts to facilitate transparent and secure transactions for charitable causes.

### Setup
Follow these steps to prepare your development environment:

```shell
  yarn install
```
To execute tests:
```shell
  npx hardhat test
  # with gas usage reports
  REPORT_GAS=true npx hardhat test
```

For contract deployment on the Sepolia network:
```shell
  npx hardhat run scripts/deploy.ts --network sepolia
```


### Latest automatically deployed version on Sepolia

Deployed Contract: {{CONTRACT_ADDRESS}}

[Open generated ABI](https://raw.githubusercontent.com/lupakgabor/gwg/main/backend/contracts/DonateABI.json)

<sub>Commit hash: {{GITHUB_SHA}}</sub>
