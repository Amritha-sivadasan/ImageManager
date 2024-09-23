import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProbs {
  children: ReactNode;
}

const Layout: React.FC<LayoutProbs> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
  );
};

export default Layout;
