"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ScheduleDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDemoModal({ open, onOpenChange }: ScheduleDemoModalProps) {
  const calendlyUrl = "https://calendly.com/me-nickreffitt/trainerai";

  useEffect(() => {
    if (open) {
      // Open Calendly in a new tab
      window.open(calendlyUrl, '_blank');
      // Close the modal immediately
      onOpenChange(false);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Demo</DialogTitle>
          <DialogDescription>
            Opening Calendly in a new tab...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            If the scheduling page didn't open, click the button below:
          </p>
          <Button
            onClick={() => window.open(calendlyUrl, '_blank')}
            className="w-full"
          >
            Open Calendly
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
