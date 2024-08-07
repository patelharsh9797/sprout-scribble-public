import { auth } from "@/server/auth";
import { ModeToggle } from "../theme-provider";
import Link from "next/link";
import UserButton from "./user-button";
import Logo from "./logo";
import CartDrawer from "../cart/cart-drawer";

export default async function Nav() {
  const sess = await auth();

  return (
    <header className="py-8">
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" aria-label="sprout and scribble logo">
          <Logo />
        </Link>
        <ul className="flex items-center gap-4">
          <li>
            <ModeToggle />
          </li>
          <li>
            <CartDrawer />
          </li>
          <UserButton session={sess} />
        </ul>
      </nav>
    </header>
  );
}
