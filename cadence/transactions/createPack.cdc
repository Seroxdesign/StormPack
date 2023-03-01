import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868
import StormPack from 0x09fb63ef7226019e
import ExampleNFT from 0x09fb63ef7226019e
import PRNG from 0x2bf5575475144be3


transaction(acc: Address, selected: [UInt64], packs: UInt64) {
    let exampleNFTCollection: &ExampleNFT.Collection
    let stormPackCollection: &StormPack.Collection
    let allNFTs: @[ExampleNFT.NFT]
    let groupsOfNFTs: @[[ExampleNFT.NFT]]
    prepare(account: AuthAccount){
        self.groupsOfNFTs <- []
        self.exampleNFTCollection = account.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)!
        
        self.stormPackCollection = account.borrow<&StormPack.Collection>(from: StormPack.CollectionStoragePath)!
        self.allNFTs <- []
        for nftID in selected {
            let temp <- self.exampleNFTCollection.withdraw(withdrawID: nftID) as! @ExampleNFT.NFT
            self.allNFTs.append(<-temp)
        }
    }

    execute{
        var len = UInt8(self.allNFTs.length)
        var packnum = UInt8(packs)

        var x: UInt64 = 0
        while(x < packs){
            let temp: @[ExampleNFT.NFT] <- []
            self.groupsOfNFTs.append(<-[])
            x = x + 1
            destroy temp
        }

        let gen <- PRNG.createFrom(blockHeight: getCurrentBlock().height, uuid: self.allNFTs[0].id)
        var packnumtemp: UInt64 = 0

        while(self.allNFTs.length > 0){
            var y = gen.range(0, UInt256(self.allNFTs.length - 1))
            var placement = packnumtemp % packs
            self.groupsOfNFTs[placement].append(<-self.allNFTs.remove(at: y))
            placement = placement + 1
        }

        destroy self.allNFTs

        while(self.groupsOfNFTs.length > 0) {
            let pack <- self.groupsOfNFTs.removeLast()
            let packsize = UInt8(pack.length)
            var size = self.groupsOfNFTs.length + 1
            let newid = UInt256(size) * gen.range(0, 1000)
            let newid64 = UInt64(newid)
            let stormPack <- StormPack.createPack(
                ownerAddress: acc,
                nfts: <- pack,
                id: newid64,
                price: UFix64(0),
                chances: {"Hello" : UInt8(8)},
                count: packsize
            )

            self.stormPackCollection.deposit(token: <- stormPack)
        }

        destroy self.groupsOfNFTs
        destroy gen
        
    }
}
 