import StormPack from 0x09fb63ef7226019e
import StormMarketplace from 0x09fb63ef7226019e


transaction(tokenID: UInt64, recAddress: Address, amount: UFix64) {
    let vaultCap: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let collectionCap: Capability<&{StormPack.CollectionPublic}>
    let temporaryVault: @FungibleToken.Vault


    prepare(acct: AuthAccount) {
        let stormPackCap = account.getCapability<&{StormPack.CollectionPublic}>(StormPack.CollectionPublicPath)

        if(!stormPackCap.check()) {
            let wallet =  account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            account.save<@StormPack.Collection>(<- StormPack.createEmptyCollection(ownerVault: wallet), to: StormPack.CollectionStoragePath)
            account.link<&{StormPack.CollectionPublic}>(StormPack.CollectionPublicPath, target: StormPack.CollectionStoragePath)
        } 

        self.collectionCap = StormPackCap

        self.vaultCap = account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

        let vaultRef = account.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault) ?? panic("Could not borrow owner's Vault reference")

        self.temporaryVault <- vaultRef.withdraw(amount: amount)

    }

    execute {
        let seller = getAccount(saleAddress)
        let allPackscap = seller.getCapability(StormMarketplace.CollectionPublicPath).borrow<&{StormMarketplace.CollectionPublic}>() ?? panic("Could not borrow seller's sale reference")
        allPackscap.purchasePack(tokenId: tokenId, recipientCap: self.collectionCap, buyTokens: <- self.temporaryVault)
    }
}