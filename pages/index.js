import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import styles from "../styles/Home.module.css";
import MintComponent from '@/components/MintNfT';
import { mintNFT, burnNFT, mintMultiple, burnMultiple } from '@/helpers/nft';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({loggedIn: null});
  const [currentPage, setCurrentPage] = useState(0);
  const [nftsPerPack, setNftsPerPack] = useState(0);
  const [userNfts, setUserNfts] = useState([]); 
  const [chosenNfts, setChosenNfts] = useState();
  const [createdPacks, setCreatedPacks] = useState([]);
  const [createdMarket, setCreatedMarket] = useState([]);
  const [priceToSell, setPriceToSell] = useState(0);
  const [selectedPack, setSelectedPack] = useState();

  useEffect(() => {
    if (currentPage === 0) {
      checkNFTs()
    }
    if (currentPage === 1) {
      const getNFTs = async() => {
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
        setCreatedPacks(transactionId.filter((item) => item.type === 'pack'));
        setChosenNfts([]);
      }
      getNFTs()
    }
  }, [currentPage])

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const deselectAllPacks = () => {
    setSelectedPack(null);
  }
  const updateClickList = (id) => {
    const userNftsNew = [...chosenNfts];
    console.log(userNftsNew, 'test 2')
    if (userNftsNew.includes(id)) {
      userNftsNew.splice(chosenNfts.indexOf(id), 1);
    } else {
      userNftsNew.push(id);
    }
    setChosenNfts(userNftsNew);
    console.log(id);
  }

  const selectAllClickList = () => {
    const userNftsNew = [];
    userNfts.forEach(element => {
      userNftsNew.push(element);
    });
    setChosenNfts(userNftsNew);
  }

  const deselectAllClickList = () => {
    setChosenNfts([]);
  }

  //read from blockchain
  const checkNFTs = async () => {
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
    console.log(transactionId, 'test tx 1');
    setUserNfts(transactionId.filter((item) => item.type !== 'pack'));
    setChosenNfts([]);
  }

  const createPack = async () => {
    setLoading(true)
    let url = ''
    await chosenNfts?.forEach(nft => url = url + nft.url + '~');
    const nfts = chosenNfts
    await mintNFT('pack', url)
    await burnMultiple(nfts).then(setLoading(false))
  }

  const putOnMarket = async () => {

    const accSetTransId = await fcl.mutate({
      cadence: `

      import NonFungibleToken from 0x631e88ae7f1d7c20
      import ExampleNFT from 0x9edbe746c3cb021f
      import MetadataViews from 0x631e88ae7f1d7c20

      transaction {

          prepare(signer: AuthAccount) {
              // Return early if the account already has a collection
              if signer.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath) != nil {
                  return
              }
      
              // Create a new empty collection
              let collection <- ExampleNFT.createEmptyCollection()
      
              // save it to the account
              signer.save(<-collection, to: ExampleNFT.CollectionStoragePath)
            
          }
      }`,
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 50,

    })

    const accTrans = await fcl.tx(accSetTransId).onceSealed();
    console.log(accTrans);

    setCreatedMarket([{
      id: selectedPack,
      nftsIn: createdPacks[selectedPack],
      price: priceToSell
    }])

    setSelectedPack(null);
    setPriceToSell(0);
    let netarr = [...createdPacks];
    netarr.splice(selectedPack, 1);
    setCreatedPacks(netarr);
  }

  const openPack = async () => {
    setLoading(true)
    let nftArr = selectedPack.url.split('~')
    nftArr = nftArr.filter((item, i) => item)
    
    const mint = async () => {
      mintMultiple(nftArr)
    }
    await burnNFT(+selectedPack.id).then(() => {
      mint().then(setLoading(false))
    })
  }

  const AuthedState = () => {
    return (
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
        <div onClick={checkNFTs} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Load NFTs</div> {/* NEW */}
        <div onClick={fcl.unauthenticate} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Log Out</div>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
        <div onClick={fcl.logIn} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Connect Wallet</div>
        <div onClick={fcl.signUp} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Sign Up</div>
      </div>
    )
  }

  const FlovatarList = () => {
    return (
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", paddingTop: "10px", flexDirection: "column"}}>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "30px"}}>
          <div style={{display: "flex", justifyContent: "left", alignItems: "center"}}>
            <p style={{fontSize: 30, fontFamily: "InterBold", paddingRight: "10px", margin: "0px"}}>My NFTs</p>
            {chosenNfts?.length == 0 ? <p style={{margin: "0px", padding: "0px"}}>(Select NFTs to Create Packs)</p>
             : <button onClick={() => createPack()} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} disabled={loading} className={styles.hoverCss}>
                 Create Packs {chosenNfts?.length} Selected
              </button>}
            
              <input style={{width: "50px", marginLeft: '10px'}} type="number" name="someid" value={nftsPerPack} onChange={e => setNftsPerPack(e.target.value > chosenNfts.length ? chosenNfts.length : e.target.value)
             }/> packs
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width:"20%"}}>
            <div onClick={selectAllClickList} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Select All</div>
            <div onClick={deselectAllClickList} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Deselect All</div>
          </div>
         
        </div>
        <div style={{gap: "20px", width: "100%", placeItems: "center", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr"}}>
          {userNfts.map((el, ind) => (
            <div key={el.id} style={{backgroundColor: chosenNfts?.includes(el) ? "#90EE90" : "#ffffff", padding: "10px", width: "100%", display: "flex", borderRadius: "5%",
              justifyContent: "center", alignContent: "center", flexDirection: "column"}} className={styles.nftBlock} onClick={() => {
                updateClickList(el);
              }}>
            <img src={el.url}  style={{backgroundColor: "#f8f8f8", width: "100%", borderRadius: "5%"}} />
              <p style={{width: "100%", display: "flex", 
            justifyContent: "right", alignContent: "center", paddingTop: "10px", paddingRight: "10px", fontFamily: "InterBold"}}>
              {el.id}
            </p>
            </div>
          ))}
          {
            !userNfts.length ? 
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '500px' }}>
              No Nfts in your wallet, please mint to continue
              <button onClick={() => setCurrentPage(3)} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}}>Mint Nfts </button>
            </div>
            :
            ''
          }
          </div>
        </div>

    )
  }

  const PacksPage = () => {
    return (
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", paddingTop: "10px", flexDirection: "column"}}>

          <div style={{display: "flex", justifyContent: "left", alignItems: "center", paddingBottom: "30px"}}>
            <p style={{fontSize: 30, fontFamily: "InterBold", paddingRight: "10px", margin: "0px"}}>My Packs</p>
            {selectedPack == null ? <p style={{margin: "0px", padding: "0px"}}>(Select a Pack to Sell)</p>
             : <button disabled={loading} onClick={putOnMarket} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center", marginRight: "10px"}} className={styles.hoverCss}>
              Put on Market @ Price:
              <input style={{width: "50px"}} type="number" name="someid" value={priceToSell} onChange={e => setPriceToSell(e.target.value)
             }/></button>}
             {selectedPack != null && <button onClick={openPack}  disabled={loading} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center", marginRight: "10px"}} className={styles.hoverCss}>
              Open Pack</button>}
              {selectedPack != null && <div onClick={deselectAllPacks} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>
              Deselect All</div>}
          </div>
        <div style={{gap: "20px", width: "100%", placeItems: "center", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr"}}>
          {createdPacks.map((el, ind) => (
            <div key={ind} style={{backgroundColor: selectedPack == el ? "#90EE90" : "#ffffff", padding: "10px", width: "100%", display: "flex", borderRadius: "5%",
              justifyContent: "center", alignContent: "center", flexDirection: "column"}} className={styles.nftBlock} onClick={() => {
                setSelectedPack(el);
              }}>
              <img src={"data:image/png;base64,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"} style={{backgroundColor: "#f8f8f8", width: "100%", borderRadius: "5%"}}></img>
              <p style={{width: "100%", display: "flex", 
            justifyContent: "right", alignContent: "center", paddingTop: "10px", paddingRight: "10px", fontFamily: "InterBold"}}>
              {ind}
            </p>
            </div>
            
          ))}
          </div>
      </div>

    )
    
  }

  const MarketplacePage = () => {
    return (
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", paddingTop: "10px", flexDirection: "column"}}>

          <div style={{display: "flex", justifyContent: "left", alignItems: "center", paddingBottom: "30px"}}>
            <p style={{fontSize: 30, fontFamily: "InterBold", paddingRight: "10px", margin: "0px"}}>Marketplace</p>
          </div>
        <div style={{gap: "20px", width: "100%", placeItems: "center", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr"}}>
          {createdMarket.map((el, ind) => (
            <div key={ind} style={{backgroundColor: "#ffffff", padding: "10px", width: "100%", display: "flex", borderRadius: "5%",
              justifyContent: "center", alignContent: "center", flexDirection: "column"}} className={styles.nftBlock}>
              <img src={"data:image/png;base64,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"} style={{backgroundColor: "#f8f8f8", width: "100%", borderRadius: "5%"}}></img>
              <p style={{width: "100%", display: "flex", 
            justifyContent: "right", alignContent: "center", paddingTop: "10px", paddingRight: "10px", fontFamily: "InterBold"}}>
              ID: {el.id}, Price: {el.price}
            </p>
            </div>
            
          ))}
          </div>
      </div>

    )
    
  }

  const MintNFTPage = () => {
    return (
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", paddingTop: "10px", flexDirection: "column"}}>
        <MintComponent />
      </div>
    )
  }

  return (
    <div style={{backgroundColor: "white", color: "black", width: "100%"}} className={styles.main}>
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
        <h2 style={{color: 'white', marginTop: '40vh'}} > Processing, please hold on while we fulfill your request... </h2>
      </div> : ''
      }
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div style={{backgroundColor: "#1B5BD3", width:"100%", color: "white", display: "flex", justifyContent: "space-between",
            padding: "20px"}}>
        <div>
          <p style={{fontSize: 30, fontFamily: "InterBold", margin: "0px"}}>Storm NFT Pack Creator</p>
        </div>
        <div style={{width: "40%"}}>
          {user.loggedIn
            ? <AuthedState />
            : <UnauthenticatedState />
          }
        </div>
      </div>
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", padding: "50px", flexDirection: "column"}}>

        <div style={{display: "grid", width: "35%", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap:"10px", marginBottom: '3em'}}>
          <div style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss} onClick={() => {
            setCurrentPage(0);
          }}>My NFTs</div>
           <div style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss} onClick={() => {
            setCurrentPage(3);
          }}>
            Mint NFT
          </div>
          <div style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss} onClick={() => {
            setCurrentPage(1);
          }}>My Packs</div>
          <div style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss} onClick={() => {
            setCurrentPage(2);
          }}>Marketplace</div>
        </div>
        {(user.loggedIn && currentPage == 0) && <FlovatarList/>}
        {(user.loggedIn && currentPage == 1) && <PacksPage/>}
        {(user.loggedIn && currentPage == 2) && <MarketplacePage/>}
        {(user.loggedIn && currentPage == 3) && <MintNFTPage/>}
      </div>
    </div>
  )
}