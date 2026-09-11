import { Link } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DomainBrand({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="Domain Nest home">
      <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
        <Globe2 className="size-5" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-slate-950">Domain<span className="text-indigo-600">Nest</span></span>
    </Link>
  );
}