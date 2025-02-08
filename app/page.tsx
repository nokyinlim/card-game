

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";


export default async function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      

      <Card className="w-[350px] h-[600px]">
        <CardHeader>
        <CardTitle>Card Game</CardTitle>
            <CardDescription>2025 Harrow Game Jam submission by Nok Yin Lim</CardDescription>
        </CardHeader>
        <form>
        <CardContent>
          You can either create an account to save your progress or play as a guest.<br/>
          <br/>
          <Label>How To Play</Label>

          <div className="flex justify-between gap-2">
            <Link href="/tutorial"><Button variant="outline">Tutorial</Button></Link>
            <Button>Create Account</Button>
          </div>
        </CardContent>

        
        
        <CardFooter className="flex justify-between gap-2">
            <Link href="join"><Button variant="outline">Play As Guest</Button></Link>
            <Button>Create Account</Button>
        </CardFooter>
        </form>
        
        </Card>
    </main>
  );
}

