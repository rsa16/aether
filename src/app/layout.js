import { jetbrainsMono } from './fonts'
import "./globals.css";

export const metadata = {
  title: "Aether",
  description: "A minimalist proxy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  );
}
