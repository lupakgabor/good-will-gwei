import { ethers } from "hardhat";

async function main() {
  const donate = await ethers.deployContract("Donate");

  await donate.waitForDeployment();

  console.log(
    `Contract was deployed to ${donate.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
