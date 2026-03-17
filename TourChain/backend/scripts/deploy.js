const fs = require('fs');
const path = require('path');

async function main() {
  const TourChainLedger = await ethers.getContractFactory("TourChainLedger");
  console.log("Deploying TourChainLedger...");
  const ledger = await TourChainLedger.deploy();
  await ledger.waitForDeployment();
  const address = await ledger.getAddress();
  const block = await ethers.provider.getBlockNumber();
  console.log(`✅ TourChainLedger deployed to: ${address}`);
  console.log(`✅ Deployed in block number: ${block}`);

  // Update .env file
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${address}`);
  } else {
    envContent += `\nCONTRACT_ADDRESS=${address}`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log('📝 Updated .env with new contract address.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });