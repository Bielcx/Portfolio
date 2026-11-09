"use client";

import { useEffect, useState } from "react";

/**
 * A TELEMETRIA DA BARRA DE STATUS, AGORA DE VERDADE (09/11/2026).
 *
 * Era decorativa e estática ("lat 38ms · node br-01 · uptime 99.9%" — não
 * mediam nada). Hoje é o bloco atual de cada rede em que os projetos rodam,
 * lido no navegador de RPCs públicos e atualizado sozinho. Em web3 o que vale é
 * poder conferir: estes números batem com qualquer block explorer.
 *
 * - Ethereum e Base: `eth_blockNumber` (JSON-RPC EVM).
 * - Solana: `getSlot` (Solana não tem "bloco" no mesmo sentido; o slot é o
 *   número que avança).
 *
 * Sem rede, ou com o RPC fora, o campo fica em "—" — nunca um número
 * inventado. O publicnode responde com CORS aberto e sem chave.
 */
const CHAINS = [
  { id: "eth", label: "eth", url: "https://ethereum-rpc.publicnode.com", method: "eth_blockNumber", unit: "#" },
  { id: "base", label: "base", url: "https://base-rpc.publicnode.com", method: "eth_blockNumber", unit: "#" },
  { id: "sol", label: "sol", url: "https://solana-rpc.publicnode.com", method: "getSlot", unit: "slot " },
] as const;

/** A cada quanto tempo relê. A Base faz um bloco a cada 2s; 12s é o ritmo da Ethereum. */
const INTERVALO_MS = 12_000;

async function lerBloco(url: string, method: string, signal: AbortSignal): Promise<number | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: [] }),
      signal,
      cache: "no-store",
    });
    const { result } = await res.json();
    if (typeof result === "number") return result; // Solana devolve número
    if (typeof result === "string") return Number.parseInt(result, 16); // EVM devolve hex
    return null;
  } catch {
    return null;
  }
}

export function ChainTelemetry() {
  const [blocos, setBlocos] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let vivo = true;
    let ctrl = new AbortController();

    const ler = async () => {
      ctrl.abort();
      ctrl = new AbortController();
      const valores = await Promise.all(CHAINS.map((c) => lerBloco(c.url, c.method, ctrl.signal)));
      if (!vivo) return;
      setBlocos(Object.fromEntries(CHAINS.map((c, i) => [c.id, valores[i]])));
    };

    ler();
    const t = setInterval(() => {
      if (document.visibilityState === "visible") ler(); // aba escondida não gasta requisição
    }, INTERVALO_MS);
    return () => {
      vivo = false;
      clearInterval(t);
      ctrl.abort();
    };
  }, []);

  return (
    <span className="flex gap-6 min-[900px]:gap-[26px]">
      {CHAINS.map((c, i) => {
        const n = blocos[c.id];
        return (
          // o terceiro (sol) é o primeiro a sair no estreito, como o `uptime` saía antes
          <span key={c.id} className={i === 2 ? "hidden min-[900px]:inline" : undefined}>
            {c.label} <span className="tabular-nums text-ink-muted">{n == null ? "—" : `${c.unit}${n.toLocaleString("en-US")}`}</span>
          </span>
        );
      })}
    </span>
  );
}
