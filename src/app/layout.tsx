import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moldulus — AI that knows the work.",
  description:
    "General AI is trained on everything. Moldulus is trained on your discipline. Specialized intelligence for Build, Property, Finance, Health, Fashion, Engineering, Industrial and Home.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  );
}
