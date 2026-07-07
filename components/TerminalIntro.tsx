"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  TerminalAnimationRoot,
  TerminalAnimationContainer,
  TerminalAnimationWindow,
  TerminalAnimationContent,
  TerminalAnimationCommandBar,
  TerminalAnimationOutput,
  TerminalAnimationTabList,
  TerminalAnimationTabTrigger,
  type TabContent,
} from "@/components/ui/terminal-animation"

const tabs: TabContent[] = [
  {
    label: "install",
    command: "npm install @gabriel/dev",
    lines: [
      { text: "", delay: 25 },
      { text: "added 1 developer to your project", delay: 100 },
      { text: "", delay: 25 },
      { text: "  name       Gabriel Cavalcanti", delay: 50, color: "text-neutral-400" },
      { text: "  role       Full Stack Developer", delay: 40, color: "text-neutral-400" },
      { text: "  location   Brasil", delay: 40, color: "text-neutral-400" },
      { text: "", delay: 25 },
      { text: "  ✓ React, Next.js, TypeScript", delay: 50, color: "text-green-400" },
      { text: "  ✓ Node.js, PostgreSQL, Prisma", delay: 40, color: "text-green-400" },
      { text: "  ✓ Web3, Hive Blockchain", delay: 40, color: "text-green-400" },
      { text: "", delay: 50 },
    ],
  },
  {
    label: "build",
    command: "next build",
    lines: [
      { text: "", delay: 25 },
      { text: "  ▲ Next.js 16.2.10", delay: 75 },
      { text: "", delay: 25 },
      { text: "  Route (app)              Size", delay: 50, color: "text-neutral-400" },
      { text: "  ─────────────────────────────", delay: 25, color: "text-neutral-600" },
      { text: "  ○  /                    4.2 kB", delay: 50, color: "text-neutral-400" },
      { text: "", delay: 50 },
      { text: "  ✓ Compiled successfully", delay: 100, color: "text-green-400" },
      { text: "", delay: 50 },
    ],
  },
  {
    label: "deploy",
    command: "vercel --prod",
    lines: [
      { text: "", delay: 25 },
      { text: "  Deploying to production...", delay: 100, color: "text-neutral-400" },
      { text: "", delay: 25 },
      { text: "  ✓ Build completed", delay: 75, color: "text-green-400" },
      { text: "  ✓ Deployed to Vercel Edge Network", delay: 50, color: "text-green-400" },
      { text: "", delay: 50 },
      { text: "  → Ready.", delay: 125, color: "text-[#b497cf]" },
      { text: "", delay: 200 },
    ],
  },
]

export function TerminalIntro({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const durations = [900, 800, 900]
    const timer = setTimeout(() => {
      if (activeTab < tabs.length - 1) {
        setActiveTab((t) => t + 1)
      } else {
        setTimeout(() => {
          setVisible(false)
          setTimeout(onDone, 300)
        }, 200)
      }
    }, durations[activeTab])
    return () => clearTimeout(timer)
  }, [activeTab, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="terminal-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0a0a] px-6"
        >
          <button
            onClick={() => {
              setVisible(false)
              setTimeout(onDone, 500)
            }}
            className="absolute top-6 right-6 font-mono text-xs text-white/20 hover:text-white/60 transition-colors"
          >
            skip →
          </button>

          <div className="w-full max-w-2xl">
            <TerminalAnimationRoot
              tabs={tabs}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
              alwaysDark
            >
              <TerminalAnimationContainer className="max-w-none p-0 md:p-0">
                <TerminalAnimationWindow
                  className="rounded-none"
                  backgroundColor="#111111"
                  minHeight="20rem"
                  animateOnVisible={false}
                >
                  <TerminalAnimationContent>
                    <TerminalAnimationCommandBar className="font-mono text-sm text-white/90" />
                    <TerminalAnimationOutput
                      className="mt-3 space-y-0.5 font-mono text-sm text-white/80"
                      renderLine={(line, _index, visible) =>
                        visible ? (
                          <span className={line.color}>{line.text || " "}</span>
                        ) : null
                      }
                    />
                  </TerminalAnimationContent>

                  <TerminalAnimationTabList className="flex gap-2 border-t border-white/8 p-3">
                    {tabs.map((tab, index) => (
                      <TerminalAnimationTabTrigger key={tab.label} index={index}>
                        <span
                          className={`font-mono text-xs px-3 py-1 transition-colors ${
                            activeTab === index
                              ? "text-[#b497cf]"
                              : "text-white/25 hover:text-white/50"
                          }`}
                        >
                          {tab.label}
                        </span>
                      </TerminalAnimationTabTrigger>
                    ))}
                  </TerminalAnimationTabList>
                </TerminalAnimationWindow>
              </TerminalAnimationContainer>
            </TerminalAnimationRoot>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
