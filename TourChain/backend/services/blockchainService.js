const { ethers } = require("ethers");
require("dotenv").config();

const RPC = process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI_ARTIFACT = require("../utils/abi/TourChainLedger.json");
const ABI = ABI_ARTIFACT.abi;

const provider = new ethers.JsonRpcProvider(RPC);

let wallet;
try {
    if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY missing in .env");
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
} catch (e) {
    console.error("Initialization Error: Failed to create wallet.", e.message);
}

let contract;
try {
    if (wallet && CONTRACT_ADDRESS) {
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
        console.log(`Blockchain Service Initialized. Contract: ${CONTRACT_ADDRESS}`);
    } else {
        console.warn("Blockchain Service Warning: Contract not initialized. Missing wallet or CONTRACT_ADDRESS.");
    }
} catch (e) {
    console.error("Initialization Error: Failed to create contract instance.", e.message);
}

function toJourneyId(idString) {
    if (!idString) {
        console.warn("toJourneyId called with empty string");
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
    if (!contract) throw new Error("Blockchain contract not initialized");

    try {
        console.log("DEBUG: recordJourneyStart input:", JSON.stringify(journeyData));
        const idStr = journeyData._id.toString();
        let journeyId = toJourneyId(idStr);

        // Safety check for 0x prefix
        if (!journeyId.startsWith('0x')) {
            console.warn(`WARNING: journeyId '${journeyId}' missing 0x prefix. Prepending.`);
            journeyId = '0x' + journeyId;
        }

        const startDate = Math.floor(new Date(journeyData.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(journeyData.endDate).getTime() / 1000);

        console.log(`DEBUG: Sending transaction startJourney('${journeyId}', ${startDate}, ${endDate})`);

        const tx = await contract.startJourney(journeyId, startDate, endDate);
        console.log(`DEBUG: Tx sent: ${tx.hash}. Waiting for confirmation...`);

        const receipt = await tx.wait();
        console.log(`✅ Journey Start Recorded. TxHash: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error in recordJourneyStart:", error);
        if (error.reason) console.error("Reason:", error.reason);
        if (error.code) console.error("Code:", error.code);
        if (error.argument) console.error("Argument:", error.argument);
        if (error.value) console.error("Value:", error.value);
        throw error;
    }
}

async function recordPanicEvent(panicData) {
    if (!contract) throw new Error("Blockchain contract not initialized");

    try {
        const journeyId = toJourneyId(panicData.journeyId.toString());
        const dataHash = createPanicDataHash(panicData);

        console.log(`DEBUG: Sending transaction alertPanic('${journeyId}', '${dataHash}')`);

        const tx = await contract.alertPanic(journeyId, dataHash);
        const receipt = await tx.wait();
        console.log(`🚨 Panic Event Recorded. TxHash: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error in recordPanicEvent:", error);
        throw error;
    }
}

async function recordJourneyEnd(journeyData) {
    if (!contract) throw new Error("Blockchain contract not initialized");

    try {
        const journeyId = toJourneyId(journeyData._id.toString());

        console.log(`DEBUG: Sending transaction endJourney('${journeyId}')`);

        const tx = await contract.endJourney(journeyId);
        const receipt = await tx.wait();
        console.log(`🏁 Journey End Recorded. TxHash: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error in recordJourneyEnd:", error);
        throw error;
    }
}

module.exports = {
    recordJourneyStart,
    recordPanicEvent,
    recordJourneyEnd
};