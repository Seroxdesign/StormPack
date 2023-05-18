import * as fcl from "@onflow/fcl";
import { useState } from "react";
import {storage} from '../../lib/firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
        args: (arg, t) => [arg(type, t.String), arg(imgData, t.String)],
        limit: 9999,
      });
      fcl.tx(res).subscribe((res) => {
        if (res.status === 4 && res.errorMessage === "") {
          window.alert("NFT Minted!")
          setImgData('')
        }
      });
      
      console.log("txid", res);
    } catch (error) {
      console.log("err", error);
    }
  }

  const uploadImg = (e) => {
    console.log(e.target.files[0])
    const storage = getStorage();
    const storageRef = ref(storage, `images/${e.target.files[0].name}`);

    const uploadTask = uploadBytesResumable(storageRef, Array.from(e.target.files)[0]);
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgData(downloadURL);
        });
      })    
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