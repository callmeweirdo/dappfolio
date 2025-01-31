import { ethers } from "ethers";
import { portfolioManagerABI } from "../contract/abi.json";

// Use Hardhat node (or update to Infura/Alchemy for testing/Mainet)

const provider = new ethers.JsonRpcProvider("http://localhost:8645");

// Smart contract details

