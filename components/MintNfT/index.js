import * as fcl from "@onflow/fcl";
import { useState } from "react";
import {storage} from '../../lib/firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function MintComponent() {
  const [loading, setLoading] = useState(false);
  const [imgData, setImgData] = useState();

  async function mintNFT(type, url) {
    setLoading(true)
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
        args: (arg, t) => [arg(type, t.String), arg('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fhxn7xk7oa%2Fimage%2Fupload%2Fv1663099958%2Fimage3_527c674ba6.png&f=1&nofb=1&ipt=51cb346d05b1606ca4c2aa2552a6deb9f3f9aa3c3a2cb4418c42e79a4e7fefea&ipo=images', t.String)],
        limit: 9999,
      });
      fcl.tx(res).subscribe((res) => {
        if (res.status === 4 && res.errorMessage === "") {
          window.alert("Flovatar NFT Minted!")
          setImgData('')
          setLoading(false)
        }
      });
    } catch (error) {
      console.log("err", error);
      setLoading(false)
    }
  }

  const uploadImg = (e) => {
    setLoading(true)
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
        window.alert('upload failed')
        setLoading(false)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgData(downloadURL);
          setLoading(false)
          window
        });
      })    
  }

  return (
  <div style={{ marginTop: '1em' }}>
     {
      loading ? <div style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#303030',
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: '2'
        }}>
        <h2 style={{color: 'white', marginTop: '40vh'}} > Please hold on while we prepare your NFT... </h2>
      </div> : ''
    }
    <h1>Mint your NFT!</h1>
    <main>
        <div style={{ marginTop: '1em', width: '100%' }}>
 {/*          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={e => uploadImg(e)}
            style={{ padding: '1em' }}
          /> */}
          <button
            disabled={loading && !imgData}
            onClick={() => mintNFT("French Dog", imgData)}
            style={{
              border: 'none',
              width: '100px',
              backgroundColor: loading ? "gray" : "#1B5BD3",
              color: "white",
              padding: "5px",
              textAlign: "center",
              marginRight: "10px"
          }}>
            Mint Flovatar NFT
          </button>
        </div>
    </main>
{/*     <img src={imgData} alt="NFT" style={{ marginTop: '2em' }} /> */}
  </div>
  )
}

export default MintComponent;