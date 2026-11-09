import { ChainTelemetry } from "@/components/ChainTelemetry";
import { Noggles } from "@/components/Noggles";
import { FarcasterLogo, HiveLogo } from "@/components/ui/brand-icons";
import { collection, identity, nft, short, signed } from "@/lib/site";

/**
 * O site inteiro, numa página: redesign "nounish cypherpunk" (09/11/2026).
 * Saiu o "portfólio de dev backend" (terminal, `$ whoami`, Agent Pack, lista de
 * linhas e o painel com Galaxy); entrou a identidade on-chain, o NFT da carteira,
 * uma mensagem assinada e os trabalhos como uma coleção de tokens. Só tema escuro.
 * Todo dado vem de `lib/site.ts`; o estilo mora em `.nx` no `globals.css`.
 */

/** O commit que está no ar. A Vercel injeta no build; fora dela, some. */
const BUILD = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
const REPO = "https://github.com/Bielcx/Portfolio";

export default function Home() {
  return (
    <main className="nx">
      <div className="nx-wrap">
        <div className="nx-bar">
          <span className="flex items-center gap-3">
            <Noggles px={2} /> {identity.ens}
          </span>
          <span>
            gm · <span className="nx-ok">● onchain</span>
          </span>
        </div>

        <section className="nx-hero" aria-label={identity.ens}>
          <div>
            <h1>
              bielcx<span className="nx-red">.eth</span>
            </h1>
            <p className="nx-tagline">
              <b>onchain builder.</b> front to contract, web2 + web3. shipping on Ethereum, Base, Solana &amp; Hive.
              nounish by heart, cypherpunk by habit: <b>don&apos;t trust, verify.</b>
            </p>
            <dl className="nx-id">
              <dt>ens</dt>
              <dd>
                <a href={`https://etherscan.io/address/${identity.wallet}`} target="_blank" rel="noreferrer" title={identity.wallet}>
                  {identity.ens}
                </a>{" "}
                <span className="nx-dim">→ {short(identity.wallet)}</span>
              </dd>
              <dt>holds</dt>
              <dd>
                {nft.name} <span className="nx-dim">· rarity nogglesboard, base</span>
              </dd>
              <dt>dao</dt>
              <dd>gnars · nounish action sports</dd>
            </dl>
            <div className="nx-socials">
              <a href={identity.farcaster} target="_blank" rel="noreferrer" aria-label="Farcaster" title="farcaster"><FarcasterLogo /></a>
              <a href={identity.hive} target="_blank" rel="noreferrer" aria-label="Hive" title="hive"><HiveLogo /></a>
              <a href={identity.x} target="_blank" rel="noreferrer" aria-label="X" title="x">𝕏</a>
              <a href={identity.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="github">gh</a>
            </div>
          </div>

          <figure className="nx-card">
            <div className="nx-card-art">
              {/* eslint-disable-next-line @next/next/no-img-element -- pixel art de 320px: sem otimização, com image-rendering: pixelated */}
              <img
                src={nft.image}
                alt={`${nft.name}: a Noun with a keyboard head, red noggles and a mouse on its chest`}
                width={320}
                height={320}
              />
            </div>
            <figcaption>
              <div className="nx-card-meta">
                <b>{nft.name}</b>
                <span>owner: {identity.ens} ✓</span>
              </div>
              <div className="nx-card-traits">
                {nft.traits} · <i>{nft.tagline}</i>
              </div>
              <div className="nx-card-verify">
                verify:
                <a href={`https://basescan.org/token/${nft.contract}?a=${identity.wallet}`} target="_blank" rel="noreferrer">basescan ↗</a>
                <a href={nft.metadata} target="_blank" rel="noreferrer">metadata ↗</a>
              </div>
            </figcaption>
          </figure>
        </section>

        {/* A mensagem assinada: prova de que este site é da bielcx.eth (ver `signed` em lib/site.ts). */}
        <section className="nx-sig" aria-label="signed message">
          <span className="nx-hl">-----BEGIN SIGNED MESSAGE-----</span>
          {"\n"}
          {signed.message}
          {"\n"}
          <span className="nx-hl">-----BEGIN SIGNATURE-----</span>
          {"\n"}
          {signed.signature}
          {"\n"}
          <span className="nx-hl">-----END SIGNATURE-----</span>
          {"\n"}
          <span className="nx-ok">→ signer:</span> {identity.ens} ({identity.wallet}) · EIP-191 · <span className="nx-ok">valid ✓</span>
          {"\n"}
          <span className="nx-ok">→ verify:</span>{" "}
          <a href="https://etherscan.io/verifiedSignatures" target="_blank" rel="noreferrer" className="nx-ok">
            etherscan.io/verifiedSignatures ↗
          </a>{" "}
          (address + message + signature above)
        </section>

        <section id="work" aria-labelledby="collection-title">
          <div className="nx-h2">
            <h2 id="collection-title">the collection</h2>
            <span>
              {String(collection.length).padStart(2, "0")} tokens · owner {identity.ens} · all verifiable
            </span>
          </div>
          <div className="nx-grid">
            {collection.map((w) => (
              <article className={`nx-tok ${w.bg}`} key={w.id}>
                <div className="nx-tok-head">
                  <span>#{w.id}</span>
                  <span className={`nx-tag ${w.tag}`}>{w.tag}</span>
                </div>
                <div className="nx-tok-art">
                  {/* eslint-disable-next-line @next/next/no-img-element -- print recortado por object-fit; o next/image não acrescenta nada aqui */}
                  <img src={w.img} alt={`screenshot of ${w.name}`} loading="lazy" />
                </div>
                <h3>{w.name}</h3>
                <p>{w.line}</p>
                <ul className="nx-traits">
                  {w.traits.map(([k, v]) => (
                    <li key={k}>
                      <span>{k}</span>
                      <b>{v}</b>
                    </li>
                  ))}
                </ul>
                <div className="nx-tok-foot">
                  <span>
                    owner <b>{identity.ens}</b>
                  </span>
                  <span>
                    {w.verify.map(([l, u]) => (
                      <a key={u} href={u} target="_blank" rel="noreferrer">
                        {l} ↗
                      </a>
                    ))}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="nx-contact" aria-labelledby="contact-title">
          <h2 id="contact-title">wanna build?</h2>
          <p className="nx-dim">dms open. fastest reply on whatsapp.</p>
          <ul>
            <li><span className="nx-ok">→</span> <a href={identity.whatsapp} target="_blank" rel="noreferrer">whatsapp</a></li>
            <li><span className="nx-ok">→</span> <a href={`mailto:${identity.email}`}>{identity.email}</a></li>
            <li><span className="nx-ok">→</span> <a href={identity.farcaster} target="_blank" rel="noreferrer">farcaster</a> · <a href={identity.x} target="_blank" rel="noreferrer">x</a> · <a href={identity.hive} target="_blank" rel="noreferrer">hive</a> · <a href={identity.github} target="_blank" rel="noreferrer">github</a></li>
          </ul>
        </section>

        <footer className="nx-foot">
          <ChainTelemetry />
          <span>
            {BUILD ? (
              <a href={`${REPO}/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`} target="_blank" rel="noreferrer">
                build {BUILD} ↗
              </a>
            ) : (
              "build local"
            )}
          </span>
        </footer>
      </div>
    </main>
  );
}
