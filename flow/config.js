import { config } from "@onflow/fcl";

config({
 "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "0xProfile": "0xe9727b26ed885be8", // The account address where the Profile smart contract lives on Testnet
})

//c3ad2f70e31da9313f6345a438f38a652f803596b48b67317a0806ee3dfb9dbc