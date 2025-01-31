import { ethers } from "ethers";
import { portfolioManagerABI } from "../contract/PortfolioManager.json";
import { EducationABI } from "../contract/Education.json";
import { ProjectABI } from "../contract/Projects.json";
import { ExperienceABI } from "../contract/Experience.json";
// import { portfolioManagerABI } from "../contract/PortfolioManager.json";

const portfolioManagerAddress  = "dcfgvhbjnk";

// Use Hardhat node (or update to Infura/Alchemy for testing/Mainet)

const provider = new ethers.JsonRpcProvider("http://localhost:8645");

// Smart contract details