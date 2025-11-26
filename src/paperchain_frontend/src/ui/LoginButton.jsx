import React from 'react';
import { useInternetIdentity } from "ic-use-internet-identity";
import { canisterId as iiCanisterId } from 'declarations/internet_identity';

export function LoginButton() {
  const { login, status, error, isError, identity } = useInternetIdentity();

  const handleLogin = () => {
    // Determine the Identity Provider URL based on the network
    let identityProvider;
    
    if (process.env.DFX_NETWORK === "ic") {
      identityProvider = "https://identity.ic0.app";
    } else {
      // Local development: point to the local Internet Identity canister
      // Note: We use .localhost to ensure cookies work correctly across subdomains
      identityProvider = `http://${iiCanisterId}.localhost:4943`;
    }
    
    login({ identityProvider });
  };

  const renderButton = () => {
    switch (status) {
      case "initializing":
        return <button disabled>⏳ Initializing...</button>;
      case "logging-in":
        return <button disabled>🔄 Logging in...</button>;
      case "success":
        return (
          <button disabled>
            ✅ Logged in as {identity?.getPrincipal().toString().slice(0, 8)}...
          </button>
        );
      case "error":
        return <button onClick={handleLogin}>🔄 Retry Login</button>;
      case "idle":
      default:
        return <button onClick={handleLogin}>Login with Internet Identity</button>;
    }
  };

  return (
    <div>
      {renderButton()}
      {isError && (
        <div style={{ color: "red", marginTop: "8px", fontSize: "0.8em" }}>
          ❌ {error?.message}
        </div>
      )}
    </div>
  );
}
