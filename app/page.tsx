"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
export default function Home() {

  const nextRouter = useNextRouter();
  const [source, setSource] = useState("localhost:8000");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { query } = nextRouter;
      const textValue = query.source || "localhost:8000";
      setSource(localStorage.getItem("source") || textValue as string);
    }
  }, [nextRouter]);

  const { toast } = useToast();
  const router = useRouter();
  

  const openLink = (url: string) => {
    toast({
      title: "Redirecting...",
      description: `You will be redirected to "${url}".`
    })

    if (url in ["/tutorial", "/characters"]) {
      setTimeout(() => {
        router.push(url);
      }, 1000)
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Invalid Redirect URL: "${url}".`
      })
    }
    
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed bottom-8 right-8 w-[120px] h-[30px]" variant="outline" size="icon">
              Enter Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter a Source</DialogTitle>
              <DialogDescription>
                This source should be a URL to the backend server. For example, "localhost:8000" if you are running the server locally.
              <Input placeholder="localhost:8000" onChange={(e) => {setSource(e.target.value)}}></Input>
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button onClick={() => {
                localStorage.setItem("source", source);
                toast({
                  title: "Source Set",
                  description: `Source set to "${source}".`
                })
              }}>Set Source</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

      <Card className="w-[400px] h-[600px]">
        <CardHeader>
        <CardTitle>Card Game</CardTitle>
          <CardDescription>2025 Harrow Game Jam submission by Nok Yin Lim</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-2">
          You can either create an account to save your progress or play as a guest.<br/>
          <br/>

          <Label className="font-bold">Don't know how to play?</Label>
          <Select onValueChange={openLink}>
            <SelectTrigger id="framework">
              <SelectValue placeholder="How To Play" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="/tutorial">Tutorial</SelectItem>

              <SelectItem value="/characters">Explore Characters</SelectItem>
            </SelectContent>
          </Select>

          
        </CardContent>

        
        
        <CardFooter className="flex justify-between gap-2">
            <Link href="join"><Button variant="outline">Play As Guest</Button></Link>
            <Link href="/signup"><Button>Create Account</Button></Link>
        </CardFooter>
        
        
        </Card>
        
        
    </main>
  );
}

