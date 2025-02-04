import { auth } from "@/auth";
import SignOut from "@/components/SignOut";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import Link from "next/link";


export default async function Home() {
  const session = await auth() as Session;
  return (
    <main className="flex min-h-scren flex-col items-center justify-between p-24">
      {session?.user ? (<div><SignOut/></div>): <Button><Link href="/api/auth/signin">Sign In</Link></Button>}
      <a href="/products">Go To Products</a>
    </main>
  );
}

