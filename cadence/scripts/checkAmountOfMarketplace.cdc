import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x09fb63ef7226019e
import StormMarketplace from 0x09fb63ef7226019e

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef =  account.getCapability(StormMarketplace.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs()
}