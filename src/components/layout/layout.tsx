
import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export function Layout({ children, fullWidth = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${fullWidth ? '' : 'container px-4 mx-auto'} py-6`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
