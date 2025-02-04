

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
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

          <Label>How To Play</Label>
            <Select>
              <SelectTrigger>Select An Option</SelectTrigger>
              <SelectContent>
                <SelectItem value="1">How to Play</SelectItem>
                <SelectItem value="2">Game Rules</SelectItem>
              </SelectContent>
            </Select>
        </CardContent>

        
        
        <CardFooter className="flex justify-between">
            <Button>Play As Guest</Button>
            <Button>Create Account and Play</Button>
        </CardFooter>
        </form>
        
        </Card>
    </main>
  );
}

