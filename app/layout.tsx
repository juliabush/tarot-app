import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Container } from "@/components/container";
import { SessionProvider } from "@/components/session_provider";

export const metadata = {
  title: "Ask Tarot Anything",
  description: "Any question you've ever had on your mind now has an answer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white">
        <SessionProvider>
          <Navbar />
          <Container>{children}</Container>
        </SessionProvider>
      </body>
    </html>
  );
}
