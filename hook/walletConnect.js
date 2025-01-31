import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { Linking, Platform } from "react-native";
import { ethers } from "ethers";

let connector;

export const connectWallet = async () => {
  if (!connector) {
    connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", 
    });
  }

  if (!connector.connected) {
    await connector.createSession();
    if (Platform.OS === "web") {
      QRCodeModal.open(connector.uri, () => {
        console.log("QR Code Modal closed");
      });
    } else {
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
        resolve(accounts[0]);
      }
    });
  });
};

export const disconnectWallet = async () => {
  if (connector) {
    await connector.killSession();
    connector = null;
  }
};

export { connector };
