---
name: siwe
description: Sign-In with Ethereum for Web3 authentication
when-to-use: web3, blockchain, ethereum wallets, crypto auth
keywords: SIWE, Ethereum, Web3, blockchain, wallet auth
priority: low
requires: server-config.md
related: plugins/overview.md
---

# Better Auth SIWE Plugin

## When to Use

- Web3/dApp authentication
- Crypto-native user base
- Wallet-based identity
- NFT/token-gated access

## Why SIWE

| Traditional auth | SIWE |
|------------------|------|
| Email/password | Wallet signature |
| Server stores credentials | No password storage |
| Identity provider trust | Cryptographic proof |
| Central authority | User-controlled |

## Overview
Sign-In with Ethereum - Web3 wallet authentication.

## Installation

```bash
bun add siwe ethers
```

```typescript
import { betterAuth } from "better-auth"
import { siwe } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [siwe()]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { siweClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [siweClient()]
})
```

## Sign In Flow

```typescript
import { BrowserProvider } from "ethers"

const { siwe } = authClient

// 1. Get nonce
const { nonce } = await siwe.getNonce()

// 2. Create message
const message = siwe.createMessage({
  address: walletAddress,
  chainId: 1,
  nonce,
  uri: window.location.origin,
  domain: window.location.host
})

// 3. Sign message
const provider = new BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const signature = await signer.signMessage(message)

// 4. Verify and sign in
await siwe.verify({ message, signature })
```

## React Hook Example

```typescript
function WalletLogin() {
  const { siwe } = authClient

  async function handleConnect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    })
    const { nonce } = await siwe.getNonce()
    // ... sign and verify
  }

  return <button onClick={handleConnect}>Connect Wallet</button>
}
```

## Configuration

```typescript
siwe({
  statement: "Sign in to YourApp",
  expirationTime: 60 * 60,  // 1 hour
  notBefore: 0,
  requestId: true
})
```

## Link Wallet to Existing Account

```typescript
await siwe.linkWallet({ message, signature })
```
