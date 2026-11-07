import type { MDXComponents } from "mdx/types";
import { MotionSpecs } from "@/components/MotionSpecs";
import { Figure, Screens, Swatches, Table, TokenFlow } from "@/components/SystemParts";

const components: MDXComponents = { Figure, MotionSpecs, Screens, Swatches, Table, TokenFlow };

export function useMDXComponents(): MDXComponents {
  return components;
}
