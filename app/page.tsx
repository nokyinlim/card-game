"use client"
import { useLocation } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
export default function Home() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const textValue = params.get('source') || "localhost:8000";

  const { toast } = useToast();
  const router = useRouter();

  const [source, setSource] = useState("localhost:8000");

  useEffect(() => {
    setSource(localStorage.getItem("source") || textValue);
  })

  const openLink = (url: string) => {
    toast({
      title: "Redirecting...",
      description: `You will be redirected to "${url}".`
    })

    setTimeout(() => {
      router.push(url);
    }, 1000)
    
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

              <Dialog>
                <DialogTrigger asChild>
                  <SelectItem value="/tutorial">Tutorial</SelectItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Redirecting to Tutorial...</DialogTitle>
                    <DialogDescription>
                    <div className="flex flex-col space-y-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
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

