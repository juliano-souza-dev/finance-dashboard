import "./global.css"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#00C853" />
      <link rel="icon" href="/icons/icon-192x192.png" />
      <body>{children}</body>
    </html>
  );
}