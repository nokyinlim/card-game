'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { use, useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"



const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function SignUpPage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [didCreateAccount, setDidCreateAccount] = useState(false);
    const [username, setUsername] = useState("");
    const crypto = require('crypto');
    const router = useRouter();

    const [source, setSource] = useState<string>("localhost:8000");

    useEffect(() => {
        setSource(localStorage.getItem("source") || "localhost:8000")
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    const showToast = () => {
        toast({
            title: "Account Already Created!",
            description: "You will be redirected shortly."
        });
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        
        if (didCreateAccount) {
            toast({
                title: "Account Already Created!",
                description: "You will be redirected shortly."
            })
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } else {
            try {
                const hashedPassword = crypto.createHash('sha256').update(values.password).digest('hex');
                
                const response = await axios.post(`http://${source}/create-account`, {
                    username: values.username,
                    hashed_password: hashedPassword
                }).then((res) => {

                    if (res.data.title == "Username Taken") {
                        console.log('Username already taken')
                        console.log(res.data)
                        toast({
                            title: "Username Taken!",
                            description: "Please try another username."
                        })
                    } else {
                        console.log('Account created successfully')
                        console.log(res.data)
                        setDidCreateAccount(true);
                        setUsername(values.username);
                        localStorage.setItem('didCreateAccount', 'true');
                        localStorage.setItem('username', values.username);
                        localStorage.setItem('password', hashedPassword);
                    }

                }).catch((err) => {
                    console.error('Error:', err)
                });
                
                console.log("Account Created?")
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }
    if (!didCreateAccount) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center">Create Account</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md space-y-4 p-8 border rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center">Welcome, {username}!</h2>
                    <p>You're one step away from playing!</p>
                    <p>Hello</p>

                    <br/><a href="/"><Button variant="outline" type="submit" className="w-full" disabled={isLoading}>
                        Take A Tutorial
                    </Button></a>
                    
                    <a href="/"><Button variant="outline" type="submit" className="w-full" disabled={isLoading}>
                        Continue and Get Started
                    </Button></a>
                </div>
            </div>
        )
    }
}