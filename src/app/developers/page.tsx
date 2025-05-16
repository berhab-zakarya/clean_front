"use client"

import { VSCodeExplorer } from "@/components/vscode/vscode-explorer"


export default function Home() {
  return (
    <div className="h-screen w-full">
      <VSCodeExplorer tenantName="algecomstore2" />
    </div>
  )
}
