import { auth } from "@/server/auth";
import { ModeToggle } from "../theme-provider";

export default async function Nav() {
  const sess = await auth();
  console.log(sess?.user);

  return (
    <header>
      <nav>
        <ul>
          <li>Logo</li>
          <li>user logo</li>
          <li>Auth Options</li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
