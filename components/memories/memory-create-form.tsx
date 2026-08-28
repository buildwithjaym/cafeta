"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronDown,
  Coffee,
  LoaderCircle,
  MapPin,
  Search,
  Send,
  Store,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  MemoryImageUpload,
} from "@/components/memories/memory-image-upload";

import type {
  MemoryAuthor,
  MemoryBusiness,
} from "@/lib/memories/types";

import {
  createClient,
} from "@/lib/supabase/client";

type Props = {
  userId: string;
  profile: MemoryAuthor;
  businesses: MemoryBusiness[];
};

export function MemoryCreateForm({
  userId,
  profile,
  businesses,
}: Props) {
  const router =
    useRouter();

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] =
    useState<MemoryBusiness | null>(
      null,
    );

  const [
    pickerOpen,
    setPickerOpen,
  ] =
    useState(false);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] =
    useState("");

  const [
    image,
    setImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    caption,
    setCaption,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            search
              .trim()
              .toLowerCase(),
          );
        },
        250,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    search,
  ]);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setPickerOpen(
          false,
        );

        setSearch(
          "",
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    pickerOpen,
  ]);

  const filteredBusinesses =
    useMemo(() => {
      if (
        !debouncedSearch
      ) {
        return businesses;
      }

      return businesses.filter(
        (
          business,
        ) =>
          [
            business.name,
            business.category,
            business.barangay,
            business.city,
            business.province,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(
              debouncedSearch,
            ),
      );
    }, [
      businesses,
      debouncedSearch,
    ]);

  const authorName =
    profile.username
      ? `@${profile.username}`
      : profile.full_name ||
        "CAFÉTA user";

  const canSubmit =
    Boolean(
      selectedBusiness &&
        image &&
        !submitting,
    );

  function closePicker() {
    setPickerOpen(
      false,
    );

    setSearch(
      "",
    );
  }

  function chooseBusiness(
    business:
      MemoryBusiness,
  ) {
    setSelectedBusiness(
      business,
    );

    closePicker();
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !selectedBusiness
    ) {
      toast.error(
        "Choose a business",
      );

      return;
    }

    if (!image) {
      toast.error(
        "Add a photo",
      );

      return;
    }

    const cleanCaption =
      caption.trim();

    if (
      cleanCaption.length >
      1000
    ) {
      toast.error(
        "Caption is too long",
      );

      return;
    }

    setSubmitting(
      true,
    );

    const supabase =
      createClient();

    const memoryId =
      crypto.randomUUID();

    const imagePath =
      `${userId}/${memoryId}.webp`;

    let imageUploaded =
      false;

    try {
      const {
        data: {
          user,
        },
        error:
          authError,
      } =
        await supabase.auth.getUser();

      if (
        authError ||
        !user ||
        user.id !== userId
      ) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      const {
        error:
          uploadError,
      } =
        await supabase.storage
          .from(
            "memories",
          )
          .upload(
            imagePath,
            image,
            {
              contentType:
                "image/webp",

              cacheControl:
                "31536000",

              upsert:
                false,
            },
          );

      if (
        uploadError
      ) {
        throw uploadError;
      }

      imageUploaded =
        true;

      const {
        data:
          publicUrlData,
      } =
        supabase.storage
          .from(
            "memories",
          )
          .getPublicUrl(
            imagePath,
          );

      const {
        error:
          insertError,
      } =
        await supabase
          .from(
            "memories",
          )
          .insert({
            id:
              memoryId,

            user_id:
              user.id,

            business_id:
              selectedBusiness.id,

            image_url:
              publicUrlData.publicUrl,

            caption:
              cleanCaption ||
              null,
          });

      if (
        insertError
      ) {
        throw insertError;
      }

      toast.success(
        "Memory shared",
        {
          description:
            `Your memory at ${selectedBusiness.name} was shared.`,
        },
      );

      router.replace(
        `/memories/${memoryId}`,
      );

      router.refresh();
    } catch (
      error
    ) {
      console.error(
        "[CAFÉTA] Failed to share memory:",
        error,
      );

      if (
        imageUploaded
      ) {
        await supabase.storage
          .from(
            "memories",
          )
          .remove([
            imagePath,
          ]);
      }

      toast.error(
        "Couldn't share memory",
        {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        },
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  return (
    <main
      className="
        min-h-[calc(100dvh-64px)]

        bg-[#f6f7f5]

        pb-28

        md:pb-12
      "
    >
      <div
        className="
          mx-auto

          w-full
          max-w-[720px]

          px-4
          py-5

          sm:px-6
          sm:py-8
        "
      >
        <header
          className="
            flex
            items-center
            gap-4
          "
        >
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            aria-label="Go back"
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center

              rounded-full

              border
              border-black/[0.06]

              bg-white

              text-[#17211c]

              shadow-sm

              transition-all

              hover:-translate-y-0.5
              hover:bg-[#f4f7f5]

              active:scale-95
            "
          >
            <ArrowLeft
              className="
                size-4
              "
            />
          </button>

          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.17em]

                text-[#006241]
              "
            >
              CAFÉTA Memories
            </p>

            <h1
              className="
                mt-0.5

                text-xl
                font-black
                tracking-[-0.04em]

                text-[#17211c]

                sm:text-2xl
              "
            >
              Share a memory
            </h1>
          </div>
        </header>

        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-6
          "
        >
          <section
            className="
              overflow-hidden

              rounded-[26px]

              border
              border-black/[0.055]

              bg-white

              shadow-[0_12px_40px_rgba(23,33,28,0.045)]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3

                border-b
                border-black/[0.05]

                px-5
                py-4
              "
            >
              <AuthorAvatar
                profile={
                  profile
                }
              />

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    truncate

                    text-xs
                    font-bold

                    text-[#17211c]
                  "
                >
                  {authorName}
                </p>

                <p
                  className="
                    mt-0.5

                    text-[9px]

                    text-black/35
                  "
                >
                  Sharing a memory
                </p>
              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1.5

                  rounded-full

                  bg-[#edf5f1]

                  px-2.5
                  py-1.5

                  text-[9px]
                  font-bold

                  text-[#006241]
                "
              >
                <Coffee
                  className="
                    size-3
                  "
                />

                Memory
              </div>
            </div>

            <div
              className="
                p-5

                sm:p-6
              "
            >
              <FieldLabel>
                Where was this?
              </FieldLabel>

              <button
                type="button"
                disabled={
                  submitting
                }
                onClick={() =>
                  setPickerOpen(
                    true,
                  )
                }
                className="
                  mt-2

                  flex
                  min-h-14
                  w-full
                  items-center
                  gap-3

                  rounded-[16px]

                  border
                  border-black/[0.07]

                  bg-[#fafbfa]

                  px-3.5

                  text-left

                  transition-all

                  hover:border-[#006241]/25
                  hover:bg-white

                  disabled:pointer-events-none
                  disabled:opacity-60
                "
              >
                {selectedBusiness ? (
                  <>
                    <BusinessLogo
                      business={
                        selectedBusiness
                      }
                    />

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-1
                        "
                      >
                        <p
                          className="
                            truncate

                            text-xs
                            font-bold

                            text-[#17211c]
                          "
                        >
                          {
                            selectedBusiness.name
                          }
                        </p>

                        {selectedBusiness.is_verified && (
                          <BadgeCheck
                            className="
                              size-3.5
                              shrink-0

                              fill-[#1689e8]
                              text-white
                            "
                          />
                        )}
                      </div>

                      <p
                        className="
                          mt-0.5
                          truncate

                          text-[9px]

                          text-black/35
                        "
                      >
                        {formatLocation(
                          selectedBusiness,
                        ) ||
                          formatCategory(
                            selectedBusiness.category,
                          )}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center

                        rounded-[11px]

                        bg-[#e8f2ed]

                        text-[#006241]
                      "
                    >
                      <MapPin
                        className="
                          size-4
                        "
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
                          text-xs
                          font-bold

                          text-[#17211c]
                        "
                      >
                        Choose a business
                      </p>

                      <p
                        className="
                          mt-0.5

                          text-[9px]

                          text-black/35
                        "
                      >
                        Where did this
                        memory happen?
                      </p>
                    </div>
                  </>
                )}

                <ChevronDown
                  className="
                    size-4
                    shrink-0

                    text-black/25
                  "
                />
              </button>

              <div
                className="
                  mt-5
                "
              >
                <FieldLabel>
                  Your photo
                </FieldLabel>

                <div
                  className="
                    mt-2
                  "
                >
                  <MemoryImageUpload
                    value={
                      image
                    }
                    onChange={
                      setImage
                    }
                    disabled={
                      submitting
                    }
                  />
                </div>
              </div>

              <div
                className="
                  mt-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <FieldLabel>
                    Tell the story
                  </FieldLabel>

                  <span
                    className={`
                      text-[9px]

                      ${
                        caption.length >
                        900
                          ? "font-bold text-amber-600"
                          : "text-black/25"
                      }
                    `}
                  >
                    {
                      caption.length
                    }
                    /1000
                  </span>
                </div>

                <textarea
                  value={
                    caption
                  }
                  onChange={(
                    event,
                  ) =>
                    setCaption(
                      event.target
                        .value,
                    )
                  }
                  maxLength={
                    1000
                  }
                  disabled={
                    submitting
                  }
                  rows={
                    4
                  }
                  placeholder="What made this café moment memorable?"
                  className="
                    mt-2

                    min-h-[108px]
                    w-full
                    resize-none

                    rounded-[16px]

                    border
                    border-black/[0.07]

                    bg-[#fafbfa]

                    px-4
                    py-3.5

                    text-sm
                    leading-6

                    text-[#17211c]

                    outline-none

                    transition

                    placeholder:text-black/25

                    focus:border-[#006241]/35
                    focus:bg-white

                    disabled:opacity-60
                  "
                />
              </div>
            </div>

            <div
              className="
                border-t
                border-black/[0.05]

                bg-[#fafbfa]

                px-5
                py-4

                sm:px-6
              "
            >
              <button
                type="submit"
                disabled={
                  !canSubmit
                }
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  bg-[#006241]

                  text-[11px]
                  font-bold
                  text-white

                  shadow-[0_6px_18px_rgba(0,98,65,0.16)]

                  transition-all

                  hover:-translate-y-0.5
                  hover:bg-[#00754a]

                  active:translate-y-0
                  active:scale-[0.985]

                  disabled:pointer-events-none
                  disabled:bg-black/10
                  disabled:text-black/30
                  disabled:shadow-none

                  sm:ml-auto
                  sm:w-auto
                  sm:px-6
                "
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      className="
                        size-3.5
                        animate-spin
                      "
                    />

                    Sharing...
                  </>
                ) : (
                  <>
                    <Send
                      className="
                        size-3.5
                      "
                    />

                    Share memory
                  </>
                )}
              </button>
            </div>
          </section>
        </form>
      </div>

      {pickerOpen && (
        <BusinessPicker
          businesses={
            filteredBusinesses
          }
          selectedBusiness={
            selectedBusiness
          }
          search={
            search
          }
          onSearch={
            setSearch
          }
          onSelect={
            chooseBusiness
          }
          onClose={
            closePicker
          }
        />
      )}
    </main>
  );
}

function BusinessPicker({
  businesses,
  selectedBusiness,
  search,
  onSearch,
  onSelect,
  onClose,
}: {
  businesses:
    MemoryBusiness[];

  selectedBusiness:
    MemoryBusiness | null;

  search:
    string;

  onSearch: (
    value: string,
  ) => void;

  onSelect: (
    business:
      MemoryBusiness,
  ) => void;

  onClose:
    () => void;
}) {
  return (
    <div
      role="presentation"
      className="
        fixed
        inset-0
        z-[130]

        flex
        items-end
        justify-center

        bg-[#111814]/40

        backdrop-blur-[3px]

        animate-in
        fade-in
        duration-200

        sm:items-center
        sm:p-5
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-picker-title"
        className="
          w-full

          max-h-[72dvh]

          overflow-hidden

          rounded-t-[26px]

          bg-white

          shadow-[0_-12px_50px_rgba(0,0,0,0.14)]

          animate-in
          slide-in-from-bottom-4
          duration-300

          sm:max-h-[560px]
          sm:max-w-[440px]
          sm:rounded-[26px]
          sm:shadow-[0_24px_80px_rgba(0,0,0,0.18)]
        "
      >
        <div
          className="
            flex
            justify-center

            pt-2.5

            sm:hidden
          "
        >
          <div
            className="
              h-1
              w-9

              rounded-full

              bg-black/10
            "
          />
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-4

            border-b
            border-black/[0.05]

            px-5
            pb-4
            pt-3

            sm:py-4
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.15em]

                text-[#006241]
              "
            >
              Location
            </p>

            <h2
              id="business-picker-title"
              className="
                mt-1

                text-base
                font-black
                tracking-[-0.025em]

                text-[#17211c]
              "
            >
              Choose a business
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close business picker"
            className="
              flex
              size-8
              shrink-0
              items-center
              justify-center

              rounded-full

              bg-black/[0.045]

              text-black/40

              transition

              hover:bg-black/[0.075]
              hover:text-black/60

              active:scale-95
            "
          >
            <X
              className="
                size-3.5
              "
            />
          </button>
        </div>

        <div
          className="
            p-4
          "
        >
          <div
            className="
              flex
              h-11
              items-center
              gap-2.5

              rounded-[14px]

              border
              border-black/[0.07]

              bg-[#f7f8f7]

              px-3.5

              transition

              focus-within:border-[#006241]/30
              focus-within:bg-white
              focus-within:ring-2
              focus-within:ring-[#006241]/5
            "
          >
            <Search
              className="
                size-4
                shrink-0

                text-black/30
              "
            />

            <input
              autoFocus
              value={
                search
              }
              onChange={(
                event,
              ) =>
                onSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search businesses"
              className="
                min-w-0
                flex-1

                bg-transparent

                text-xs
                text-[#17211c]

                outline-none

                placeholder:text-black/30
              "
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  onSearch(
                    "",
                  )
                }
                aria-label="Clear search"
                className="
                  flex
                  size-6
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  text-black/30

                  transition

                  hover:bg-black/[0.05]
                  hover:text-black/50
                "
              >
                <X
                  className="
                    size-3
                  "
                />
              </button>
            )}
          </div>

          <div
            className="
              mt-3

              max-h-[280px]

              overflow-y-auto
              overscroll-contain

              pr-0.5
            "
          >
            {businesses.length >
            0 ? (
              <div
                className="
                  space-y-1
                "
              >
                {businesses.map(
                  (
                    business,
                  ) => {
                    const selected =
                      selectedBusiness
                        ?.id ===
                      business.id;

                    return (
                      <button
                        key={
                          business.id
                        }
                        type="button"
                        onClick={() =>
                          onSelect(
                            business,
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          gap-3

                          rounded-[14px]

                          px-2.5
                          py-2

                          text-left

                          transition-all
                          duration-200

                          ${
                            selected
                              ? "bg-[#edf5f1] ring-1 ring-[#006241]/10"
                              : "hover:bg-black/[0.025]"
                          }
                        `}
                      >
                        <BusinessLogo
                          business={
                            business
                          }
                        />

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-1
                            "
                          >
                            <p
                              className="
                                truncate

                                text-[11px]
                                font-bold

                                text-[#17211c]
                              "
                            >
                              {
                                business.name
                              }
                            </p>

                            {business.is_verified && (
                              <BadgeCheck
                                className="
                                  size-3
                                  shrink-0

                                  fill-[#1689e8]
                                  text-white
                                "
                              />
                            )}
                          </div>

                          <p
                            className="
                              mt-0.5
                              truncate

                              text-[8px]

                              text-black/35
                            "
                          >
                            {formatLocation(
                              business,
                            ) ||
                              formatCategory(
                                business.category,
                              )}
                          </p>
                        </div>

                        {selected && (
                          <div
                            className="
                              flex
                              size-6
                              shrink-0
                              items-center
                              justify-center

                              rounded-full

                              bg-[#006241]

                              text-white

                              shadow-[0_3px_10px_rgba(0,98,65,0.18)]
                            "
                          >
                            <Check
                              className="
                                size-3
                              "
                            />
                          </div>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-[160px]
                  flex-col
                  items-center
                  justify-center

                  rounded-[18px]

                  bg-[#f8faf8]

                  px-5

                  text-center
                "
              >
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center

                    rounded-full

                    bg-[#e8f2ed]

                    text-[#006241]
                  "
                >
                  <Store
                    className="
                      size-4
                    "
                  />
                </div>

                <p
                  className="
                    mt-3

                    text-xs
                    font-bold

                    text-[#17211c]
                  "
                >
                  No businesses found
                </p>

                <p
                  className="
                    mt-1

                    max-w-[230px]

                    text-[9px]
                    leading-4

                    text-black/35
                  "
                >
                  Try another business
                  name or location.
                </p>
              </div>
            )}
          </div>

          <p
            className="
              mt-3

              px-1

              text-[8px]
              leading-4

              text-black/30
            "
          >
            Only approved businesses
            can be tagged in a Memory.
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthorAvatar({
  profile,
}: {
  profile:
    MemoryAuthor;
}) {
  const [
    failed,
    setFailed,
  ] =
    useState(false);

  const show =
    Boolean(
      profile.avatar_url,
    ) &&
    !failed;

  const name =
    profile.full_name ||
    profile.username ||
    "CAFÉTA";

  return (
    <div
      className="
        size-10
        shrink-0

        overflow-hidden

        rounded-full

        bg-[#e8f2ed]
      "
    >
      {show ? (
        <img
          src={
            profile.avatar_url!
          }
          alt={`${name} avatar`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(
              true,
            )
          }
          className="
            size-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            size-full
            items-center
            justify-center

            text-xs
            font-black

            text-[#006241]
          "
        >
          {getInitials(
            name,
          )}
        </div>
      )}
    </div>
  );
}

function BusinessLogo({
  business,
}: {
  business:
    MemoryBusiness;
}) {
  const [
    failed,
    setFailed,
  ] =
    useState(false);

  return (
    <div
      className="
        flex
        size-9
        shrink-0
        items-center
        justify-center

        overflow-hidden

        rounded-[11px]

        border
        border-black/[0.04]

        bg-[#e8f2ed]

        text-[#006241]
      "
    >
      {business.logo_url &&
      !failed ? (
        <img
          src={
            business.logo_url
          }
          alt={`${business.name} logo`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed(
              true,
            )
          }
          className="
            size-full
            object-cover
          "
        />
      ) : (
        <Store
          className="
            size-4
          "
        />
      )}
    </div>
  );
}

function FieldLabel({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <p
      className="
        text-[10px]
        font-black
        uppercase
        tracking-[0.14em]

        text-black/40
      "
    >
      {children}
    </p>
  );
}

function formatLocation(
  business:
    MemoryBusiness,
) {
  return [
    business.barangay,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatCategory(
  category:
    string,
) {
  return category
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (
        letter,
      ) =>
        letter.toUpperCase(),
    );
}

function getInitials(
  name:
    string,
) {
  return name
    .trim()
    .split(/\s+/)
    .slice(
      0,
      2,
    )
    .map(
      (
        part,
      ) =>
        part.charAt(
          0,
        ),
    )
    .join("")
    .toUpperCase();
}