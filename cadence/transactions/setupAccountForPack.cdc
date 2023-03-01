import StormPack from 0x09fb63ef7226019e
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868



transaction() {
    prepare(signer: AuthAccount) {
        if signer.borrow<&StormPack.Collection>(from: StormPack.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- StormPack.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: StormPack.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{StormPack.CollectionPublic}>(
            StormPack.CollectionPublicPath,
            target: StormPack.CollectionStoragePath
        )
    }

}