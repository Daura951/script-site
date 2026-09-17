import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type LayoutProps = {
  children?: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </header>
      <main className="flex-1 flex flex-col">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
}
