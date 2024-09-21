import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProbs {
  children: ReactNode;
}

const Layout: React.FC<LayoutProbs> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer/>
    </>
  );
};

export default Layout;
