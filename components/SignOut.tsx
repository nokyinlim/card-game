import { auth, signOut } from "@/auth";
import { Button } from "./ui/button";

export default async function SignOut() {
    return (
        <form action={async () => {
            "use server"
            await signOut()
        }}>
            <Button type="submit">Sign Out</Button>
        </form>
    )
}