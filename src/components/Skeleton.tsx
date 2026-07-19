import React from 'react';
import { cn } from "../utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse bg-slate-200 rounded-md", className)} {...props} />
  );
}
