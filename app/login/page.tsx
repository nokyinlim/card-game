"use client";

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


export default function Login() {
    const router = useRouter();
    
    return (
        <div>

      Logged In!
        </div>
    )
}