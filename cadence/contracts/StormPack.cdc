import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import ExampleNFT from 0x9edbe746c3cb021f

import Crypto

/*
 This contract defines the Storm Packs and a Collection to manage them.
 Each Pack will contain one item for each required NFT (body, hair, eyes, nose, mouth, clothing),
 and two other NFTs that are optional (facial hair, accessory, hat, eyeglasses, background).
 Packs will be pre-minted and can be purchased from the contract owner's account by providing a
 verified signature that is different for each Pack (more info in the purchase function).
 Once purchased, packs cannot be re-sold and users will only be able to open them to receive
 the contained NFTs into their collection.
 */

pub contract StormPack {

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    // Counter for all the Packs ever minted
    pub var totalSupply: UInt64

    // Standard events that will be emitted
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Created(id: UInt64)
    pub event Opened(id: UInt64)
    pub event Purchased(id: UInt64)

    // The public interface contains only the ID and the price of the Pack
    pub resource interface Public {
        pub let id: UInt64
        pub let price: UFix64
        pub let chances: {String: UInt8}
        // pub let collections: [String]
        pub let ownerAddress: Address
    }

    // The Pack resource that implements the Public interface and that contains
    // different NFTs in a Dictionary
    pub resource Pack: Public {
        pub let id: UInt64
        pub let price: UFix64
        pub let chances: {String: UInt8}
        // pub let collections: [String]
        pub let count: UInt8
        pub let ownerAddress: Address
        access(account) let nfts: @[ExampleNFT.NFT]



        // Initializes the Pack with all the NFTs.
        // It receives also the price and a random String that will signed by
        // the account owner to validate the purchase process.
        init(
            ownerAddress: Address,
            nfts: @[ExampleNFT.NFT],
            price: UFix64,
            count: UInt8,
            chances: {String : UInt8},
            id: UInt64
        ) {
            // Increments the total supply counter
            StormPack.totalSupply = StormPack.totalSupply + UInt64(1)
            self.id = id

            // Moves all the NFTs into the array
            self.nfts <- []
            while(nfts.length > 0){
                self.nfts.append(<- nfts.remove(at: 0))
            }

            destroy nfts

            // Sets the randomString text and the price
            self.price = price
            self.count = count
            self.chances = chances
            // self.collections = collections
            self.ownerAddress = ownerAddress
        }

        destroy() {
            destroy self.nfts
        }

        pub fun removeNFT(at: Int): @ExampleNFT.NFT {
            return <- self.nfts.remove(at: at)
        }

    }

    //Pack CollectionPublic interface that allows users to purchase a Pack
    pub resource interface CollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun deposit(token: @StormPack.Pack)
        // pub fun purchase(tokenId: UInt64, recipientCap: Capability<&{StormPack.CollectionPublic}>, buyTokens: @FungibleToken.Vault)
        // pub fun purchaseDapper(tokenId: UInt64, recipientCap: Capability<&{StormPack.CollectionPublic}>, buyTokens: @FungibleToken.Vault, expectedPrice: UFix64)
    }

    // Main Collection that implements the Public interface and that
    // will handle the purchase transactions
    pub resource Collection: CollectionPublic {
        // Dictionary of all the Packs owned
        pub let ownedPacks: @{UInt64: StormPack.Pack}
        // access(account) let authorPacks: {Address: [UInt64]}
        // Capability to send the FLOW tokens to the owner's account
        // access(account) let ownerVault: Capability<&AnyResource{FungibleToken.Receiver}>

        // Initializes the Collection with the vault receiver capability
        init () {
            self.ownedPacks <- {}
            // self.authorPacks = {}
            // self.ownerVault = ownerVault
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedPacks.keys
        }

        // pub fun getIDsByAuthor(creatorAddress: Address): [UInt64] {
        //     return self.authorPacks[creatorAddress] ?? panic("not found")
        // }

        // deposit takes a Pack and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @StormPack.Pack) {
            let id: UInt64 = token.id
            let creatorAddress: Address = token.ownerAddress

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedPacks[id] <- token
            // if(self.authorPacks.containsKey(creatorAddress)){
            //     self.authorPacks[creatorAddress]?.append(id)
            // } else {
            //     self.authorPacks.insert(key: creatorAddress, [id])
            // }

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // withdraw removes a Pack from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @StormPack.Pack {
            let token <- self.ownedPacks.remove(key: withdrawID) ?? panic("Missing Pack")
            // let auth = token.ownerAddress
            // let index = self.authorPacks[auth]?.firstIndex(of: withdrawID) ?? panic("Missing")
            // let nindex: Int = index ?? panic("Missing")
            // self.authorPacks[auth]?.remove(at: nindex) ?? panic("Missing")
//            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        // This function allows any Pack owner to open the pack and receive its content
        // into the owner's NFT Collection.
        // The pack is destroyed after the NFTs are delivered.
        pub fun openPack(id: UInt64) {

            // Gets the NFT Collection Public capability to be able to
            // send there the NFTs contained in the Pack
            let recipientCap = self.owner!.getCapability<&{ExampleNFT.ExampleNFTCollectionPublic}>(ExampleNFT.CollectionPublicPath)
            let recipient = recipientCap.borrow()!

            // Removed the pack from the collection
            let pack <- self.withdraw(withdrawID: id)

            // Removes all the NFTs from the Pack and deposits them to the
            // NFT Collection of the owner
            while(pack.nfts.length > 0){
                recipient.deposit(token: <- pack.removeNFT(at: 0))
            }

            // Emits the event to notify that the pack was opened
            emit Opened(id: pack.id)

            destroy pack
        }

        // Gets the price for a specific Pack
        access(account) fun getPrice(id: UInt64): UFix64 {
            let pack: &StormPack.Pack = (&self.ownedPacks[id] as auth &StormPack.Pack?)!
            return pack.price
        }



        // This function provides the ability for anyone to purchase a Pack
        // It receives as parameters the Pack ID, the Pack Collection Public capability to receive the pack,
        // a vault containing the necessary FLOW token, and finally a signature to validate the process.
        // The signature is generated off-chain by the smart contract's owner account using the Crypto library
        // to generate a hash from the original random String contained in each Pack.
        // This will guarantee that the contract owner will be able to decide which user can buy a pack, by
        // providing them the correct signature.
        //
        pub fun purchase(tokenId: UInt64, recipientCap: Capability<&{StormPack.CollectionPublic}>, buyTokens: @FungibleToken.Vault) {

            // Checks that the pack is still available and that the FLOW tokens are sufficient
            pre {
                self.ownedPacks.containsKey(tokenId) == true : "Pack not found!"
                self.getPrice(id: tokenId) <= buyTokens.balance : "Not enough tokens to buy the Pack!"
                buyTokens.isInstance(Type<@FlowToken.Vault>()) : "Vault not of the right Token Type"
            }

            // Gets the Crypto.KeyList and the public key of the collection's owner
            let keyList = Crypto.KeyList()
            let accountKey = self.owner!.keys.get(keyIndex: 0)!.publicKey


            // Borrows the recipient's capability and withdraws the Pack from the collection.
            // If this fails the transaction will revert but the signature will be exposed.
            // For this reason in case it happens, the randomString will be reset when the purchase
            // reservation timeout expires by the web server back-end.
            let recipient = recipientCap.borrow()!
            let pack <- self.withdraw(withdrawID: tokenId)
            let seller = pack.ownerAddress
            let recieverCap = getAccount(seller).getCapability<&{FungibleToken.Receiver}>(/public/flowUtilityTokenReceiver)

            // Borrows the owner's capability for the Vault and deposits the FLOW tokens
            let vaultRef = recieverCap.borrow() ?? panic("Could not borrow reference to owner pack vault")
            vaultRef.deposit(from: <-buyTokens)


            // Resets the randomString so that the provided signature will become useless
            let packId: UInt64 = pack.id
            // Deposits the Pack to the recipient's collection
            recipient.deposit(token: <- pack)

            // Emits an even to notify about the purchase
            emit Purchased(id: packId)

        }
        //
        pub fun purchaseDapper(tokenId: UInt64, recipientCap: Capability<&{StormPack.CollectionPublic}>, buyTokens: @FungibleToken.Vault, expectedPrice: UFix64) {

            // Checks that the pack is still available and that the FLOW tokens are sufficient
            pre {
                self.ownedPacks.containsKey(tokenId) == true : "Pack not found!"
                self.getPrice(id: tokenId) <= buyTokens.balance : "Not enough tokens to buy the Pack!"
                self.getPrice(id: tokenId) == expectedPrice : "Price not set as expected!"
                buyTokens.isInstance(Type<@FlowToken.Vault>()) : "Vault not of the right Token Type"
            }



            // Borrows the recipient's capability and withdraws the Pack from the collection.
            // If this fails the transaction will revert but the signature will be exposed.
            // For this reason in case it happens, the randomString will be reset when the purchase
            // reservation timeout expires by the web server back-end.
            let recipient = recipientCap.borrow()!
            let pack <- self.withdraw(withdrawID: tokenId)
            let seller = pack.ownerAddress

            // Borrows the owner's capability for the Vault and deposits the FLOW tokens
            let dapperMarketVault = getAccount(seller).getCapability<&{FungibleToken.Receiver}>(/public/flowUtilityTokenReceiver)
            let vaultRef = dapperMarketVault.borrow() ?? panic("Could not borrow reference to owner pack vault")
            vaultRef.deposit(from: <-buyTokens)


            // Resets the randomString so that the provided signature will become useless
            let packId: UInt64 = pack.id

            // Deposits the Pack to the recipient's collection
            recipient.deposit(token: <- pack)

            // Emits an even to notify about the purchase
            emit Purchased(id: packId)
        }

        destroy() {
            destroy self.ownedPacks
        }
    }



    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @StormPack.Collection {
        return <- create Collection()
    }

    // Get all the packs from a specific account
    pub fun getPacks(address: Address) : [UInt64]? {

        let account = getAccount(address)

        if let packCollection = account.getCapability(self.CollectionPublicPath).borrow<&{StormPack.CollectionPublic}>()  {
            return packCollection.getIDs();
        }
        return nil
    }

    // pub fun getPacksPerCreator(address: Address) : [UInt64]? {
    //     let account = getAccount(address)

    //     if let packCollection = account.getCapability(self.CollectionPublicPath).borrow<&{StormPack.CollectionPublic}>()  {
    //         return packCollection.getIDs();
    //     }
    //     return nil
    // }


    // This method can only be called from another contract in the same account (The Storm Admin resource)
    // It creates a new pack from a list of NFTs, the random String and the price.
    // Some NFTs are required and others are optional
    pub fun createPack(
            ownerAddress: Address,
            nfts: @[ExampleNFT.NFT],
            id: UInt64,
            price: UFix64,
            chances: {String: UInt8},
            count: UInt8,
        ) : @StormPack.Pack {

        var newPack <- create Pack(
            ownerAddress: ownerAddress,
            nfts: <- nfts,
            price: price,
            count: count,           
            chances: chances,
            id: id
        )

        // Emits an event to notify that a Pack was created.
        // Sends the first 4 digits of the randomString to be able to sync the ID with the off-chain DB
        // that will store also the signatures once they are generated
        emit Created(id: newPack.id)

        return <- newPack
    }

	init() {
        self.CollectionPublicPath=/public/StormPackCollection
        self.CollectionStoragePath=/storage/StormPackCollection

        // Initialize the total supply
        self.totalSupply = 0

        self.account.save<@StormPack.Collection>(<- StormPack.createEmptyCollection(), to: self.CollectionStoragePath)
        self.account.link<&{StormPack.CollectionPublic}>(StormPack.CollectionPublicPath, target: self.CollectionStoragePath)

        emit ContractInitialized()
	}
}
 