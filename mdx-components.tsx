import type { MDXComponents } from "mdx/types";
import { MotionSpecs } from "@/components/MotionSpecs";
import { QuickPayFlow } from "@/components/QuickPayFlow";
import { Figure, Screens, Swatches, Table, TokenFlow } from "@/components/SystemParts";

const components: MDXComponents = { Figure, MotionSpecs, QuickPayFlow, Screens, Swatches, Table, TokenFlow };

export function useMDXComponents(): MDXComponents {
  return components;
}
