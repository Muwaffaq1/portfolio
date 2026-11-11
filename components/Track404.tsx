"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Logs which addresses lead to the 404 page, so broken links can be fixed.
export function Track404() {
  useEffect(() => { track("page_not_found", { path: location.pathname, referrer: document.referrer || null }); }, []);
  return null;
}
