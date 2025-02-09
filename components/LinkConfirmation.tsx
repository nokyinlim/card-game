import Link from "next/link"
import { AlertDialog, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { JSX } from "react"

interface LinkConfirmationProps {
  link_str: string;
  children: JSX.Element;
}

export default function LinkConfirmation({ link_str, children }: LinkConfirmationProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
              {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Credits?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to open this link? This will take you away from this site.<br/>Link: <Link href={link_str}>{link_str}</Link>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  Leave
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
}