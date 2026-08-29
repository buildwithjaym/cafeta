type Props = {
  step: number;
  total?: number;
};

export function OnboardingProgress({
  step,
  total = 4,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({
        length: total,
      }).map((_, index) => {
        const current =
          index + 1;

        const active =
          current <= step;

        return (
          <div
            key={current}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              current === step
                ? "w-8 bg-[#006241]"
                : active
                  ? "w-3 bg-[#006241]/70"
                  : "w-3 bg-black/[0.08]"
            }`}
          />
        );
      })}
    </div>
  );
}