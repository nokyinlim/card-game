"use client";

import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react";

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function LoginForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("google", {redirect: true})}>Sign In With Google</Button>
      </CardContent>
      <CardFooter>
        <CardDescription>
            Other Sign-In Options...
        </CardDescription>
      </CardFooter>
    </Card>
  )
}


export default function Login() {
    const router = useRouter();
    const session = useSession();
    if (session.status === "authenticated") {
        useEffect(() => {
            router.push('/')
        })
    }
    
    return (
        <div>
            <LoginForm/>


        </div>
    )
}