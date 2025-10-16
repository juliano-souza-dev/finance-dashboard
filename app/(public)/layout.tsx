'use client'

import NextAuthSessionProvider from "@/providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}