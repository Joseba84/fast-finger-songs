import type { Metadata } from "next";
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
          <h1>Fast Finger Songs</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
