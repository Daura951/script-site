import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

type LayoutProps = {
  children?: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen w-full">
      <header className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </header>
      <div>{children ?? <Outlet />}</div>
    </div>
  );
}
