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


### Address of the Deployed Contract:
```
0x0b49bFed844489a31599335703696090C9532f4a
```