"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import Payment from "./payment";
// import OrderConfirmed from "./order-confirmed"
// import CartProgress from "./cart-progress"

export default function CartDrawer() {
  const { cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } =
    useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-white dark:bg-primary"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        {/* <CartProgress /> */}
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {/* {checkoutProgress === "confirmation-page" && <OrderConfirmed />} */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
