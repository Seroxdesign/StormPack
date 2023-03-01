import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import StormPack from 0x09fb63ef7226019e


transaction(packID: UInt64) {
    let stormPackCollection: &StormPack.Collection
    prepare(account: AuthAccount){
        self.stormPackCollection = account.borrow<&StormPack.Collection>(from: StormPack.CollectionStoragePath)!
    }
    execute{
        self.stormPackCollection.openPack(id: packID)
    }
}
 