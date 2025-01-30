import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { Linking, Platform } from "react-native";
import { ethers } from "ethers";

let connector;

export const connectWallet = async () => {
    if (!connector) {
        connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org" // Corrected the bridge URL
        });
    }

    if (!connector.connected) {
        // Corrected the typo: 'creatSession' should be 'createSession'
        await connector.createSession();

        // Display QR code for wallet connection on web
        if (Platform.OS === "web") {
            QRCodeModal.open(connector.uri, () => {
                console.log("QR Code Modal closed");
            });
        } else {
            // For mobile, use deep linking to open MetaMask
            const metamaskUrl = `https://metamask.app.link/wc?uri=${encodeURIComponent(connector.uri)}`;
            Linking.openURL(metamaskUrl);
        }
    }

    return new Promise((resolve, reject) => {
        connector.on("connect", (error, payload) => {
            if (error) {
                reject(error);
            } else {
                QRCodeModal.close();
                const { accounts } = payload.params[0];
                resolve(accounts[0]);  // Return the connected wallet address
            }
        });
    });
};

// This function gets the signer (wallet instance) connected to the local Hardhat network
export const getSigner = async () => {
    if (!connector || !connector.connected) {
        throw new Error("Wallet not connected");
    }

    // Connect to local Hardhat network
    const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Local Hardhat network
    const signer = new ethers.Wallet(connector.accounts[0], provider);
    return signer;
};

// This function disconnects the wallet
export const disconnectWallet = async () => {
    if (connector) {
        await connector.killSession();
        return null; // Return null to indicate that the wallet is disconnected
    }
};
