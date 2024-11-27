import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SlippageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slippage: string;
  setSlippage: (value: string) => void;
  enableFrontRunning: boolean;
  setEnableFrontRunning: (value: boolean) => void;
  priorityFee: string;
  setPriorityFee: (value: string) => void;
  theme: string;
}

export function SlippageDialog({
  open,
  onOpenChange,
  slippage,
  setSlippage,
  enableFrontRunning,
  setEnableFrontRunning,
  priorityFee,
  setPriorityFee,
  theme
}: SlippageDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[var(--softBg)] border border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl mb-4">
            Set Max Slippage (%)
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {/* Slippage Input */}
            <div className="space-y-2">
              <Input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="text-xl h-14 bg-[var(--softBg)] border-gray-800"
              />
              <p className="text-gray-400 text-sm">
                this is the maximum amount of slippage you are willing to accept when placing trades
              </p>
            </div>

            {/* Front-running Protection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>enable front-running protection:</span>
                <Button
                  variant="outline"
                  onClick={() => setEnableFrontRunning(!enableFrontRunning)}
                  className={cn(
                    "px-3 py-1",
                    enableFrontRunning ? "bg-[#2ecc71] text-white" : "bg-transparent"
                  )}
                >
                  {enableFrontRunning ? "On" : "Off"}
                </Button>
              </div>
              <p className="text-[#2ecc71] text-sm">
                front-running protection stops bots from front-running your buys. You can use high slippage with front-running protection turned on. We recommend setting a priority fee of at least 0.01 APT with front-running protection enabled.
              </p>
            </div>

            {/* Priority Fee */}
            <div className="space-y-2">
              <span>priority fee</span>
              <div className="relative">
                <Input
                  type="number"
                  value={priorityFee}
                  onChange={(e) => setPriorityFee(e.target.value)}
                  className="text-xl h-14 bg-[var(--softBg)] border-gray-800 pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span>APT</span>
                  <img 
                    src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
                    alt="APT"
                    className="w-6 h-6"
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                a higher priority fee will make your transactions confirm faster. This is the transaction fee that you pay to the aptos network on each trade.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => onOpenChange(false)}
            className="w-full bg-[var(--softBg)] border-gray-800 hover:bg-gray-400"
          >
            Confirm and Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 