import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const AlertDialog = Dialog
const AlertDialogTrigger = DialogTrigger

function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof DialogContent>) {
    return <DialogContent className={cn("sm:max-w-[425px]", className)} {...props} />
}

const AlertDialogHeader = DialogHeader
const AlertDialogTitle = DialogTitle
const AlertDialogDescription = DialogDescription
const AlertDialogFooter = DialogFooter
const AlertDialogCancel = DialogClose

function AlertDialogAction({
    className,
    onClick,
    children,
    ...props
}: React.ComponentProps<typeof Button> & { onClick?: () => void }) {
    return (
        <DialogClose asChild>
            <Button
                className={cn(className)}
                onClick={onClick}
                {...props}
            >
                {children}
            </Button>
        </DialogClose>
    )
}

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
}
