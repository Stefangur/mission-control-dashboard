import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mission Control Dashboard",
  description: "System Status, Apps Health, Alerts & Controls",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  )
}
