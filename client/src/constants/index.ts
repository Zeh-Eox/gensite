import { CircleIcon, ScanLineIcon, SquareIcon, TriangleIcon } from "lucide-react";
import type { ScreenResolutions, Steps } from "@/types/assets";

export const screenResolutions: ScreenResolutions = {
  phone: "w-[412px]",
  tablet: "w-[768px]",
  desktop: "w-full",
};

export const steps: Steps[] = [
  {
    icon: ScanLineIcon,
    label: "Analyzing your Request..."
  },
  {
    icon: SquareIcon,
    label: "Generating layout structure..."
  },
  {
    icon: TriangleIcon,
    label: "Assembling UI components..."
  },
  {
    icon: CircleIcon,
    label: "Finalizing your website..."
  }
]

export const STEP_DURATION: number = 45000;