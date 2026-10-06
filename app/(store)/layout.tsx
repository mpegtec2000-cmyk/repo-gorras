import React from "react";
import { CartProvider } from "../components/CartContext";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 400px)" }}>{children}</main>
      <CartDrawer />
      <Footer />
    </CartProvider>
  );
}
