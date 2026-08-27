import Link from "next/link";
import {
  ArrowLeft,
  Coffee,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="h-dvh overflow-hidden bg-white">
      <div className="grid h-full lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#006241] lg:flex lg:flex-col">
          <div className="pointer-events-none absolute -left-32 -top-32 size-[430px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -left-16 -top-16 size-[300px] rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-48 -right-24 size-[500px] rounded-full bg-[#004f35]" />
          <div className="pointer-events-none absolute bottom-[-110px] right-[-30px] size-[350px] rounded-full border border-white/[0.07]" />

          <div className="relative z-10 flex h-full flex-col px-10 py-9 xl:px-14 xl:py-11">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 text-white"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-white">
                <Coffee className="size-5 text-[#006241]" strokeWidth={2.2} />
              </div>

              <span className="text-xl font-black tracking-[-0.045em]">
                CAFÉTA
              </span>
            </Link>

            <div className="my-auto max-w-[590px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85">
                <MapPin className="size-3.5" />
                {eyebrow}
              </div>

              <h1 className="mt-7 text-[3.6rem] font-bold leading-[0.98] tracking-[-0.055em] text-white xl:text-[4.4rem]">
                {title}
              </h1>

              <p className="mt-6 max-w-[500px] text-[16px] leading-7 text-white/60 xl:text-[17px]">
                {description}
              </p>

              <div className="mt-10 grid max-w-[540px] grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
                  <div className="flex size-9 items-center justify-center rounded-full bg-white/10">
                    <Compass className="size-4 text-white" />
                  </div>

                  <p className="mt-5 text-sm font-semibold text-white">
                    Discover nearby
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-white/45">
                    Find coffee and milk-tea spots around Basilan.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
                  <div className="flex size-9 items-center justify-center rounded-full bg-white/10">
                    <Sparkles className="size-4 text-white" />
                  </div>

                  <p className="mt-5 text-sm font-semibold text-white">
                    Keep your finds
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-white/45">
                    Save places and come back when it's time for coffee.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40">
              <span>CAFÉTA · Basilan</span>
              <span>Kape tayo.</span>
            </div>
          </div>
        </section>

        <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden bg-[#fbfcfa] px-5 py-5 sm:px-8 lg:px-10">
          <div className="absolute left-5 top-5 lg:hidden">
            <Link
              href="/"
              aria-label="Back to CAFÉTA"
              className="flex size-10 items-center justify-center rounded-full border border-black/[0.07] bg-white"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          <div className="absolute right-5 top-5 lg:hidden">
            <Link
              href="/"
              className="text-lg font-black tracking-[-0.045em] text-[#006241]"
            >
              CAFÉTA
            </Link>
          </div>

          <div className="w-full max-w-[430px]">{children}</div>
        </section>
      </div>
    </main>
  );
}