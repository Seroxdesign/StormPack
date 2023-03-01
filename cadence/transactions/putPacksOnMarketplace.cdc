import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import StormPack from 0x09fb63ef7226019e
import ExampleNFT from 0x09fb63ef7226019e
import StormMarketplace from 0x09fb63ef7226019e


transaction(acc: Address, selected: [UInt64], price: UFix64) {
    let stormPackCollection: &StormPack.Collection
    let allPacks: @[StormPack.Pack]
    prepare(account: AuthAccount){
        self.stormPackCollection = account.borrow<&StormPack.Collection>(from: StormPack.CollectionStoragePath)!
        self.allPacks <- []
        for nftID in selected {
            let temp <- self.stormPackCollection.withdraw(withdrawID: nftID) as! @StormPack.Pack
            self.allPacks.append(<-temp)
        }
    }

    execute{
        while(allPacks.length > 0) {
            let pack <- allPacks.removeLast()
            StormMarketplace.listPackForSale(<-pack, price)
        }
    }
}
 