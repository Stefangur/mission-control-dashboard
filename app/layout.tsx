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
  const bodyStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    backgroundColor: '#f5f5f5',
    color: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }

  return (
    <html lang="de">
      <body style={bodyStyle}>{children}</body>
    </html>
  )
}
