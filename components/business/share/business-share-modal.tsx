"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  Copy,
  Download,
  LoaderCircle,
  Share2,
  X,
} from "lucide-react";

import { toast } from "sonner";
import { toPng } from "html-to-image";

import { BusinessShareCard } from "./business-share-card";

type Business = {
  name: string;
  slug: string;
  logo_url?: string | null;
  category: string;
  address: string;
  city: string;
  province: string;
};

type Props = {
  business: Business;
  onClose: () => void;
};

export function BusinessShareModal({
  business,
  onClose,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const url = `https://www.cafeta.online/business/${business.slug}`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);

      setIsCopied(true);
      toast.success("CAFÉTA link copied");

      window.setTimeout(() => {
        setIsCopied(false);
      }, 1800);
    } catch {
      toast.error("Unable to copy the link");
    }
  }

 async function downloadCard() {
  const element = cardRef.current;

  if (!element || isDownloading) {
    return;
  }

  setIsDownloading(true);

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const image = await toPng(element, {
      cacheBust: true,
      pixelRatio: 4,

      // Keep the area outside the rounded card transparent.
      backgroundColor: "white",

      style: {
        borderRadius: "32px",
        overflow: "hidden",
      },
    });

    const link = document.createElement("a");

    link.href = image;
    link.download = `${business.slug}-cafeta-share-card.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Your marketing card successfully downloaded");
  } catch (error) {
    console.error("CAFÉTA PNG ERROR", error);
    toast.error("Unable to download card");
  } finally {
    setIsDownloading(false);
  }
}
  async function shareBusiness() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: business.name,
        text: `Discover ${business.name} on CAFÉTA.`,
        url,
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      toast.error("Unable to share this business");
    }
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="
        fixed inset-0 z-50
        flex items-end justify-center
        overflow-y-auto
        bg-[#07130e]/60
        px-0 pt-6
        backdrop-blur-md
        animate-in fade-in duration-200
        sm:items-center sm:p-5
      "
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-share-title"
        className="
          relative flex w-full flex-col
          overflow-hidden
          rounded-t-[30px]
          border border-white/60
          bg-[#fbfcfb]
          shadow-[0_-20px_70px_rgba(0,0,0,0.2)]
          animate-in slide-in-from-bottom-8 duration-300
          sm:max-w-[500px]
          sm:rounded-[34px]
          sm:shadow-[0_30px_100px_rgba(0,0,0,0.3)]
          sm:zoom-in-95
        "
        style={{
          maxHeight: "min(94dvh, 820px)",
        }}
      >
        <div
          aria-hidden="true"
          className="
            mx-auto mt-2.5 h-1.5 w-11 rounded-full
            bg-black/10 sm:hidden
          "
        />

        <header
          className="
            flex shrink-0 items-start justify-between gap-4
            border-b border-black/[0.06]
            px-5 pb-4 pt-4
            sm:px-7 sm:pb-5 sm:pt-7
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-2 inline-flex items-center rounded-full
                bg-[#e8f3ee] px-2.5 py-1
                text-[9px] font-black uppercase
                tracking-[0.18em] text-[#006241]
              "
            >
              CAFÉTA Share
            </div>

            <h2
              id="business-share-title"
              className="
                text-[22px] font-black leading-tight
                tracking-[-0.045em] text-[#17211c]
                sm:text-2xl
              "
            >
              Share your business
            </h2>

            <p
              className="
                mt-1.5 max-w-[340px]
                text-xs leading-relaxed text-black/50
                sm:text-[13px]
              "
            >
              Help customers discover your menu, location,
              reviews, and business details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close share modal"
            className="
              flex size-10 shrink-0 items-center justify-center
              rounded-full border border-black/[0.06]
              bg-white text-black/50 shadow-sm
              transition
              hover:bg-black/[0.04] hover:text-black/80
              active:scale-90
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#006241]/30
            "
          >
            <X className="size-[18px]" />
          </button>
        </header>

        <div
          className="
            min-h-0 flex-1 overflow-y-auto
            overscroll-contain
            px-4 py-5
            sm:px-7 sm:py-6
          "
        >
          <div className="mx-auto w-full max-w-[390px]">
            <BusinessShareCard
              ref={cardRef}
              business={business}
            />
          </div>

          <p
            className="
              mx-auto mt-4 max-w-sm text-center
              text-[11px] leading-relaxed text-black/40
            "
          >
            Download the card as a high-quality PNG or share
            your CAFÉTA business link directly.
          </p>
        </div>

        <footer
          className="
            shrink-0 border-t border-black/[0.06]
            bg-white/90 px-4 pb-[max(16px,env(safe-area-inset-bottom))]
            pt-4 backdrop-blur-xl
            sm:px-7 sm:pb-7
          "
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <button
              type="button"
              onClick={copyLink}
              className="
                flex h-12 items-center justify-center gap-2
                rounded-2xl border border-[#006241]/10
                bg-[#edf5f1]
                text-xs font-extrabold text-[#006241]
                transition
                hover:bg-[#e2f0e9]
                active:scale-[0.97]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#006241]/25
              "
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}

              {isCopied ? "Copied" : "Copy link"}
            </button>

            <button
              type="button"
              onClick={shareBusiness}
              className="
                flex h-12 items-center justify-center gap-2
                rounded-2xl border border-black/[0.08]
                bg-white
                text-xs font-extrabold text-[#17211c]
                shadow-sm transition
                hover:bg-black/[0.025]
                active:scale-[0.97]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#006241]/25
                sm:order-3
              "
            >
              <Share2 className="size-4" />
              Share
            </button>

            <button
              type="button"
              onClick={downloadCard}
              disabled={isDownloading}
              className="
                col-span-2 flex h-12 items-center justify-center gap-2
                rounded-2xl
                bg-[#006241]
                text-xs font-extrabold text-white
                shadow-[0_10px_25px_rgba(0,98,65,0.22)]
                transition
                hover:bg-[#005638]
                active:scale-[0.97]
                disabled:cursor-wait disabled:opacity-65
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#006241]/30
                focus-visible:ring-offset-2
                sm:order-2 sm:col-span-1
              "
            >
              {isDownloading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}

              {isDownloading ? "Creating..." : "Download PNG"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}