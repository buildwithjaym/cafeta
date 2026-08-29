"use client";

import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coffee,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { uploadBusinessImage } from "@/lib/business/upload-business-image";

import { initialBusinessFormData } from "@/lib/business/types";

import type {
  BusinessFormData,
  BusinessWizardStep,
  MenuItemDraft,
} from "@/lib/business/types";

import { BusinessStepper } from "./business-stepper";

import { BasicsStep } from "./steps/basics-step";

import { LocationStep } from "./steps/location-step";

import { HoursStep } from "./steps/hours-step";

import { MenuStep } from "./steps/menu-step";

import { MediaStep } from "./steps/media-step";

import { ReviewStep } from "./steps/review-step";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Business basics",
  "Location",
  "Business hours",
  "Starter menu",
  "Media & contact",
  "Final review",
] as const;

type SupabaseClient = ReturnType<typeof createClient>;

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

type BusinessCreateWizardProps = {
  userId: string;
};

export function BusinessCreateWizard({ userId }: BusinessCreateWizardProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<BusinessWizardStep>(1);

  const [formData, setFormData] = useState<BusinessFormData>(() => ({
    ...initialBusinessFormData,

    hours: initialBusinessFormData.hours.map((hour) => ({
      ...hour,
    })),

    menuItems: [],
  }));

  const [submitting, setSubmitting] = useState(false);

  const [submitStage, setSubmitStage] = useState<string | null>(null);

  const updateData = useCallback((values: Partial<BusinessFormData>) => {
    setFormData((current) => ({
      ...current,
      ...values,
    }));
  }, []);

  const canContinue = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          formData.name.trim().length >= 2 &&
          normalizeSlug(formData.slug || formData.name).length >= 2 &&
          Boolean(formData.category)
        );

      case 2:
        return (
          formData.address.trim().length > 0 &&
          formData.city.trim().length > 0 &&
          formData.province.trim().length > 0 &&
          formData.latitude !== null &&
          formData.longitude !== null
        );

      case 3:
        return formData.hours.every((hour) => {
          if (hour.isClosed) {
            return true;
          }

          return Boolean(hour.opensAt && hour.closesAt);
        });

      case 4:
      case 5:
      case 6:
        return true;

      default:
        return false;
    }
  }, [currentStep, formData]);

  const completedSteps = useMemo(
    () => STEP_LABELS.map((_, index) => currentStep > index + 1),
    [currentStep],
  );

  const updateLocation = useCallback(
    (location: { latitude: number; longitude: number; accuracy?: number }) => {
      setFormData((current) => ({
        ...current,

        latitude: location.latitude,

        longitude: location.longitude,

        locationAccuracy: location.accuracy ?? null,
      }));
    },
    [],
  );

  function scrollToTop() {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function goToStep(step: BusinessWizardStep) {
    if (submitting) {
      return;
    }

    setCurrentStep(step);

    scrollToTop();
  }

  function handleBack() {
    if (submitting) {
      return;
    }

    if (currentStep === 1) {
      router.push("/profile");

      return;
    }

    goToStep((currentStep - 1) as BusinessWizardStep);
  }

  function handleContinue() {
    if (submitting) {
      return;
    }

    if (!canContinue) {
      toast.error("Complete the required fields first.");

      return;
    }

    if (currentStep < TOTAL_STEPS) {
      goToStep((currentStep + 1) as BusinessWizardStep);
    }
  }

  async function handleSubmit() {
    if (submitting) {
      return;
    }

    const validationError = validateBusiness(formData);

    if (validationError) {
      toast.error(validationError.title, {
        description: validationError.description,
      });

      return;
    }

    /*
     * userId came from the authenticated
     * Server Component.
     *
     * This is only a defensive check.
     */
    if (!userId) {
      toast.error("Your account could not be identified.");

      return;
    }

    setSubmitting(true);

    setSubmitStage("Creating your listing");

    const toastId = toast.loading("Creating your business...", {
      description: "Setting up your CAFÉTA listing and ownership.",
    });

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("CAFETA RPC SESSION", session?.user?.id);
    let businessId: string | null = null;

    try {
      /*
       * IMPORTANT:
       *
       * DO NOT use getSession() here as
       * a second authentication gate.
       *
       * The Server Component already
       * authenticated this page.
       *
       * The browser Supabase client will
       * attach its auth token to the RPC.
       *
       * create_business() itself uses
       * auth.uid(), which remains the
       * authoritative identity.
       */

      const slug = normalizeSlug(formData.slug || formData.name);

      /*
       * =================================================
       * STEP 1
       * CREATE BUSINESS + OWNER MEMBERSHIP
       * =================================================
       */

      const { data: createdBusinessId, error: createError } =
        await supabase.rpc("create_business", {
          p_name: formData.name.trim(),

          p_slug: slug,

          p_category: formData.category,

          p_description: cleanOptional(formData.description),

          p_address: formData.address.trim(),

          p_barangay: cleanOptional(formData.barangay),

          p_city: formData.city.trim(),

          p_latitude: formData.latitude,

          p_longitude: formData.longitude,
        });

      if (createError) {
  console.error(
    "[CAFÉTA] FULL RPC ERROR",
    JSON.stringify(
      createError,
      null,
      2,
    ),
  );

  console.error(
    "[CAFÉTA] RPC ERROR MESSAGE",
    createError.message,
  );

  console.error(
    "[CAFÉTA] RPC ERROR CODE",
    createError.code,
  );

  console.error(
    "[CAFÉTA] RPC ERROR DETAILS",
    createError.details,
  );

  console.error(
    "[CAFÉTA] RPC ERROR HINT",
    createError.hint,
  );

  throw createError;
}
      if (!createdBusinessId) {
        throw new Error("CAFÉTA did not receive the new business ID.");
      }

      businessId = String(createdBusinessId);
      if (
        formData.locationAccuracy !== null &&
        formData.locationAccuracy !== undefined
      ) {
        const { error: accuracyError } = await supabase
          .from("businesses")
          .update({
            location_accuracy: formData.locationAccuracy,
          })
          .eq("id", businessId);

        if (accuracyError) {
          logSupabaseError(
            "businesses.location_accuracy.update",
            accuracyError,
          );
        }
      }

      console.info("[CAFÉTA] Business created", {
        businessId,
        ownerId: userId,
      });

 
      setSubmitStage("Connecting your account");

      const { data: membership, error: membershipError } = await supabase
        .from("business_members")
        .select(
          `
              business_id,
              user_id,
              role
            `,
        )
        .eq("business_id", businessId)
        .eq("user_id", userId)
        .maybeSingle();

      if (membershipError) {
        logSupabaseError("business_members.verify", membershipError);

        throw membershipError;
      }

      if (!membership) {
        throw new Error(
          "The business was created, but CAFÉTA could not connect your account as its owner.",
        );
      }

      if (membership.role !== "owner") {
        throw new Error(
          "The business was created, but your account was not assigned as its owner.",
        );
      }

     
      let logoUrl: string | null = null;

      let coverUrl: string | null = null;

      if (formData.logoFile || formData.coverFile) {
        setSubmitStage("Uploading images");

        toast.loading("Uploading images...", {
          id: toastId,

          description: "Saving your business logo and cover.",
        });
      }

      if (formData.logoFile) {
        const uploaded = await uploadBusinessImage({
          supabase,

          businessId,

          kind: "logo",

          file: formData.logoFile,
        });

        logoUrl = uploaded.publicUrl;
      }

      if (formData.coverFile) {
        const uploaded = await uploadBusinessImage({
          supabase,

          businessId,

          kind: "cover",

          file: formData.coverFile,
        });

        coverUrl = uploaded.publicUrl;
      }

      
      setSubmitStage("Saving business details");

      toast.loading("Saving business details...", {
        id: toastId,

        description: "Adding contact information and media.",
      });

      const { data: updatedBusiness, error: businessUpdateError } =
        await supabase
          .from("businesses")
          .update({
            province: formData.province.trim(),

            phone: cleanOptional(formData.phone),

            email: cleanOptional(formData.email),

            website_url: cleanOptional(formData.websiteUrl),

            facebook_url: cleanOptional(formData.facebookUrl),

            instagram_url: cleanOptional(formData.instagramUrl),

            logo_url: logoUrl,

            cover_url: coverUrl,
          })
          .eq("id", businessId)
          .select("id")
          .maybeSingle();

      if (businessUpdateError) {
        logSupabaseError("businesses.update", businessUpdateError);

        throw businessUpdateError;
      }

      if (!updatedBusiness) {
        throw new Error(
          "The business exists, but its details could not be updated.",
        );
      }

     
      setSubmitStage("Saving business hours");

      toast.loading("Saving business hours...", {
        id: toastId,

        description: "Adding your weekly schedule.",
      });

      const hoursRows = formData.hours.map((hour) => ({
        business_id: businessId,

        day_of_week: hour.dayOfWeek,

        opens_at: hour.isClosed ? null : hour.opensAt,

        closes_at: hour.isClosed ? null : hour.closesAt,

        is_closed: hour.isClosed,
      }));

      const { error: hoursError } = await supabase
        .from("business_hours")
        .insert(hoursRows);

      if (hoursError) {
        logSupabaseError("business_hours.insert", hoursError);

        throw hoursError;
      }

     
      const validMenuItems = formData.menuItems.filter(
        (item) => item.name.trim().length > 0,
      );

      if (validMenuItems.length > 0) {
        setSubmitStage("Building starter menu");

        toast.loading("Building your menu...", {
          id: toastId,

          description: "Adding your starter menu items.",
        });

        await saveStarterMenu({
          supabase,

          businessId,

          items: validMenuItems,
        });
      }

      
      setSubmitStage("Submitting for review");

      toast.loading("Submitting for review...", {
        id: toastId,

        description: "Your listing is almost ready.",
      });

      const { error: reviewError } = await supabase.rpc(
        "submit_business_for_review",
        {
          p_business_id: businessId,
        },
      );

      if (reviewError) {
        logSupabaseError("submit_business_for_review", reviewError);

        throw reviewError;
      }

      
      setSubmitStage("Complete");

      revokePreviewUrl(formData.logoPreviewUrl);

      revokePreviewUrl(formData.coverPreviewUrl);

      toast.success("Business submitted", {
        id: toastId,

        description: `${formData.name.trim()} is now waiting for review.`,
      });

      router.replace("/profile");

      router.refresh();
    } catch (error) {
      const normalized = normalizeErrorForLog(error);

      console.error("[CAFÉTA] Business creation failed", normalized);

      toast.error(
        businessId
          ? "Business setup wasn't completed"
          : "Couldn't create your business",
        {
          id: toastId,

          description: getErrorMessage(error, Boolean(businessId)),
        },
      );
    } finally {
      setSubmitting(false);

      setSubmitStage(null);
    }
  }

  return (
    <div className="relative">
      <header className="mb-6 md:mb-8">
        <button
          type="button"
          onClick={() => router.push("/profile")}
          disabled={submitting}
          className="
            group mb-5
            flex items-center
            gap-1.5
            text-xs font-semibold
            text-black/40
            transition-colors
            duration-200
            hover:text-[#006241]
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          <ArrowLeft
            className="
              size-3.5
              transition-transform
              duration-200
              group-hover:-translate-x-0.5
            "
          />
          Back to profile
        </button>

        <div
          className="
            flex items-center
            gap-2
            text-[10px]
            font-bold uppercase
            tracking-[0.16em]
            text-[#006241]
          "
        >
          <Coffee className="size-3.5" />
          For business
        </div>

        <div
          className="
            mt-2 flex
            flex-col
            justify-between
            gap-4
            sm:flex-row
            sm:items-end
          "
        >
          <div>
            <h1
              className="
                text-[32px]
                font-black
                leading-none
                tracking-[-0.055em]
                text-[#17211c]
                sm:text-[38px]
              "
            >
              Add your place
            </h1>

            <p
              className="
                mt-3
                max-w-lg
                text-sm
                leading-6
                text-black/45
              "
            >
              Create your café, coffee shop, milk-tea shop, or bakery on CAFÉTA.
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p
              className="
                text-[10px]
                font-bold uppercase
                tracking-[0.12em]
                text-black/30
              "
            >
              Step {currentStep} of {TOTAL_STEPS}
            </p>

            <p
              className="
                mt-1
                text-xs
                font-bold
                text-[#006241]
              "
            >
              {STEP_LABELS[currentStep - 1]}
            </p>
          </div>
        </div>
      </header>

      <section
        className="
          rounded-[24px]
          border
          border-black/[0.055]
          bg-white
          px-5 py-5
          shadow-[0_10px_35px_rgba(0,0,0,0.025)]
          sm:px-7
          lg:px-9 lg:py-6
        "
      >
        <BusinessStepper currentStep={currentStep} />
      </section>

      <div
        className="
          mt-5
          grid gap-5
          lg:grid-cols-[minmax(0,1fr)_280px]
        "
      >
        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-black/[0.055]
            bg-white
            shadow-[0_14px_45px_rgba(0,0,0,0.035)]
          "
        >
          <div
            key={currentStep}
            className="
              animate-in
              fade-in
              slide-in-from-bottom-2
              p-5
              duration-300
              sm:p-7
              lg:p-8
            "
          >
            {currentStep === 1 && (
              <BasicsStep data={formData} updateData={updateData} />
            )}

            {currentStep === 2 && (
              <LocationStep data={formData} updateData={updateData} />
            )}

            {currentStep === 3 && (
              <HoursStep data={formData} updateData={updateData} />
            )}

            {currentStep === 4 && (
              <MenuStep data={formData} updateData={updateData} />
            )}

            {currentStep === 5 && (
              <MediaStep data={formData} updateData={updateData} />
            )}

            {currentStep === 6 && <ReviewStep data={formData} />}
          </div>

          <div
            className="
              sticky bottom-0
              z-20
              flex items-center
              justify-between
              gap-3
              border-t
              border-black/[0.055]
              bg-white/95
              px-5 py-4
              backdrop-blur-xl
              sm:px-7
              lg:px-8
            "
          >
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="
                flex h-11
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-black/[0.08]
                bg-white
                px-5
                text-xs
                font-bold
                text-[#36423b]
                transition-all
                duration-200
                hover:bg-[#f6f8f6]
                active:scale-[0.98]
                disabled:pointer-events-none
                disabled:opacity-40
              "
            >
              <ArrowLeft className="size-3.5" />

              {currentStep === 1 ? "Cancel" : "Back"}
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue || submitting}
                className="
                  group
                  flex h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#006241]
                  px-6
                  text-xs
                  font-bold
                  text-white
                  shadow-[0_6px_18px_rgba(0,98,65,0.16)]
                  transition-all
                  duration-200
                  hover:-translate-y-px
                  hover:bg-[#00754a]
                  active:scale-[0.98]
                  disabled:pointer-events-none
                  disabled:opacity-35
                "
              >
                Continue
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="
                  flex h-11
                  min-w-[160px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#006241]
                  px-6
                  text-xs
                  font-bold
                  text-white
                  shadow-[0_6px_18px_rgba(0,98,65,0.18)]
                  transition-all
                  duration-200
                  hover:-translate-y-px
                  hover:bg-[#00754a]
                  active:scale-[0.98]
                  disabled:pointer-events-none
                  disabled:opacity-60
                "
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="size-3.5" />
                    Create business
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-[96px] space-y-4">
            <div
              className="
                rounded-[24px]
                border
                border-black/[0.055]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(0,0,0,0.025)]
              "
            >
              <div
                className="
                  flex size-10
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#eaf3ee]
                  text-[#006241]
                "
              >
                <ShieldCheck className="size-[17px]" />
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#17211c]">
                Creating a CAFÉTA listing
              </h3>

              <p className="mt-2 text-xs leading-5 text-black/40">
                Add accurate information about the real business you manage.
              </p>

              <div className="my-5 h-px bg-black/[0.055]" />

              <div className="space-y-3.5">
                {STEP_LABELS.map((label, index) => (
                  <SidebarItem
                    key={label}
                    complete={completedSteps[index]}
                    active={currentStep === index + 1}
                    text={label}
                  />
                ))}
              </div>
            </div>

            <div
              className="
                relative
                overflow-hidden
                rounded-[20px]
                bg-[#006241]
                p-5
                text-white
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold uppercase
                  tracking-[0.13em]
                  text-white/55
                "
              >
                CAFÉTA
              </p>

              <p className="mt-2 text-sm font-bold">
                Your business.
                <br />
                Your community.
              </p>

              <p className="mt-2 text-[11px] leading-5 text-white/55">
                Help people discover more local places around Basilan.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {submitting && (
        <SubmissionOverlay stage={submitStage ?? "Creating your business"} />
      )}
    </div>
  );
}

function SubmissionOverlay({ stage }: { stage: string }) {
  return (
    <div
      className="
        fixed inset-0
        z-[120]
        flex items-center
        justify-center
        bg-[#17211c]/25
        px-5
        backdrop-blur-[4px]
      "
    >
      <div
        className="
          animate-in
          fade-in
          zoom-in-95
          w-full
          max-w-[390px]
          rounded-[28px]
          border
          border-white/70
          bg-white
          p-7
          text-center
          shadow-[0_30px_100px_rgba(0,0,0,0.2)]
          duration-200
        "
      >
        <div
          className="
            relative
            mx-auto
            flex size-14
            items-center
            justify-center
            rounded-full
            bg-[#eaf3ee]
            text-[#006241]
          "
        >
          <Coffee className="size-5" />

          <span
            className="
              absolute
              inset-[-5px]
              animate-spin
              rounded-full
              border-2
              border-transparent
              border-t-[#006241]/60
            "
          />
        </div>

        <p
          className="
            mt-5
            text-[10px]
            font-bold uppercase
            tracking-[0.15em]
            text-[#006241]
          "
        >
          CAFÉTA
        </p>

        <h3
          className="
            mt-2
            text-lg
            font-black
            tracking-[-0.035em]
            text-[#17211c]
          "
        >
          {stage}
        </h3>

        <p className="mt-2 text-xs leading-5 text-black/40">
          Please keep this page open while we prepare your listing.
        </p>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#edf2ef]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#006241]" />
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  complete,
  active,
  text,
}: {
  complete: boolean;
  active: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`
          flex size-5
          shrink-0
          items-center
          justify-center
          rounded-full
          transition-all
          duration-200
          ${
            complete
              ? "bg-[#006241] text-white"
              : active
                ? "border-2 border-[#006241] bg-[#edf5f1] text-[#006241]"
                : "border border-black/[0.08] bg-[#f7f8f7] text-transparent"
          }
        `}
      >
        {complete ? (
          <Check className="size-3" />
        ) : active ? (
          <span className="size-1.5 rounded-full bg-[#006241]" />
        ) : null}
      </div>

      <span
        className={`
          text-[11px]
          font-medium
          ${complete || active ? "text-[#17211c]" : "text-black/35"}
        `}
      >
        {text}
      </span>
    </div>
  );
}

async function saveStarterMenu({
  supabase,
  businessId,
  items,
}: {
  supabase: SupabaseClient;

  businessId: string;

  items: MenuItemDraft[];
}) {
  const categoryNames = Array.from(
    new Set(items.map((item) => item.category.trim()).filter(Boolean)),
  );

  const categoryIds = new Map<string, string>();

  for (let index = 0; index < categoryNames.length; index++) {
    const categoryName = categoryNames[index];

    const { data: createdCategory, error: categoryError } = await supabase
      .from("menu_categories")
      .insert({
        business_id: businessId,

        name: categoryName,

        sort_order: index,
      })
      .select("id")
      .single();

    if (categoryError) {
      logSupabaseError("menu_categories.insert", categoryError);

      throw categoryError;
    }

    categoryIds.set(categoryName, createdCategory.id);
  }

  const menuRows = items.map((item, index) => {
    const categoryName = item.category.trim();

    const price = parsePrice(item.price);

    if (price === null) {
      throw new Error(`Invalid price for "${item.name.trim()}".`);
    }

    return {
      business_id: businessId,

      category_id: categoryName
        ? (categoryIds.get(categoryName) ?? null)
        : null,

      name: item.name.trim(),

      description: cleanOptional(item.description),

      price,

      sort_order: index,

      is_available: true,
    };
  });

  if (!menuRows.length) {
    return;
  }

  const { error: menuError } = await supabase
    .from("menu_items")
    .insert(menuRows);

  if (menuError) {
    logSupabaseError("menu_items.insert", menuError);

    throw menuError;
  }
}

function validateBusiness(data: BusinessFormData): {
  title: string;
  description: string;
} | null {
  if (data.name.trim().length < 2) {
    return {
      title: "Add your business name",

      description: "Your business name must contain at least 2 characters.",
    };
  }

  if (normalizeSlug(data.slug || data.name).length < 2) {
    return {
      title: "Choose a business URL",

      description: "Add a valid URL slug for your CAFÉTA listing.",
    };
  }

  if (!data.address.trim() || !data.city.trim() || !data.province.trim()) {
    return {
      title: "Complete the location",

      description: "Address, city, and province are required.",
    };
  }

  if (data.latitude === null || data.longitude === null) {
    return {
      title: "Pin the business location",

      description: "Choose the business location on the map before submitting.",
    };
  }

  if (
    data.latitude < -90 ||
    data.latitude > 90 ||
    data.longitude < -180 ||
    data.longitude > 180
  ) {
    return {
      title: "Check the map location",

      description: "The selected coordinates are invalid.",
    };
  }

  const invalidHours = data.hours.some(
    (hour) => !hour.isClosed && (!hour.opensAt || !hour.closesAt),
  );

  if (invalidHours) {
    return {
      title: "Check your business hours",

      description: "Every open day needs an opening and closing time.",
    };
  }

  const invalidMenuItem = data.menuItems.some((item) => {
    if (!item.name.trim()) {
      return false;
    }

    const price = parsePrice(item.price);

    return price === null || price < 0;
  });

  if (invalidMenuItem) {
    return {
      title: "Check your menu prices",

      description:
        "Every named menu item needs a valid price greater than or equal to zero.",
    };
  }

  return null;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function parsePrice(value: string) {
  const cleaned = value.replace(/,/g, "").trim();

  if (!cleaned) {
    return null;
  }

  const parsed = Number.parseFloat(cleaned);

  return Number.isFinite(parsed) ? parsed : null;
}

function cleanOptional(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned ? cleaned : null;
}

function revokePreviewUrl(value: string | null | undefined) {
  if (value?.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
}

function logSupabaseError(
  operation: string,
  error: SupabaseErrorLike | null | undefined,
) {
  if (!error) {
    return;
  }

  console.error(`[CAFÉTA] ${operation} failed`, {
    message: error.message ?? null,

    code: error.code ?? null,

    details: error.details ?? null,

    hint: error.hint ?? null,
  });
}

function normalizeErrorForLog(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return {
      message: String(error),

      code: null,
      details: null,
      hint: null,
    };
  }

  const value = error as SupabaseErrorLike;

  return {
    message: value.message ?? "Unknown error",

    code: value.code ?? null,

    details: value.details ?? null,

    hint: value.hint ?? null,
  };
}

function getErrorMessage(error: unknown, businessAlreadyCreated = false) {
  const normalized = normalizeErrorForLog(error);

  const raw = normalized.message;

  const message = raw.toLowerCase();

  const code = normalized.code ?? "";

  if (
    code === "23505" ||
    message.includes("business url already exists") ||
    message.includes("duplicate")
  ) {
    return "That business URL is already in use. Choose another one.";
  }

  if (message.includes("authentication required") || message.includes("jwt")) {
    return "The database could not authenticate this request. Refresh the page and try again.";
  }

  if (message.includes("profile not found")) {
    return "Your account is signed in, but its CAFÉTA profile could not be found.";
  }

  if (message.includes("owner") && message.includes("membership")) {
    return "The business was created, but CAFÉTA could not connect your account as its owner.";
  }

  if (
    message.includes("storage") ||
    message.includes("bucket") ||
    message.includes("object")
  ) {
    return businessAlreadyCreated
      ? "Your business was created, but its media upload failed. Check the business-media Storage policies."
      : "CAFÉTA could not upload the business media.";
  }

  if (
    code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied")
  ) {
    return businessAlreadyCreated
      ? "Your business was created, but a later database operation was blocked by its RLS policy."
      : "The database blocked business creation. Check create_business permissions and the authenticated request.";
  }

  return businessAlreadyCreated
    ? `The business was created, but setup stopped: ${raw}`
    : raw || "Something went wrong while creating your business.";
}
