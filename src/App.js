import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import CustomPaginationActionsTable from "./table";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();

  const [blockData, setBlockData] = useState(null);

  const [singleHash, setSingleHash] = useState(null);

  const [singleTransData, setSingleTransData] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  const showBlockData = async () => {
    setBlockData("loading");
    let response = await alchemy.core.getBlock(blockNumber);
    setBlockData(response);
  };
  const date = blockData && new Date(blockData.timestamp * 1000);
  const formattedDate = blockData && date.toLocaleDateString();

  const singleHashData = async () => {
    setSingleTransData("load");
    let response = await await alchemy.core.getTransactionReceipt(singleHash);
    setSingleTransData(response);
  };
  useEffect(() => {
    singleHash && singleHashData();
  }, [singleHash]);
  console.log(singleTransData);
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {" "}
          <span style={{ fontWeight: "bold" }}>Block Number:</span>{" "}
          {blockNumber}{" "}
        </div>

        <span>
          <button className="blockBtn" onClick={showBlockData}>
            Show Block Data
          </button>
        </span>
      </div>
      <div style={{ marginTop: "40px" }}>
        {(blockData === "loading" || singleTransData === "load") && (
          <div>loading.....</div>
        )}
        {blockData && blockData !== "loading" && !singleHash && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                rowGap: "20px",
              }}
            >
              <div>
                {" "}
                <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                {formattedDate}{" "}
              </div>
              <div>
                {" "}
                <span style={{ fontWeight: "bold" }}>Nonce:</span>{" "}
                {parseInt(blockData.nonce, 16)}{" "}
              </div>
              <div>
                {" "}
                <span style={{ fontWeight: "bold" }}>Gas Limit:</span>
                {parseInt(blockData.gasLimit._hex, 16)}
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              {
                <CustomPaginationActionsTable
                  arr={blockData.transactions}
                  setSingleHash={setSingleHash}
                />
              }
            </div>
          </div>
        )}

        {singleTransData && singleTransData != "load" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              rowGap: "20px",
            }}
          >
            <div>
              {" "}
              <span style={{ fontWeight: "bold" }}>contractAddress:</span>{" "}
              {singleTransData.contractAddress}{" "}
            </div>
            <div>
              {" "}
              <span style={{ fontWeight: "bold" }}>transactionHash :</span>{" "}
              {singleTransData.transactionHash}{" "}
            </div>
            <div>
              {" "}
              <span style={{ fontWeight: "bold" }}>blockHash :</span>{" "}
              {singleTransData.blockHash}{" "}
            </div>
            <div>
              {" "}
              <span style={{ fontWeight: "bold" }}>to:</span>{" "}
              {singleTransData.to}{" "}
            </div>
            <div>
              {" "}
              <span style={{ fontWeight: "bold" }}>blockNumber:</span>{" "}
              {singleTransData.blockNumber}{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
