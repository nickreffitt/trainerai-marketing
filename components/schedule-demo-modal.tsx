"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScheduleDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDemoModal({ open, onOpenChange }: ScheduleDemoModalProps) {
  useEffect(() => {
    // Load Calendly script when modal opens
    if (open && !document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Schedule a Demo</DialogTitle>
          <DialogDescription>
            Book a time to see how TrainerAI can transform your training business.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/me-nickreffitt/trainerai"
            style={{ minWidth: '320px', height: '500px' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
