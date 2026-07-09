import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brand Technology — Premium computer hardware store",
    template: "%s | Brand Technology",
  },
  description:
    "Brand Technology — SSD, RAM, GPU, CPU, monitors and gaming gear. Original components, real warranty and fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
