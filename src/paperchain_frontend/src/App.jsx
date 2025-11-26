import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from "ic-use-internet-identity";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from 'declarations/paperchain_backend';
import { canisterId } from 'declarations/paperchain_backend/index.js';
import { LoginButton } from './ui/LoginButton';

// Reusable button component
const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>;

const App = () => {
  const { identity, clear } = useInternetIdentity();
  const [actor, setActor] = useState(undefined);

  // Initialize actor when identity changes
  useEffect(() => {
    const initActor = async () => {
      if (identity) {
        if (!canisterId) {
          console.error("Canister ID for paperchain_backend is missing. Check your .env file or dfx deploy output.");
          return;
        }
        
        // Create an agent explicitly to handle root key fetching
        // Use local host for development to ensure correct signature verification behavior
        const host = process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943';
        const agent = new HttpAgent({ identity, host });

        // Fetch root key for certificate validation during development
        // This fixes "certificate verification failed" on local networks
        if (process.env.DFX_NETWORK !== "ic") {
          try {
            await agent.fetchRootKey();
          } catch (err) {
            console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
          }
        }

        const newActor = createActor(canisterId, {
          agent
        });
        setActor(newActor);
      }
    };

    initActor();
  }, [identity]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <img src="/logo2.svg" alt="PaperChain Logo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
      <h1>PaperChain</h1>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        <LoginButton />
        {identity && <Button onClick={clear}>Logout</Button>}
      </div>
    </div>
  );
};

export default App;