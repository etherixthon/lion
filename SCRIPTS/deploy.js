const { ethers } = require("hardhat");

async function main() {
  const basePrice = ethers.parseEther("0.01");
  const maxResalePercent = 20;

  const EventTicket = await ethers.getContractFactory("SecureEventTicketing");
  const eventTicket = await EventTicket.deploy(basePrice, maxResalePercent);

  console.log(`✅ Contract deployed at: ${eventTicket.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
