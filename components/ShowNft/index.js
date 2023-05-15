import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

export default function ShowNfts() {
  const [nfts, setNfts] = useState([]);
  const [user, setUser] = useState({ loggedIn: false, addr: undefined });

	useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    getNFTs(user.addr)
  }, [user.addr]);

  async function getNFTs(addr) {
    try {
      const result = await fcl.query({
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
        args: (arg, t) => [arg(addr, t.Address)],
      });
      setNfts(result);
    } catch (error) {
      console.log("err", error);
    }
  }

  return (
    <div>
      <h1>My NFTs</h1>
      <main>
        <button onClick={() => getNFTs(user.addr)}>Get NFTs</button>
        <section>
          {nfts.map((nft, index) => {
            return (
              <div key={index} className="nftDiv">
                <img src={nft.url} alt="nft" style={{ height: '100px', width: '100px' }} />
                <p>Type: {nft.type}</p>
                <p>Id: {nft.id}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}