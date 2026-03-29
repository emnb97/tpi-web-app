"use client";

import { ReactNode } from "react";
import { CartProvider } from "../context/CartContext";
import { FontProvider, FontStyleInjector } from "./FontProvider";

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <FontProvider>
      <FontStyleInjector />
      <CartProvider>{children}</CartProvider>
    </FontProvider>
  );
}