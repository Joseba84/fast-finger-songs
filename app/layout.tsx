import type { Metadata } from "next";
import Link from "next/link";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Fast Finger Songs",
  description: "Para aquellos que padecen el sindrome del 'Fast Finger'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Titillium+Web:300,400,600,700" rel="stylesheet" />
      </head>
      <body>
        <div id="app" className="container">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1>Fast Finger Songs</h1>
          </Link>
          <nav style={{ marginBottom: '40px', display: 'flex', gap: '25px', justifyContent: 'center' }}>
            <Link href="/" style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
            <Link href="/playlist" style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>Playlist</Link>
            <Link href="/guess" style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>Guess Game</Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
