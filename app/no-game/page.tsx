'use client'
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NoGamePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Whoops! Game Not Found</CardTitle>
                    <CardDescription>The game you're looking for doesn't exist.</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">We don't have any further details.</p><br/>

                <p className="text-sm text-muted-foreground">Would you like to:</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Link href="/">
                        <Button variant="outline">Return Home</Button>
                    </Link>
                    <Link href="/join">
                        <Button>Join a Game</Button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    )
}