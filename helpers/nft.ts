import * as fcl from "@onflow/fcl";

//read 

export const checkNFTPacks = async(user, setChosenNfts, setUserNfts) => {
  const transactionId = await fcl.query({
    cadence: `
    import FlowTutorialMint from 0x8e0dac5df6e8489e
    import MetadataViews from 0x631e88ae7f1d7c20
    
    pub fun main(address: Address): [FlowTutorialMint.FlowTutorialMintData] {
      let collection = getAccount(address).getCapability(FlowTutorialMint.CollectionPublicPath)
                        .borrow<&{MetadataViews.ResolverCollection}>()
                        ?? panic("Could not borrow a reference to the nft collection")
    
      let ids = collection.getIDs()
    
      let answer: [FlowTutorialMint.FlowTutorialMintData] = []
    
      for id in ids {
        
        let nft = collection.borrowViewResolver(id: id)
        let view = nft.resolveView(Type<FlowTutorialMint.FlowTutorialMintData>())!
    
        let display = view as! FlowTutorialMint.FlowTutorialMintData
        answer.append(display)
      }
        
      return answer
    }
    `,
    args: (arg, t) => [arg(user.addr, t.Address)]
  })
  setUserNfts(transactionId.filter((item) => item.type === 'pack'));
  setChosenNfts([]);
}

export async function mintNFT(type, url) {
  try {
    const res = await fcl.mutate({
      cadence: `
          import FlowTutorialMint from 0x8e0dac5df6e8489e
          import NonFungibleToken from 0x631e88ae7f1d7c20
          import MetadataViews from 0x631e88ae7f1d7c20

          transaction(type: String, url: String){
              let recipientCollection: &FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}

              prepare(signer: AuthAccount){
                  
              if signer.borrow<&FlowTutorialMint.Collection>(from: FlowTutorialMint.CollectionStoragePath) == nil {
              signer.save(<- FlowTutorialMint.createEmptyCollection(), to: FlowTutorialMint.CollectionStoragePath)
              signer.link<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(FlowTutorialMint.CollectionPublicPath, target: FlowTutorialMint.CollectionStoragePath)
              }

              self.recipientCollection = signer.getCapability(FlowTutorialMint.CollectionPublicPath)
                                          .borrow<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}>()!
              }
              execute{
                  FlowTutorialMint.mintNFT(recipient: self.recipientCollection, type: type, url: url)
              }
          }
          `,
      args: (arg, t) => [arg(type, t.String), arg(url, t.String)],
      limit: 9999,
    });
    fcl.tx(res).subscribe((res) => {
      if (res.status === 4 && res.errorMessage === "") {
          window.alert("NFT Minted!")
      }
    });

    console.log("txid", res);
  } catch (error) {
    console.log("err", error);
  }
}

export async function burnNFT(id: number) {
  try {
    const res = await fcl.mutate({
      cadence: `
      import FlowTutorialMint from 0x8e0dac5df6e8489e
      import NonFungibleToken from 0x631e88ae7f1d7c20
        
        transaction(id: UInt64) {
            prepare(signer: AuthAccount) {
                let collectionRef = signer.borrow<&FlowTutorialMint.Collection>(from: FlowTutorialMint.CollectionStoragePath)
                    ?? panic("Could not borrow a reference to the owner's collection")
        
                // withdraw the NFT from the owner's collection
                let nft <- collectionRef.withdraw(withdrawID: id)
        
                destroy nft
            }
        }
      `,
      args: (arg, t) => [arg(id, t.UInt64)],
      limit: 9999,
    });
    fcl.tx(res).subscribe((res) => {
      if (res.status === 4 && res.errorMessage === "") {
          window.alert("NFT Burned!")
      }
      return res.status
    });
  
    console.log("txid", res);
  } catch (error) {
    console.log("err", error);
  }
}

export const burnMultiple = async (arr: any[]) => {
  for (const item of arr) {
    await burnNFT(+item.id)
  }
}

export const mintMultiple = async (arr) => {
  let index = 0
  for (const item of arr) {
    if (!item) return
    index += 1
    await mintNFT(`item ${index}`, item)
  }
}