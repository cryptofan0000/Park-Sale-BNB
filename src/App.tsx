import './App.css';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import {Moralis} from 'moralis';
import React, {useEffect, useState} from 'react'

function App() {

   
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout, chainId } = useMoralis();

  const [amount, setAmount] = useState('')
  const [isSent, setSent] = useState(false)

  const login = async () => {
    if (!isAuthenticated) {

      await authenticate({signingMessage: "Log in to the Website" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user!.get("ethAddress"));
          console.log("chain id: ", chainId);
        })
        .catch(function (error) {
          console.log(error);
        });
        var chain = await Moralis.getChainId();
        console.log(chain !== null ? parseInt(chain) : chain )
    }
  }

  const logOut = async () => {
    await logout();
    console.log("logged out");
  }

  const payBnb = async () => {
    if (!isAuthenticated) {
      login()
    }
    var chain = await Moralis.getChainId();
    var chainId;
    if ( chain!=null)
    {
      chainId = parseInt(chain)
    }
    console.log("null check done ", chainId)
    if (chainId != 97){
      console.log("chainID check done ", chainId)
      alert("Please connect to BNB testnet.")
      return;
    }
    let result = await Moralis.transfer({
      type: "native",
      amount: Moralis.Units.ETH(amount),
      receiver: "0xe93B5C2D3D6516303897cfcB533e152E232C3c26"
    });
    await console.log("executed transfer")
    await console.log(result)
    setSent(true)
  }

  return (
    <div>
      <h1>Park Sale Live!! </h1><br/>
      <label>Amount: </label>
      <button onClick={login}>Metamask Login</button>
      <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
      {/* <button onClick={payBnb}>Pay</button> */}
      {
        isAuthenticated ? 
        <section id="roadmap" className="roadmap p-5">
          <main id="main" className="main-page">
              <div className="container">
                  <div id="FormSection">
                      <div className="section-title">
                          <h2>Pre-Purchase form</h2>
                      </div>
                      <p className="text-center">Please fill out this form and you will be connected via Metamask</p>


                      <div id="prepurchaseform" className="col-lg-4 mx-auto">
                          <input className="form-control mb-2" type="text" placeholder="First Name" />
                          <input className="form-control mb-2" type="text" placeholder="Last Name" />
                          <input className="form-control mb-2" type="email" placeholder="Email" />
                          <input className="form-control mb-2" type="number" placeholder="BNB Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                          <button onClick={payBnb} className="btn-green">Send</button>
                      </div>
                  </div>
                  <div id="FormSuccess" style={!isSent ? {display:"none"} : {}}>
                      <div className="section-title">
                          <h2>Your Pre-Purchase was successful</h2>
                          <svg className="svg-inline--fa fa-check fa-6x" style={{color: "#0dd6af"}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                              <path fill="currentColor" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"></path>
                          </svg>
                          <p>You will be receiving <span id="ParkRecieving"></span> $PARK</p>
                      </div>
                  </div>
              </div>
          </main>
        </section>
        :
        <></>
      }
    </div>
  );
}

export default App;
