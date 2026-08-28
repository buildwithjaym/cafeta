"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  ImagePlus,
  LoaderCircle,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { toast } from "sonner";

import type {
  CafetaProfile,
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

const MAX_AVATAR_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  email,
  onUpdated,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    fullName,
    setFullName,
  ] = useState(
    profile.full_name ?? "",
  );

  const [
    bio,
    setBio,
  ] = useState(
    profile.bio ?? "",
  );

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null,
  );

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(
    profile.avatar_url,
  );

  const [
    avatarFailed,
    setAvatarFailed,
  ] = useState(false);

  const [
    removeAvatar,
    setRemoveAvatar,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

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

    setSelectedFile(null);

    setPreviewUrl(
      profile.avatar_url,
    );

    setAvatarFailed(false);
    setRemoveAvatar(false);
  }, [
    open,
    profile.full_name,
    profile.bio,
    profile.avatar_url,
  ]);

  useEffect(() => {
    return () => {
      if (
        previewUrl?.startsWith(
          "blob:",
        )
      ) {
        URL.revokeObjectURL(
          previewUrl,
        );
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
          "Escape" &&
        !saving
      ) {
        onOpenChange(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    saving,
    onOpenChange,
  ]);

  if (!open) {
    return null;
  }

  const displayName =
    fullName.trim() ||
    profile.username?.trim() ||
    email.split("@")[0] ||
    "CAFÉTA User";

  const showAvatar =
    Boolean(previewUrl) &&
    !avatarFailed &&
    !removeAvatar;

  function closeModal() {
    if (saving) {
      return;
    }

    onOpenChange(false);
  }

  function openFilePicker() {
    if (saving) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      toast.error(
        "Unsupported image",
        {
          description:
            "Please choose a JPG, PNG, or WebP image.",
        },
      );

      return;
    }

    if (
      file.size >
      MAX_AVATAR_SIZE
    ) {
      toast.error(
        "Image is too large",
        {
          description:
            "Your profile photo must be 5 MB or smaller.",
        },
      );

      return;
    }

    if (
      previewUrl?.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        previewUrl,
      );
    }

    const objectUrl =
      URL.createObjectURL(
        file,
      );

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setRemoveAvatar(false);
    setAvatarFailed(false);
  }

  function handleRemoveAvatar() {
    if (
      previewUrl?.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        previewUrl,
      );
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveAvatar(true);
    setAvatarFailed(false);
  }

  async function uploadAvatar(
    userId: string,
    file: File,
  ) {
    const supabase =
      createClient();

    const extension =
      getFileExtension(file);

    const objectPath =
      `${userId}/avatar.${extension}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("avatars")
        .upload(
          objectPath,
          file,
          {
            upsert: true,
            contentType:
              file.type,
            cacheControl:
              "3600",
          },
        );

    if (uploadError) {
      throw new Error(
        uploadError.message,
      );
    }

    const { data } =
      supabase.storage
        .from("avatars")
        .getPublicUrl(
          objectPath,
        );

    if (!data.publicUrl) {
      throw new Error(
        "Unable to create avatar URL.",
      );
    }

    return addCacheBuster(
      data.publicUrl,
    );
  }

  async function deleteCurrentAvatar(
    userId: string,
  ) {
    const avatarUrl =
      profile.avatar_url;

    if (!avatarUrl) {
      return;
    }

    const storagePath =
      getAvatarStoragePath(
        avatarUrl,
      );

    if (!storagePath) {
      return;
    }

    if (
      !storagePath.startsWith(
        `${userId}/`,
      )
    ) {
      return;
    }

    const supabase =
      createClient();

    const { error } =
      await supabase.storage
        .from("avatars")
        .remove([
          storagePath,
        ]);

    if (error) {
      console.warn(
        "[CAFÉTA] Failed to remove old avatar:",
        error.message,
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const cleanedName =
      fullName.trim();

    const cleanedBio =
      bio.trim();

    if (!cleanedName) {
      toast.error(
        "Enter your name",
      );

      return;
    }

    if (
      cleanedName.length >
      80
    ) {
      toast.error(
        "Name is too long",
        {
          description:
            "Use 80 characters or fewer.",
        },
      );

      return;
    }

    if (
      cleanedBio.length >
      300
    ) {
      toast.error(
        "Bio is too long",
        {
          description:
            "Use 300 characters or fewer.",
        },
      );

      return;
    }

    setSaving(true);

    try {
      const supabase =
        createClient();

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        throw new Error(
          "Your session is unavailable. Please sign in again.",
        );
      }

      if (
        user.id !== profile.id
      ) {
        throw new Error(
          "You cannot update this profile.",
        );
      }

      let avatarUrl =
        profile.avatar_url;

      if (selectedFile) {
        avatarUrl =
          await uploadAvatar(
            user.id,
            selectedFile,
          );
      } else if (
        removeAvatar
      ) {
        await deleteCurrentAvatar(
          user.id,
        );

        avatarUrl = null;
      }

      const {
        data:
          updatedProfile,
        error:
          updateError,
      } =
        await supabase
          .from("profiles")
          .update({
            full_name:
              cleanedName,
            bio:
              cleanedBio ||
              null,
            avatar_url:
              avatarUrl,
          })
          .eq(
            "id",
            user.id,
          )
          .select(`
            id,
            full_name,
            username,
            bio,
            avatar_url,
            role,
            created_at,
            updated_at
          `)
          .single();

      if (updateError) {
        throw new Error(
          updateError.message,
        );
      }

      if (
        !updatedProfile
      ) {
        throw new Error(
          "Profile update returned no data.",
        );
      }

      const nextProfile =
        updatedProfile as CafetaProfile;

      onUpdated(
        nextProfile,
      );

      toast.success(
        "Profile updated",
        {
          description:
            "Your changes have been saved.",
        },
      );

      onOpenChange(false);
    } catch (error) {
      console.error(
        "[CAFÉTA] Edit profile failed:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your profile.";

      toast.error(
        "Couldn't update profile",
        {
          description:
            message,
        },
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-center
        justify-center

        bg-black/35

        p-3

        backdrop-blur-[3px]

        animate-in
        fade-in
        duration-200

        sm:p-4
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closeModal();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="
          relative

          flex
          w-full
          max-w-[430px]
          max-h-[calc(100dvh-24px)]
          flex-col

          overflow-hidden

          rounded-[24px]

          border
          border-black/[0.06]

          bg-white

          shadow-[0_24px_70px_rgba(0,0,0,0.18)]

          animate-in
          fade-in
          zoom-in-95
          duration-200

          sm:max-h-[680px]
        "
      >
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between

            border-b
            border-black/[0.05]

            bg-white

            px-5
            py-3.5
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#006241]
              "
            >
              Your account
            </p>

            <h2
              id="edit-profile-title"
              className="
                mt-0.5

                text-[17px]
                font-black
                tracking-[-0.03em]
                text-[#17211c]
              "
            >
              Edit profile
            </h2>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            aria-label="Close edit profile"
            className="
              flex
              size-8
              items-center
              justify-center

              rounded-full

              bg-[#f3f5f3]

              text-black/40

              transition-all
              duration-200

              hover:scale-105
              hover:bg-[#e8eeea]
              hover:text-[#17211c]

              active:scale-95

              disabled:pointer-events-none
              disabled:opacity-40
            "
          >
            <X
              className="size-3.5"
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="
            flex
            min-h-0
            flex-1
            flex-col
          "
        >
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto

              px-5
              py-4
            "
          >
            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleFileChange
              }
              className="hidden"
            />

            <div
              className="
                flex
                items-center
                gap-3.5

                rounded-[18px]

                bg-[#f7f9f7]

                p-3
              "
            >
              <div
                className="
                  group
                  relative
                  shrink-0
                "
              >
                <button
                  type="button"
                  onClick={
                    openFilePicker
                  }
                  disabled={
                    saving
                  }
                  aria-label="Choose profile photo"
                  className="
                    relative

                    block
                    size-[72px]
                    overflow-hidden

                    rounded-full

                    border-[3px]
                    border-white

                    bg-[#e8f2ed]

                    shadow-[0_5px_18px_rgba(23,33,28,0.10)]

                    transition-all
                    duration-200

                    hover:scale-[1.02]

                    disabled:pointer-events-none
                  "
                >
                  {showAvatar ? (
                    <img
                      key={
                        previewUrl
                      }
                      src={
                        previewUrl!
                      }
                      alt={`${displayName} profile`}
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setAvatarFailed(
                          true,
                        );
                      }}
                      className="
                        block
                        size-full
                        object-cover

                        transition-transform
                        duration-300

                        group-hover:scale-[1.04]
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        size-full
                        items-center
                        justify-center

                        bg-gradient-to-br
                        from-[#edf5f1]
                        to-[#dcebe3]

                        text-lg
                        font-black
                        tracking-[-0.04em]
                        text-[#006241]
                      "
                    >
                      {getInitials(
                        displayName,
                      )}
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    openFilePicker
                  }
                  disabled={
                    saving
                  }
                  aria-label="Change profile photo"
                  className="
                    absolute
                    bottom-0
                    right-0

                    flex
                    size-7
                    items-center
                    justify-center

                    rounded-full

                    border-[2px]
                    border-white

                    bg-[#006241]
                    text-white

                    shadow-[0_4px_10px_rgba(0,98,65,0.22)]

                    transition-all
                    duration-200

                    hover:scale-110
                    hover:bg-[#00754a]

                    active:scale-95

                    disabled:pointer-events-none
                  "
                >
                  <Camera
                    className="size-3"
                  />
                </button>
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-[13px]
                    font-bold
                    text-[#17211c]
                  "
                >
                  Profile photo
                </p>

                <p
                  className="
                    mt-0.5

                    text-[10px]
                    text-black/35
                  "
                >
                  JPG, PNG or WebP ·
                  Max 5 MB
                </p>

                <div
                  className="
                    mt-2.5

                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                  "
                >
                  <button
                    type="button"
                    onClick={
                      openFilePicker
                    }
                    disabled={
                      saving
                    }
                    className="
                      inline-flex
                      h-7
                      items-center
                      gap-1.5

                      rounded-full

                      bg-[#e5f1eb]

                      px-2.5

                      text-[10px]
                      font-bold
                      text-[#006241]

                      transition-all
                      duration-200

                      hover:bg-[#dcebe3]

                      active:scale-[0.97]

                      disabled:pointer-events-none
                      disabled:opacity-50
                    "
                  >
                    <ImagePlus
                      className="size-3"
                    />

                    {showAvatar
                      ? "Change"
                      : "Add photo"}
                  </button>

                  {(
                    profile.avatar_url ||
                    selectedFile
                  ) && (
                    <button
                      type="button"
                      onClick={
                        handleRemoveAvatar
                      }
                      disabled={
                        saving
                      }
                      className="
                        inline-flex
                        h-7
                        items-center
                        gap-1.5

                        rounded-full

                        bg-red-50

                        px-2.5

                        text-[10px]
                        font-bold
                        text-red-600

                        transition-all
                        duration-200

                        hover:bg-red-100

                        active:scale-[0.97]

                        disabled:pointer-events-none
                        disabled:opacity-50
                      "
                    >
                      <Trash2
                        className="size-3"
                      />

                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="profile-full-name"
                className="
                  text-[11px]
                  font-bold
                  text-[#25312b]
                "
              >
                Full name
              </label>

              <div
                className="
                  relative
                  mt-1.5
                "
              >
                <UserRound
                  className="
                    pointer-events-none

                    absolute
                    left-3.5
                    top-1/2

                    size-3.5

                    -translate-y-1/2

                    text-black/25
                  "
                />

                <input
                  id="profile-full-name"
                  value={
                    fullName
                  }
                  onChange={(
                    event,
                  ) => {
                    setFullName(
                      event.target
                        .value,
                    );
                  }}
                  maxLength={80}
                  disabled={
                    saving
                  }
                  autoComplete="name"
                  placeholder="Your full name"
                  className="
                    h-11
                    w-full

                    rounded-[14px]

                    border
                    border-black/[0.07]

                    bg-[#fafbfa]

                    pl-10
                    pr-3.5

                    text-[13px]
                    font-medium
                    text-[#17211c]

                    outline-none

                    transition-all
                    duration-200

                    placeholder:text-black/25

                    focus:border-[#006241]/30
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#006241]/[0.05]

                    disabled:opacity-60
                  "
                />
              </div>
            </div>

            <div className="mt-3.5">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <label
                  htmlFor="profile-bio"
                  className="
                    text-[11px]
                    font-bold
                    text-[#25312b]
                  "
                >
                  Bio
                </label>

                <span
                  className="
                    text-[9px]
                    text-black/25
                  "
                >
                  {bio.length}/300
                </span>
              </div>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(
                  event,
                ) => {
                  setBio(
                    event.target
                      .value,
                  );
                }}
                maxLength={300}
                rows={3}
                disabled={
                  saving
                }
                placeholder="Tell the CAFÉTA community a little about yourself..."
                className="
                  mt-1.5

                  min-h-[84px]
                  w-full
                  resize-none

                  rounded-[14px]

                  border
                  border-black/[0.07]

                  bg-[#fafbfa]

                  px-3.5
                  py-3

                  text-[13px]
                  leading-5
                  text-[#17211c]

                  outline-none

                  transition-all
                  duration-200

                  placeholder:text-black/25

                  focus:border-[#006241]/30
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#006241]/[0.05]

                  disabled:opacity-60
                "
              />
            </div>

            <div
              className="
                mt-3.5

                flex
                items-center
                gap-3

                rounded-[14px]

                bg-[#f5f7f5]

                px-3.5
                py-2.5
              "
            >
              <div
                className="
                  flex
                  size-7
                  shrink-0
                  items-center
                  justify-center

                  rounded-[9px]

                  bg-white

                  text-[#006241]

                  shadow-sm
                "
              >
                <UserRound
                  className="size-3.5"
                />
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-black/25
                  "
                >
                  Email
                </p>

                <p
                  className="
                    mt-0.5
                    truncate

                    text-[11px]
                    font-medium
                    text-[#59635e]
                  "
                >
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              grid
              shrink-0
              grid-cols-2
              gap-2

              border-t
              border-black/[0.05]

              bg-white

              px-5
              py-3
            "
          >
            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={
                saving
              }
              className="
                flex
                h-10
                items-center
                justify-center

                rounded-[13px]

                bg-[#f1f4f2]

                text-[11px]
                font-bold
                text-[#455049]

                transition-all
                duration-200

                hover:bg-[#e8ece9]

                active:scale-[0.98]

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="
                flex
                h-10
                items-center
                justify-center
                gap-1.5

                rounded-[13px]

                bg-[#006241]

                text-[11px]
                font-bold
                text-white

                shadow-[0_5px_14px_rgba(0,98,65,0.15)]

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#00754a]

                active:translate-y-0
                active:scale-[0.98]

                disabled:pointer-events-none
                disabled:opacity-60
              "
            >
              {saving && (
                <LoaderCircle
                  className="
                    size-3.5
                    animate-spin
                  "
                />
              )}

              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getInitials(
  name: string,
) {
  const cleaned =
    name.trim();

  if (!cleaned) {
    return "C";
  }

  return cleaned
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();
}

function getFileExtension(
  file: File,
) {
  switch (file.type) {
    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/jpeg":
    default:
      return "jpg";
  }
}

function addCacheBuster(
  url: string,
) {
  const separator =
    url.includes("?")
      ? "&"
      : "?";

  return `${url}${separator}v=${Date.now()}`;
}

function getAvatarStoragePath(
  avatarUrl: string,
) {
  try {
    const url =
      new URL(avatarUrl);

    const marker =
      "/storage/v1/object/public/avatars/";

    const markerIndex =
      url.pathname.indexOf(
        marker,
      );

    if (
      markerIndex === -1
    ) {
      return null;
    }

    return decodeURIComponent(
      url.pathname.slice(
        markerIndex +
          marker.length,
      ),
    );
  } catch {
    return null;
  }
}