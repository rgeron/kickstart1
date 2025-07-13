"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function TestingPage() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Component Testing Page</h1>
        <p className="text-muted-foreground mb-6">
          Testing components on mobile device (showing drawer)
        </p>
        
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">Show Mobile Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Mobile Drawer</DrawerTitle>
              <DrawerDescription>
                This is a drawer component optimized for mobile devices.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p>This content is displayed in a drawer on mobile devices.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Component Testing Page</h1>
      <p className="text-muted-foreground mb-6">
        Testing components on desktop device (showing dialog)
      </p>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Show Desktop Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desktop Dialog</DialogTitle>
            <DialogDescription>
              This is a dialog component optimized for desktop devices.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p>This content is displayed in a dialog on desktop devices.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}