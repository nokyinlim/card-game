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

export default function Login() {
    const router = useRouter();
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const crypto = require('crypto');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
      
    }, [])

    const showToast = () => {
        toast({
            title: "Account Already Created!",
            description: "You will be redirected shortly."
        });
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const hashedPassword = crypto.createHash('sha256').update(values.password).digest('hex');
            
            await axios.post('http://localhost:8000/get-account', {
                username: values.username,
                hashed_password: hashedPassword
            }).then((res) => {
                console.log('Logged in successfully. Detail:')
                console.log(res.data)
                setTimeout(() => {
                    router.push('/')
                }, 3000)

            }).catch((err) => {
                console.error('Error:', err)

                toast({
                  title: "Login Failed",
                  description: "Please check your account details and try again."
                })
            });
            
            console.log("Account Created?")
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
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
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>

                <Button
                    variant="outline"
                    onClick={() => {
                        toast({
                        title: "Scheduled: Catch up ",
                        description: "Friday, February 10, 2023 at 5:57 PM",
                        action: (
                            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                        ),
                        })
                    }}
                    >
                    Add to calendar
                </Button>
            </Form>
        </div>
    </div>
    )
}