import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PortfolioManager from "../contract/PortfolioManager.json";
import Education from "../contract/Education.json";
import Experience from "../contract/Experience.json";
import Projects from "../contract/Projects.json";
import { MetaMaskSDK } from "@metamask/sdk-react-native";

const metamask = new MetaMaskSDK();
const PortfolioManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const useContracts = () => {
    const [portfolioManagerContract, setPortfolioManagerContract] = useState(null);
    const [educationContract, setEducationContract] = useState(null);
    const [projectContract, setProjectContract] = useState(null);
    const [experienceContract, setExperienceContract] = useState(null);

    const [portfolioManagerDetails, setPortfolioManagerDetails] = useState(null);
    const [educationDetails, setEducationDetails] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [experienceDetails, setExperienceDetails] = useState([]);

    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contractAddresses, setContractAddresses] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const initializeContracts = async () => {
            setLoading(true);
            setError(null); // Reset error state on retry

            try {
                // Initialize MetaMask provider
                const provider = await metamask.getProvider();
                if (!provider) {
                    throw new Error("MetaMask provider not found");
                }

                const web3Provider = new ethers.providers.Web3Provider(provider);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();

                // Check and switch to the correct network (Sepolia)
                const network = await web3Provider.getNetwork();
                const chainId = network.chainId;

                if (chainId !== 11155111) { // Sepolia chain ID
                    try {
                        await provider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: "0x11155111" }],
                        });
                    } catch (switchError) {
                        if (switchError.code !== 4902) {
                            throw new Error("Failed to switch to Sepolia network");
                        }
                    }
                }

                if (!isMounted) return;

                // Update state with account and chain details
                setAccount(address);
                setChainId(chainId);
                setConnected(true);

                // Initialize PortfolioManager contract
                const portfolioManagerInstance = new ethers.Contract(
                    PortfolioManagerAddress,
                    PortfolioManager.abi,
                    signer
                );
                setPortfolioManagerContract(portfolioManagerInstance);

                // Fetch contract addresses from PortfolioManager
                const addrs = await portfolioManagerInstance.getContractAddresses();
                setContractAddresses(addrs);

                // Initialize other contracts
                const educationInstance = new ethers.Contract(addrs.education, Education.abi, signer);
                const projectInstance = new ethers.Contract(addrs.Projects, Projects.abi, signer);
                const experienceInstance = new ethers.Contract(addrs.experience, Experience.abi, signer);

                setEducationContract(educationInstance);
                setProjectContract(projectInstance);
                setExperienceContract(experienceInstance);

                // Fetch data from contracts
                const fetchData = async () => {
                    try {
                        const [educationData, projectData, experienceData, portfolioData] = await Promise.all([
                            educationInstance.allEducationDetails(),
                            projectInstance.allProjectDetails(),
                            experienceInstance.allExperienceDetails(),
                            portfolioManagerInstance.getPortfolioDetails(address),
                        ]);

                        if (isMounted) {
                            setEducationDetails(educationData);
                            setProjectDetails(projectData);
                            setExperienceDetails(experienceData);
                            setPortfolioManagerDetails(portfolioData);
                        }
                    } catch (err) {
                        console.error("Error fetching contract data:", err);
                        if (isMounted) setError("Error fetching contract data");
                    }
                };

                await fetchData();
            } catch (error) {
                console.error("Error initializing contracts:", error);
                if (isMounted) setError(error.message);
                setConnected(false);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initializeContracts();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        portfolioManagerContract,
        educationContract,
        projectContract,
        experienceContract,
        portfolioManagerDetails,
        educationDetails,
        projectDetails,
        experienceDetails,
        account,
        connected,
        chainId,
        loading,
        error,
        contractAddresses,
    };
};