export const CONTRACT_ADDRESS = "0x138C119E2BC4FF9C35242B36A593875049547eF8";

export const CONTRACT_ABI = [
  // --- Constructor ---
  {
    "inputs": [
      { "internalType": "address", "name": "_feeReceiver", "type": "address" },
      { "internalType": "uint256", "name": "_mintPrice", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },

  // --- State Variables (view functions) ---
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextTokenId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeReceiver",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasMinted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },

  // --- Main mint function ---
  {
    "inputs": [
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "mintNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  // --- Admin functions ---
  {
    "inputs": [
      { "internalType": "uint256", "name": "_newPrice", "type": "uint256" }
    ],
    "name": "setMintPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_newReceiver", "type": "address" }
    ],
    "name": "setFeeReceiver",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // --- Event ---
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "NFTMinted",
    "type": "event"
  }
];
