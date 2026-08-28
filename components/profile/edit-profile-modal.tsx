"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  Camera,
  Check,
  LoaderCircle,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  CafetaProfile,
} from "@/lib/profile/types";

import {
  PROFILE_SELECT,
} from "@/lib/profile/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  profile: CafetaProfile;
  email: string;

  onUpdated: (
    profile: CafetaProfile,
  ) => void;
};

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  email,
  onUpdated,
}: Props) {
  const [fullName, setFullName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFullName(
      profile.full_name ?? "",
    );

    setBio(
      profile.bio ?? "",
    );

    setError("");
  }, [
    open,
    profile.full_name,
    profile.bio,
  ]);

  const initials =
    profile.full_name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0),
      )
      .join("")
      .toUpperCase() || "CT";

  const cleanFullName =
    fullName.trim();

  const cleanBio =
    bio.trim();

  const unchanged =
    cleanFullName ===
      (profile.full_name ?? "") &&
    cleanBio ===
      (profile.bio ?? "");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      saving ||
      unchanged
    ) {
      return;
    }

    setError("");

    if (!cleanFullName) {
      setError(
        "Please enter your full name.",
      );

      return;
    }

    if (
      cleanFullName.length > 80
    ) {
      setError(
        "Full name must be 80 characters or less.",
      );

      return;
    }

    if (
      cleanBio.length > 160
    ) {
      setError(
        "Bio must be 160 characters or less.",
      );

      return;
    }

    setSaving(true);

    try {
      const supabase =
        createClient();

      const {
        data,
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          full_name:
            cleanFullName,

          bio:
            cleanBio || null,
        })
        .eq(
          "id",
          profile.id,
        )
        .select(
          PROFILE_SELECT,
        )
        .maybeSingle();

      if (updateError) {
        console.error(
          "Failed to update profile:",
          updateError,
        );

        setError(
          "We couldn't update your profile. Please try again.",
        );

        return;
      }

      if (!data) {
        console.error(
          "Profile update returned no row.",
        );

        setError(
          "Your profile could not be updated. Please refresh and try again.",
        );

        return;
      }

      const updatedProfile =
        data as CafetaProfile;

      onUpdated(
        updatedProfile,
      );

      onOpenChange(false);

      toast.success(
        "Profile updated",
        {
          description:
            "Your CAFÉTA profile has been saved.",
        },
      );
    } catch (submitError) {
      console.error(
        "Unexpected profile update error:",
        submitError,
      );

      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          max-h-[calc(100dvh-24px)]
          overflow-y-auto
          rounded-[28px]
          border-black/[0.06]
          bg-white
          p-0
          shadow-[0_30px_90px_rgba(0,0,0,0.18)]
          sm:max-w-[520px]
          sm:rounded-[32px]
        "
      >
        <DialogHeader
          className="
            relative
            border-b
            border-black/[0.05]
            px-6 pb-5 pt-6
            text-left
          "
        >
          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={saving}
            aria-label="Close"
            className="
              absolute right-5 top-5
              flex size-9
              items-center
              justify-center
              rounded-full
              bg-[#f4f6f4]
              text-black/45
              transition-all
              duration-200
              hover:bg-[#edf2ef]
              hover:text-[#17211c]
              active:scale-90
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <X className="size-4" />
          </button>

          <p
            className="
              text-[10px]
              font-bold uppercase
              tracking-[0.18em]
              text-[#006241]
            "
          >
            Your profile
          </p>

          <DialogTitle
            className="
              mt-1
              text-[22px]
              font-bold
              tracking-[-0.04em]
              text-[#17211c]
            "
          >
            Edit profile
          </DialogTitle>

          <DialogDescription
            className="
              mt-1 max-w-sm
              text-xs leading-5
              text-black/40
            "
          >
            Update how you appear
            across CAFÉTA.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 pb-6"
        >
          <div
            className="
              flex items-center
              gap-4 py-5
            "
          >
            <div
              className="
                group relative
                shrink-0
              "
            >
              <div
                className="
                  relative flex
                  size-[82px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border-[4px]
                  border-white
                  bg-[#e7f1ec]
                  shadow-[0_5px_18px_rgba(0,0,0,0.10)]
                "
              >
                {profile.avatar_url ? (
                  <Image
                    src={
                      profile.avatar_url
                    }
                    alt={
                      profile.full_name ??
                      "Profile photo"
                    }
                    fill
                    sizes="82px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="
                      text-lg
                      font-black
                      text-[#006241]
                    "
                  >
                    {initials}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  toast(
                    "Profile photo upload will be available soon.",
                  )
                }
                aria-label="Change profile photo"
                className="
                  absolute
                  -bottom-0.5
                  -right-0.5
                  flex size-8
                  items-center
                  justify-center
                  rounded-full
                  border-[3px]
                  border-white
                  bg-[#006241]
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:bg-[#00754a]
                  active:scale-90
                "
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm font-bold
                  text-[#17211c]
                "
              >
                Profile photo
              </p>

              <p
                className="
                  mt-1
                  text-xs leading-5
                  text-black/40
                "
              >
                Your current CAFÉTA
                profile photo.
              </p>

              {profile.username && (
                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    font-semibold
                    text-[#006241]
                  "
                >
                  @{profile.username}
                </p>
              )}
            </div>
          </div>

          <div className="h-px bg-black/[0.05]" />

          <div className="space-y-4 pt-5">
            <Field>
              <FieldLabel
                htmlFor="fullName"
              >
                Full name
              </FieldLabel>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value,
                  )
                }
                autoComplete="name"
                maxLength={80}
                placeholder="Your full name"
                className={
                  inputClassName
                }
              />
            </Field>

            <Field>
              <div
                className="
                  flex items-center
                  justify-between
                "
              >
                <FieldLabel htmlFor="bio">
                  Bio
                </FieldLabel>

                <span
                  className="
                    text-[10px]
                    font-medium
                    text-black/30
                  "
                >
                  {bio.length}/160
                </span>
              </div>

              <textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(
                    event.target.value,
                  )
                }
                maxLength={160}
                rows={3}
                placeholder="Tell the CAFÉTA community a little about yourself..."
                className="
                  min-h-[100px]
                  w-full
                  resize-none
                  rounded-[16px]
                  border
                  border-black/[0.08]
                  bg-[#fafbfa]
                  px-4 py-3
                  text-sm
                  leading-6
                  text-[#17211c]
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-black/25
                  hover:border-black/[0.12]
                  focus:border-[#006241]/40
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#006241]/[0.06]
                "
              />
            </Field>

            <Field>
              <FieldLabel>
                Username
              </FieldLabel>

              <div
                className="
                  flex h-12
                  items-center
                  rounded-[16px]
                  border
                  border-black/[0.05]
                  bg-[#f6f7f6]
                  px-4
                "
              >
                <span
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-[#006241]
                  "
                >
                  {profile.username
                    ? `@${profile.username}`
                    : "Not set"}
                </span>
              </div>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  leading-4
                  text-black/35
                "
              >
                Change your username
                from the Username section
                on your profile.
              </p>
            </Field>

            <Field>
              <FieldLabel>
                Email address
              </FieldLabel>

              <div
                className="
                  flex h-12
                  items-center
                  justify-between
                  rounded-[16px]
                  border
                  border-black/[0.05]
                  bg-[#f6f7f6]
                  px-4
                "
              >
                <span
                  className="
                    truncate
                    text-sm
                    text-black/45
                  "
                >
                  {email}
                </span>

                <span
                  className="
                    ml-3 shrink-0
                    rounded-full
                    bg-[#e7f1ec]
                    px-2.5 py-1
                    text-[9px]
                    font-bold uppercase
                    tracking-[0.08em]
                    text-[#006241]
                  "
                >
                  Account
                </span>
              </div>
            </Field>
          </div>

          {error && (
            <div
              role="alert"
              className="
                mt-4
                rounded-[14px]
                border
                border-red-200
                bg-red-50
                px-4 py-3
                text-xs
                leading-5
                text-red-700
              "
            >
              {error}
            </div>
          )}

          <div
            className="
              mt-6 flex
              items-center
              justify-end
              gap-2
              border-t
              border-black/[0.05]
              pt-5
            "
          >
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                onOpenChange(false)
              }
              className="
                h-11
                rounded-full
                border
                border-black/[0.08]
                px-5
                text-xs
                font-bold
                text-[#39443e]
                transition-all
                duration-200
                hover:bg-[#f5f7f5]
                active:scale-95
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                unchanged ||
                !cleanFullName
              }
              className="
                flex h-11
                min-w-[130px]
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#006241]
                px-5
                text-xs
                font-bold
                text-white
                shadow-[0_6px_18px_rgba(0,98,65,0.18)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#00754a]
                active:translate-y-0
                active:scale-[0.97]
                disabled:pointer-events-none
                disabled:opacity-40
              "
            >
              {saving ? (
                <>
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />

                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="
        mb-1.5 block
        text-[11px]
        font-bold
        text-[#344039]
      "
    >
      {children}
    </label>
  );
}

const inputClassName = `
  h-12
  w-full
  rounded-[16px]
  border
  border-black/[0.08]
  bg-[#fafbfa]
  px-4
  text-sm
  text-[#17211c]
  outline-none
  transition-all
  duration-200
  placeholder:text-black/25
  hover:border-black/[0.12]
  focus:border-[#006241]/40
  focus:bg-white
  focus:ring-4
  focus:ring-[#006241]/[0.06]
`;