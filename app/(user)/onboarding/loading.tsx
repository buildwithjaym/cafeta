export default function OnboardingLoading() {
  return (
    <main className="min-h-screen bg-[#f4f7f5]">
      <div className="mx-auto flex min-h-screen w-full max-w-[760px] flex-col px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="h-9 w-28 animate-pulse rounded-full bg-black/[0.06]" />

          <div className="h-7 w-16 animate-pulse rounded-full bg-black/[0.05]" />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full rounded-[32px] border border-black/[0.05] bg-white p-6 shadow-[0_20px_70px_rgba(23,33,28,0.07)] sm:p-10">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-[22px] bg-[#e7f1ec]" />

            <div className="mx-auto mt-8 h-3 w-28 animate-pulse rounded-full bg-black/[0.06]" />

            <div className="mx-auto mt-4 h-10 w-4/5 animate-pulse rounded-xl bg-black/[0.06]" />

            <div className="mx-auto mt-3 h-5 w-3/5 animate-pulse rounded-lg bg-black/[0.04]" />

            <div className="mt-10 h-12 animate-pulse rounded-full bg-[#e7f1ec]" />
          </div>
        </div>
      </div>
    </main>
  );
}