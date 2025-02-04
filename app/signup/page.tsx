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
import { use, useState } from "react"
import axios from "axios"

import { useToast } from "@/hooks/use-toast"


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
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const [didCreateAccount, setDidCreateAccount] = useState(false);
    const crypto = require('crypto');

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
            
        } else {
            try {
                const hashedPassword = crypto.createHash('sha256').update(values.password).digest('hex');
                
                const response = await axios.post('http://localhost:8000/create-account', {
                    username: values.username,
                    hashed_password: hashedPassword
                }).then((res) => {
                    console.log('Account created successfully')
                    console.log(res.data)
                    setDidCreateAccount(true);
                    
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

                    <Button onClick={showToast} className="w-full">
                </Form>
            </div>
        </div>
    )
}