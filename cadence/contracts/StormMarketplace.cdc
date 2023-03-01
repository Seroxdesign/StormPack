import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import StormPack from 0x9edbe746c3cb021f


pub contract StormMarketplace {

    pub let CollectionPublicPath: PublicPath
    pub let CollectionStoragePath: StoragePath

    // The Vault of the Marketplace where it will receive the cuts on each sale
    pub let marketplaceWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

    // Event that is emitted when a new NFT is put up for sale
    pub event PackForSale(id: UInt64, price: UFix64)

    // Event that is emitted when the price of an NFT changes
    pub event PackPriceChanged(id: UInt64, newPrice: UFix64)

    pub event PackSaleWithdrawn(tokenId: UInt64, address: Address)

    // Event that is emitted when a token is purchased
    pub event PackPurchased(id: UInt64, price: UFix64, from: Address, to: Address)

    // Event that is emitted when a royalty has been paid
    pub event RoyaltyPaid(id: UInt64, amount: UFix64, to: Address, name: String)

    // Interface that users will publish for their Sale collection
    // that only exposes the methods that are supposed to be public
    pub resource interface SalePublic {
        pub fun purchasePack(tokenId: UInt64, recipientCap: Capability<&{StormPack.CollectionPublic}>, buyTokens: @FungibleToken.Vault)
        pub fun getPackPrice(tokenId: UInt64): UFix64?
        pub fun getPackIDs(): [UInt64]
        pub fun getPack(tokenId: UInt64): &{StormPack.Public}?
    }

    // NFT Collection object that allows a user to put their NFT up for sale
    // where others can send fungible tokens to purchase it
    pub resource SaleCollection: SalePublic {

        // Dictionary of the NFTs that the user is putting up for sale
        access(contract) let packForSale: @{UInt64: StormPack.Pack}
        access(account) let authorPacks: {Address: [UInt64]}


        // Dictionary of the prices for each NFT by ID
        access(contract) let packPrices: {UInt64: UFix64}

        // The fungible token vault of the owner of this sale.
        // When someone buys a token, this resource can deposit
        // tokens into their account.
        // access(account) let ownerVault: Capability<&AnyResource{FungibleToken.Receiver}>

        init (vault: Capability<&AnyResource{FungibleToken.Receiver}>) {
            self.packForSale <- {}
            self.authorPacks = {}
            // self.ownerVault = vault
            self.packPrices = {}
        }

        // Lists a Pack NFT for sale in this collection
        pub fun listPackForSale(token: @StormPack.Pack, price: UFix64) {
            let id = token.id
            let seller = token.ownerAddress
            // store the price in the price array
            self.packPrices[id] = price


            if(self.authorPacks.containsKey(seller)){
                self.authorPacks[seller]?.append(id)
            } else {
                self.authorPacks.insert(key: seller, [id])
            }

            // put the NFT into the the forSale dictionary
            let oldToken <- self.packForSale[id] <- token
            destroy oldToken

            // let vaultRef = self.ownerVault.borrow()
                // ?? panic("Could not borrow reference to owner token vault")
            emit PackForSale(id: id, price: price)
        }

        // Changes the price of a Pack that is currently for sale
        pub fun changePackPrice(tokenId: UInt64, newPrice: UFix64) {
            self.packPrices[tokenId] = newPrice

            // let vaultRef = self.ownerVault.borrow() ?? panic("Could not borrow reference to owner token vault")
            emit PackPriceChanged(id: tokenId, newPrice: newPrice)
        }

        // Lets a user send tokens to purchase a Pack that is for sale
        pub fun purchasePack(tokenId: UInt64, recipientCap: Capability<&{StormPack.CollectionPublic}>, buyTokens: @FungibleToken.Vault) {
            pre {
                self.packForSale[tokenId] != nil && self.packPrices[tokenId] != nil:
                    "No token matching this ID for sale!"
                buyTokens.balance >= (self.packPrices[tokenId] ?? 0.0):
                    "Not enough tokens to buy the NFT!"
            }

            let recipient = recipientCap.borrow()!

            let price = self.packPrices[tokenId]!

            self.packPrices[tokenId] = nil

            let token <-self.withdrawPack(tokenId: tokenId)

            let auth = token.ownerAddress
            let index = self.authorPacks[auth]?.firstIndex(of: tokenId) ?? panic("Missing")
            let nindex: Int = index ?? panic("Missing")
            self.authorPacks[auth]?.remove(at: nindex) ?? panic("Missing")

            let recieverCap = getAccount(auth).getCapability<&{FungibleToken.Receiver}>(/public/flowUtilityTokenReceiver)

            let vaultRef = recieverCap.borrow() ?? panic("Could not borrow reference to owner token vault")


            if(!token.isInstance(Type<@StormPack.Pack>())) {
                panic("The NFT is not from the correct Type")
            }

            // deposit the purchasing tokens into the owners vault
            vaultRef.deposit(from: <-buyTokens)

            // deposit the NFT into the buyers collection
            recipient.deposit(token: <- token)

            emit PackPurchased(id: tokenId, price: price, from: vaultRef.owner!.address, to: recipient.owner!.address)
        }

        // Returns the price of a specific Pack in the sale
        pub fun getPackPrice(tokenId: UInt64): UFix64? {
            return self.packPrices[tokenId]
        }

        pub fun withdrawPack(tokenId: UInt64): @StormPack.Pack {
            // remove the price
            self.packPrices.remove(key: tokenId)
            let token <- self.packForSale.remove(key: tokenId) ?? panic("missing NFT")
            let auth = token.ownerAddress
            let index = self.authorPacks[auth]?.firstIndex(of: tokenId) ?? panic("Missing")
            let nindex: Int = index ?? panic("Missing")
            self.authorPacks[auth]?.remove(at: nindex) ?? panic("Missing")
            // remove and return the token
            emit PackSaleWithdrawn(tokenId: tokenId, address: auth)
            return <-token
        }

        // Returns an array of Pack IDs that are for sale
        pub fun getPackIDs(): [UInt64] {
            return self.packForSale.keys
        }

        // Returns a borrowed reference to a Pack Sale
        // so that the caller can read data and call methods from it.
        pub fun getPack(tokenId: UInt64): &{StormPack.Public}? {
            if self.packForSale[tokenId] != nil {
                let ref = (&self.packForSale[tokenId] as auth &StormPack.Pack?)!
                return ref as! &StormPack.Pack
            } else {
                return nil
            }
        }

        // Returns a borrowed reference to a Pack Sale
        // so that the caller can read data and call methods from it.
        pub fun getPackByAuthor(author: Address): [UInt64]? {
            if self.authorPacks[author] != nil {
                return self.authorPacks[author]
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.packForSale
        }
    }


    // This struct is used to send a data representation of the Pack Sales
    // when retrieved using the contract helper methods outside the collection.
    pub struct PackSaleData {
        pub let id: UInt64
        pub let price: UFix64
        pub let chances: {String: UInt8}
        pub let ownerAddress: Address

        init(
            id: UInt64,
            price: UFix64,
            chances: {String: UInt8},
            ownerAddress: Address
        ){
            self.id = id
            self.price = price
            self.chances = chances
            self.ownerAddress = ownerAddress
        }
    }

    // Get all the Pack Sale offers for a specific account
    pub fun getPackSales(address: Address) : [PackSaleData] {
        var saleData: [PackSaleData] = []
        let account = getAccount(address)

        if let saleCollection = account.getCapability(self.CollectionPublicPath).borrow<&{StormMarketplace.SalePublic}>()  {
            if(!saleCollection.isInstance(Type<@StormMarketplace.SaleCollection>())) {
                panic("The Collection is not from the correct Type")
            }
            for id in saleCollection.getPackIDs() {
                if let pack = saleCollection.getPack(tokenId: id) {
                let price = saleCollection.getPackPrice(tokenId: id)
                saleData.append(PackSaleData(
                            id: id,
                            price: price!,
                            chances: pack.chances,
                            ownerAddress: pack.ownerAddress
                           ))
            }

                // let price = saleCollection.getPackPrice(tokenId: id)
                // let pack = saleCollection.getPack(tokenId: id) ?? ("Missing")

                // saleData.append(PackSaleData(
                //     id: id,
                //     price: price!,
                //     chances: pack.chances!,
                //     ownerAddress: pack.ownerAddress!
                // ))
            }
        }
        return saleData
    }

    
    // Get a specific Pack Sale offers for an account
    pub fun getPackSale(address: Address, id: UInt64) : PackSaleData? {
        let account = getAccount(address)

        if let saleCollection = account.getCapability(self.CollectionPublicPath).borrow<&{StormMarketplace.SalePublic}>()  {
            if(!saleCollection.isInstance(Type<@StormMarketplace.SaleCollection>())) {
                panic("The Collection is not from the correct Type")
            }
            if let pack = saleCollection.getPack(tokenId: id) {
                let price = saleCollection.getPackPrice(tokenId: id)
                return PackSaleData(
                            id: id,
                            price: price!,
                            chances: pack.chances,
                            ownerAddress: pack.ownerAddress
                           )
            }
        }
        return nil
    }

    // Returns a new collection resource to the caller
    pub fun createSaleCollection(ownerVault: Capability<&{FungibleToken.Receiver}>): @SaleCollection {
        return <- create SaleCollection(vault: ownerVault)
    }

    pub init() {
        self.CollectionPublicPath= /public/StormMarketplace
        self.CollectionStoragePath= /storage/StormMarketplace


        self.marketplaceWallet = self.account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    }
}
