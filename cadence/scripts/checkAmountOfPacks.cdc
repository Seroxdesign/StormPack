import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x09fb63ef7226019e
import StormPack from 0x09fb63ef7226019e



pub fun main(address:Address) : [UInt64] {
    return StormPack.getPacks(address: address)!
}