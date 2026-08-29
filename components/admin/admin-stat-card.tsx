import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

export function AdminStatCard({
  label,
  value,
  description,
  icon: Icon,
}: AdminStatCardProps) {
  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-black/50">{label}</p>

          <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#111713]">
            {value.toLocaleString()}
          </p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#006241]/8 text-[#006241]">
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-black/45">{description}</p>
    </div>
  );
}