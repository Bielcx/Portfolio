"use client"

import { useState } from "react"
import { TerminalIntro } from "@/components/TerminalIntro"

export function PortfolioWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  return (
    <>
      {!ready && <TerminalIntro onDone={() => setReady(true)} />}
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }}>
        {children}
      </div>
    </>
  )
}
