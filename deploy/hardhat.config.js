require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

// Replace this with your actual Holesky RPC URL (from a provider like Infura or Alchemy)
const HOLESKY_RPC_URL = "https://eth-holesky.g.alchemy.com/v2/j8pR71uR77igUWtSTwIBPBe2WBaQRxuV";
// Replace this with your actual private key (DO NOT commit private keys in production!)
const PRIVATE_KEY = "dddeed1457e26ce3a04a0e863edb459e635a8deb706a56033bf92b77f444aae6";

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "holesky",
  networks: {
    hardhat: {},
    holesky: {
      url: HOLESKY_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 17000, // Holesky's chain ID
    },
  },
};
