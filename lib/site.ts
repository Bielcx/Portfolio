/**
 * Tudo o que o site afirma mora aqui, e tudo é verificável (09/11/2026).
 * Redesign "nounish cypherpunk": a regra é "don't trust, verify" — cada dado
 * aqui tem um link que prova. Não acrescente nada que não tenha prova.
 */

export const identity = {
  ens: "bielcx.eth",
  /** Conferido on-chain: bielcx.eth → este endereço, e o nome principal dele é bielcx.eth. */
  wallet: "0x419EB581BB57Cf3761F11C77EB85CB2bbc91a0b1",
  email: "biel.cavalcanti1@hotmail.com",
  whatsapp: "https://wa.me/5511960137983",
  github: "https://github.com/Bielcx",
  x: "https://x.com/bielthegoat",
  farcaster: "https://farcaster.xyz/bielcx",
  hive: "https://peakd.com/@bielcx",
};

/**
 * O NFT da hero, conferido on-chain: contrato Rarity Nogglesboard (nggsbrd, ERC-1155,
 * Base, criado pela nogglesboard.eth), token id 49 — que nos metadados se chama
 * "NGGSBRD #46" —, balanceOf(bielcx.eth, 49) = 1. A arte em `public/nft/` é cópia do
 * PNG do IPFS (gateway público é instável para carregar ao vivo); os links provam a origem.
 * Se ele vender ou transferir o token, isto aqui passa a mentir: confira antes de mexer.
 */
export const nft = {
  name: "NGGSBRD #46",
  contract: "0x9580c826076bcba116ce4729ec243290c2e3b441",
  tokenId: 49,
  image: "/nft/nggsbrd-46.png",
  traits: "keyboard head · mouse · blastron",
  tagline: "built weird. skated hard.",
  metadata: "https://gateway.pinata.cloud/ipfs/QmSznV1xgDnzdRRpSy8BPM9sQHgQS5ZJe5hJY6tCkYrokd/49",
};

/**
 * "in the wallet": a galeria dos NFTs nounish da bielcx.eth, curada pelo dono (09/11/2026).
 * Cada um conferido on-chain com ownerOf(id) == identity.wallet, na Base. As artes em
 * `public/nft/` são cópias do renderer do nouns.build (o tokenURI on-chain aponta para ele).
 * Curada de propósito, e não lida ao vivo: carteira recebe NFT de spam, e uma galeria
 * automática exporia golpe no portfólio. Vendeu ou transferiu? Tire daqui.
 */
export const wallet = [
  { name: "Gnars #3072", traits: "baseball head · dilated guava", img: "/nft/gnars-3072.webp", contract: "0x880fb3cf5c6cc2d7dfc13a993e839a9411200c17", id: 3072 },
  { name: "Gnars #3383", traits: "paintbrush head · gold · bling anchor", img: "/nft/gnars-3383.webp", contract: "0x880fb3cf5c6cc2d7dfc13a993e839a9411200c17", id: 3383 },
  { name: "Gnars #5072", traits: "igloo head · orange · moon block", img: "/nft/gnars-5072.webp", contract: "0x880fb3cf5c6cc2d7dfc13a993e839a9411200c17", id: 5072 },
  { name: "SkateHive #269", traits: "the people's thrasher ⌐◨-◨", img: "/nft/skatehive-269.webp", contract: "0xfe10d3ce1b0f090935670368ec6de00d8d965523", id: 269 },
] as const;

/**
 * A mensagem assinada pelo dono com a MetaMask (personal_sign, EIP-191) em 09/11/2026,
 * conferida com viem.verifyMessage: recupera o `identity.wallet`.
 * O TEXTO TEM DE SER EXATAMENTE O ASSINADO — mudar uma vírgula invalida a assinatura.
 */
export const signed = {
  message:
    "gm. this is the portfolio of bielcx.eth at web3.gabriel.doabridge.com. every claim on it links to something you can check. 2026-11-09",
  signature:
    "0x8ee2ac22c8a6594c849cd4d744f37f5ae9ae78c3175f670c8e2aa679ec8faf1f7d84f5429cec23406d7a561a33f8b25f412b5b98c9dc5bb5f483fc621fcacc6a1c",
};

/**
 * "the collection": cada projeto é um token. O print é a arte, a stack vira traits, e
 * `verify` são os links que provam. Crédito importa:
 * - Boar: ele FEZ o app de iOS/Mac, a versão Windows/Linux e a página /desktop; AJUDOU no
 *   benchmark do Android e nas campanhas do X. Vitalik: só o teste público, nunca "endossado".
 * - SwapsPro: o motor de launch na Solana é dele (commit 0fd1e9e no master, repo privado).
 * - Gnars: comunidade e governança, não obra dele.
 * `bg` alterna os dois fundos oficiais dos Nouns.
 */
export const collection = [
  {
    id: "001", name: "SkateHive", tag: "oss", img: "/screenshots/skatehive.png", bg: "cool",
    line: "decentralized skate social on Hive.",
    traits: [["chain", "hive"], ["role", "contributor"], ["proof", "27 PRs merged"]],
    verify: [["prs", "https://github.com/SkateHive/skatehive3.0/pulls?q=is%3Apr+author%3ABielcx+is%3Amerged"], ["app", "https://skatehive.app"]],
  },
  {
    id: "002", name: "SwapsPro /launch", tag: "shipped", img: "/screenshots/swapspro.png", bg: "warm",
    line: "token launch on Solana via Meteora's bonding curve. the wallet approves, it doesn't mint.",
    traits: [["chain", "solana"], ["role", "built it"], ["proof", "live in prod"]],
    verify: [["live", "https://www.swaps.pro/launch"]],
  },
  {
    id: "003", name: "Do A Bridge", tag: "devnet", img: "/screenshots/doabridge.png", bg: "cool",
    line: "Ethereum ↔ Base ↔ Solana. the SOL pair crosses the canonical Base bridge.",
    traits: [["chain", "eth · base · sol"], ["role", "own product"], ["proof", "open repo"]],
    verify: [["repo", "https://github.com/Bielcx/doabridge"], ["app", "https://doabridge.com"]],
  },
  {
    id: "004", name: "Boar", tag: "oss", img: "/screenshots/boar.png", bg: "warm",
    line: "offline AI, no server. built the iOS/Mac app and the Windows/Linux build. tested in public by Vitalik.",
    traits: [["runs on", "ios · mac · win · linux"], ["role", "built the apps"], ["proof", "open repo"]],
    verify: [["repo", "https://github.com/Bielcx/boar-desktop"], ["test", "https://x.com/VitalikButerin/status/2103762130554204651"]],
  },
  {
    id: "005", name: "Gnars DAO", tag: "dao", img: "/screenshots/gnars.png", bg: "cool",
    line: "action sports DAO on Base, nounish to the bone.",
    traits: [["chain", "base"], ["role", "community"], ["proof", "governance"]],
    verify: [["dao", "https://gnars.com"]],
  },
] as const;

export const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
