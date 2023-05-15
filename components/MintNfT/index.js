import * as fcl from "@onflow/fcl";
import { useState } from "react";

function MintComponent() {
  const [nftIMG, setIMG] = useState();
  const [imgData, setImgData] = useState();
  console.log(nftIMG);
  async function mintNFT(type, url) {
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
        args: (arg, t) => [arg(type, t.String), arg(nftIMG.name, t.String)],
        limit: 9999,
      });
      fcl.tx(res).subscribe((res) => {
        if (res.status === 4 && res.errorMessage === "") {
            window.alert("NFT Minted!")
            window.location.reload(false);
        }
      });

      console.log("txid", res);
    } catch (error) {
      console.log("err", error);
    }
  }

  const uploadImg = (e) => {
    if (e.target.files[0]) {
      console.log("picture: ", e.target.files);
      setIMG(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
  <div style={{ marginTop: '1em' }}>
    <h1>Mint your NFT!</h1>
    <main>
        <div style={{ marginTop: '1em', width: '100%', padding: '1em' }}>
            <input type="file" accept="image/png, image/jpeg" onChange={e => uploadImg(e)}  style={{ padding: '1em' }}/>
            <button onClick={() => mintNFT("French Dog", imgData)} style={{ padding: '1em' }}>Mint</button>
          
        </div>
    </main>
    <img src={imgData} alt="NFT" />
  </div>
  )
}

export default MintComponent;