const { ethers } = require("ethers");
require("dotenv").config();

const RPC = process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Check if blockchain is configured
const BLOCKCHAIN_ENABLED = !!(PRIVATE_KEY && CONTRACT_ADDRESS && process.env.BLOCKCHAIN_RPC);

let provider, wallet, contract;

if (BLOCKCHAIN_ENABLED) {
    try {
        const ABI_ARTIFACT = require("../utils/abi/TourChainLedger.json");
        const ABI = ABI_ARTIFACT.abi;

        provider = new ethers.JsonRpcProvider(RPC);

        wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
        console.log(`✅ Blockchain Service Initialized. Contract: ${CONTRACT_ADDRESS}`);
    } catch (e) {
        console.warn("⚠️ Blockchain Service failed to initialize:", e.message);
    }
} else {
    console.warn("⚠️ Blockchain Service DISABLED: BLOCKCHAIN_RPC / PRIVATE_KEY / CONTRACT_ADDRESS not set. Journeys will be recorded in DB only.");
}

function toJourneyId(idString) {
    if (!idString) {
        return ethers.keccak256(ethers.toUtf8Bytes("default-id"));
    }
    try {
        return ethers.keccak256(ethers.toUtf8Bytes(idString));
    } catch (e) {
        console.error("toJourneyId error:", e);
        throw e;
    }
}

function createPanicDataHash(panicData) {
    const dataString = `${panicData.location.lat},${panicData.location.lng},${panicData.timestamp},${panicData.type}`;
    return ethers.keccak256(ethers.toUtf8Bytes(dataString));
}

async function recordJourneyStart(journeyData) {
    if (!BLOCKCHAIN_ENABLED || !contract) {
        console.warn("⚠️ Blockchain disabled — skipping recordJourneyStart");
        return null;
    }

    try {
        const idStr = journeyData._id.toString();
        let journeyId = toJourneyId(idStr);

        if (!journeyId.startsWith('0x')) {
            journeyId = '0x' + journeyId;
        }

        const startDate = Math.floor(new Date(journeyData.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(journeyData.endDate).getTime() / 1000);

        console.log(`DEBUG: Sending transaction startJourney('${journeyId}', ${startDate}, ${endDate})`);

        const tx = await contract.startJourney(journeyId, startDate, endDate);
        const receipt = await tx.wait();
        console.log(`✅ Journey Start Recorded. TxHash: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error in recordJourneyStart:", error.message);
        throw error;
    }
}

async function recordPanicEvent(panicData) {
    if (!BLOCKCHAIN_ENABLED || !contract) {
        console.warn("⚠️ Blockchain disabled — skipping recordPanicEvent");
        return null;
    }

    try {
        const journeyId = toJourneyId(panicData.journeyId.toString());
        const dataHash = createPanicDataHash(panicData);

        const tx = await contract.alertPanic(journeyId, dataHash);
        const receipt = await tx.wait();
        console.log(`🚨 Panic Event Recorded. TxHash: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error in recordPanicEvent:", error.message);
        throw error;
    }
}

async function recordJourneyEnd(journeyData) {
    if (!BLOCKCHAIN_ENABLED || !contract) {
        console.warn("⚠️ Blockchain disabled — skipping recordJourneyEnd");
        return null;
    }

    try {
        const journeyId = toJourneyId(journeyData._id.toString());

        const tx = await contract.endJourney(journeyId);
        const receipt = await tx.wait();
        console.log(`🏁 Journey End Recorded. TxHash: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error in recordJourneyEnd:", error.message);
        throw error;
    }
}

module.exports = {
    recordJourneyStart,
    recordPanicEvent,
    recordJourneyEnd
};