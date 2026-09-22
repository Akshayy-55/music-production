import { cn } from "@/lib/utils";

export function GearChassis({
  children,
  className,
  plate,
}: {
  children: React.ReactNode;
  className?: string;
  plate?: string;
}) {
  return (
    <div className={cn("gear-chassis p-4 sm:p-6", className)}>
      {plate && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="gear-nameplate">{plate}</p>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </div>
      )}
      {children}
    </div>
  );
}
