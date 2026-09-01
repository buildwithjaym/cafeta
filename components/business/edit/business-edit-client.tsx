"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Clock3,
  Eye,
  LoaderCircle,
  Menu as MenuIcon,
  Save,
  Settings2,
  MapPin,
} from "lucide-react";

import { toast } from "sonner";

import { BusinessLocationEdit } from "./business-location-edit";

import { createClient } from "@/lib/supabase/client";

import { BusinessEditForm, EditProfileSection } from "./edit-profile-section";

import { EditableBusinessHour, EditHoursSection } from "./edit-hours-section";

import {
  EditableMenuCategory,
  EditableMenuItem,
  EditableMenuVariant,
  EditMenuItemModal,
} from "./edit-menu-item-modal";

import { EditMenuSection } from "./edit-menu-section";

type Business = {
  id: string;

  name: string;
  slug: string;

  category: BusinessEditForm["category"];

  description: string | null;

  logo_url: string | null;

  cover_url: string | null;

  phone: string | null;

  email: string | null;

  facebook_url: string | null;

  instagram_url: string | null;

  website_url: string | null;

  address: string;

  barangay: string | null;

  city: string;
  province: string;

  latitude: number;
  longitude: number;
};

type Props = {
  business: Business;

  initialHours: EditableBusinessHour[];

  initialCategories: EditableMenuCategory[];

  initialItems: EditableMenuItem[];
};

type Section = "profile" | "location" | "hours" | "menu";

const EMPTY_ITEM: EditableMenuItem = {
  category_id: null,
  name: "",
  description: "",
  price: "",
  image_url: null,
  is_available: true,
  sort_order: 0,
  variants: [],
};

export function BusinessEditClient({
  business,
  initialHours,
  initialCategories,
  initialItems,
}: Props) {
  const supabase = createClient();

  const [section, setSection] = useState<Section>("profile");

  const [form, setForm] = useState<BusinessEditForm>({
    name: business.name,

    category: business.category,

    description: business.description ?? "",

    phone: business.phone ?? "",

    email: business.email ?? "",

    website_url: business.website_url ?? "",

    facebook_url: business.facebook_url ?? "",

    instagram_url: business.instagram_url ?? "",

    address: business.address,

    barangay: business.barangay ?? "",

    city: business.city,

    province: business.province,

    latitude: String(business.latitude),

    longitude: String(business.longitude),
  });

  const [hours, setHours] = useState<EditableBusinessHour[]>(initialHours);

  const [categories, setCategories] =
    useState<EditableMenuCategory[]>(initialCategories);

  const [items, setItems] = useState<EditableMenuItem[]>(
    initialItems.map((item) => ({
      ...item,
      variants: item.variants ?? [],
    })),
  );

  const [variantsLoaded, setVariantsLoaded] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo_url);

  const [coverUrl, setCoverUrl] = useState<string | null>(business.cover_url);

  const [dirty, setDirty] = useState(false);

  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<EditableMenuItem>(EMPTY_ITEM);

  const [menuImageFile, setMenuImageFile] = useState<File | null>(null);

  const [savingItem, setSavingItem] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadVariants() {
      const itemIds = initialItems
        .map((item) => item.id)
        .filter((id): id is string => Boolean(id));

      if (itemIds.length === 0) {
        setVariantsLoaded(true);
        return;
      }

      const { data, error } = await supabase
        .from("menu_item_variants")
        .select("id, menu_item_id, name, price, is_available, sort_order")
        .in("menu_item_id", itemIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("[CAFÉTA] Failed to load menu variants:", error);
        toast.error("Could not load menu pricing options.");
        setVariantsLoaded(true);
        return;
      }

      const variantsByItem = new Map<string, EditableMenuVariant[]>();

      for (const variant of data ?? []) {
        const current = variantsByItem.get(variant.menu_item_id) ?? [];

        current.push({
          id: variant.id,
          name: variant.name,
          price: String(variant.price),
          is_available: variant.is_available,
          sort_order: variant.sort_order,
        });

        variantsByItem.set(variant.menu_item_id, current);
      }

      setItems((current) =>
        current.map((item) => ({
          ...item,
          variants: item.id ? variantsByItem.get(item.id) ?? [] : [],
        })),
      );

      setVariantsLoaded(true);
    }

    void loadVariants();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateForm<K extends keyof BusinessEditForm>(
    key: K,
    value: BusinessEditForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setDirty(true);
  }

  function updateHours(value: EditableBusinessHour[]) {
    setHours(value);
    setDirty(true);
  }

  function handleLogo(file: File | null) {
    setLogoFile(file);

    if (!file) {
      setLogoUrl(null);
    }

    setDirty(true);
  }

  function handleCover(file: File | null) {
    setCoverFile(file);

    if (!file) {
      setCoverUrl(null);
    }

    setDirty(true);
  }

  async function saveAll() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      let nextLogoUrl = logoUrl;

      let nextCoverUrl = coverUrl;

      if (logoFile) {
        nextLogoUrl = await uploadImage(logoFile, "logo");
      }

      if (coverFile) {
        nextCoverUrl = await uploadImage(coverFile, "cover");
      }

      const latitude = Number(form.latitude);

      const longitude = Number(form.longitude);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new Error("Latitude and longitude must be valid numbers.");
      }

      const { error: businessError } = await supabase
        .from("businesses")
        .update({
          name: form.name.trim(),

          category: form.category,

          description: nullIfEmpty(form.description),

          phone: nullIfEmpty(form.phone),

          email: nullIfEmpty(form.email),

          website_url: normalizeUrl(form.website_url),

          facebook_url: normalizeUrl(form.facebook_url),

          instagram_url: normalizeUrl(form.instagram_url),

          address: form.address.trim(),

          barangay: nullIfEmpty(form.barangay),

          city: form.city.trim(),

          province: form.province.trim(),

          latitude,
          longitude,

          logo_url: nextLogoUrl,

          cover_url: nextCoverUrl,
        })
        .eq("id", business.id);

      if (businessError) {
        throw businessError;
      }

      const { error: hoursError } = await supabase
        .from("business_hours")
        .upsert(
          hours.map((hour) => ({
            business_id: business.id,

            day_of_week: hour.day_of_week,

            opens_at: hour.is_closed ? null : hour.opens_at,

            closes_at: hour.is_closed ? null : hour.closes_at,

            is_closed: hour.is_closed,
          })),
          {
            onConflict: "business_id,day_of_week",
          },
        );

      if (hoursError) {
        throw hoursError;
      }

      setLogoUrl(nextLogoUrl);

      setCoverUrl(nextCoverUrl);

      setLogoFile(null);
      setCoverFile(null);

      setDirty(false);

      toast.success("Business updated.");
    } catch (error) {
      console.error("[CAFÉTA] Update failed:", error);

      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File, type: "logo" | "cover") {
    const path = `${business.id}/${type}.webp`;

    const { error } = await supabase.storage
      .from("business-media")
      .upload(path, file, {
        upsert: true,

        contentType: "image/webp",

        cacheControl: "3600",
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("business-media").getPublicUrl(path);

    return `${data.publicUrl}?v=${Date.now()}`;
  }

  function addItem() {
    setEditingItem({
      ...EMPTY_ITEM,

      category_id: categories[0]?.id ?? null,

      sort_order: items.length,
    });

    setMenuImageFile(null);

    setModalOpen(true);
  }

  function editItem(item: EditableMenuItem) {
    setEditingItem({
      ...item,
      variants: item.variants ?? [],
    });

    setMenuImageFile(null);

    setModalOpen(true);
  }

  async function saveMenuItem() {
    if (!editingItem.name.trim()) {
      toast.error("Enter an item name.");
      return;
    }

    const hasVariants = editingItem.variants.length > 0;

    if (hasVariants) {
      const invalidVariant = editingItem.variants.find(
        (variant) =>
          !variant.name.trim() ||
          variant.price === "" ||
          Number(variant.price) < 0 ||
          Number.isNaN(Number(variant.price)),
      );

      if (invalidVariant) {
        toast.error("Complete every pricing option.");
        return;
      }
    } else {
      const price = Number(editingItem.price);

      if (Number.isNaN(price) || price < 0 || editingItem.price === "") {
        toast.error("Enter a valid price.");
        return;
      }
    }

    setSavingItem(true);

    try {
      let imageUrl = editingItem.image_url;
      const itemId = editingItem.id ?? crypto.randomUUID();

      if (menuImageFile) {
        const path = `${business.id}/menu/${itemId}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("business-media")
          .upload(path, menuImageFile, {
            upsert: true,
            contentType: "image/webp",
            cacheControl: "3600",
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("business-media")
          .getPublicUrl(path);

        imageUrl = `${data.publicUrl}?v=${Date.now()}`;
      }

      const primaryPrice = hasVariants
        ? Number(editingItem.variants[0]?.price ?? 0)
        : Number(editingItem.price);

      const payload = {
        business_id: business.id,
        category_id: editingItem.category_id,
        name: editingItem.name.trim(),
        description: nullIfEmpty(editingItem.description),
        price: primaryPrice,
        image_url: imageUrl,
        is_available: editingItem.is_available,
        sort_order: editingItem.sort_order,
      };

      let savedItem: {
        id: string;
        category_id: string | null;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
        sort_order: number;
      };

      if (editingItem.id) {
        const { data, error } = await supabase
          .from("menu_items")
          .update(payload)
          .eq("id", editingItem.id)
          .eq("business_id", business.id)
          .select(
            `
              id,
              category_id,
              name,
              description,
              price,
              image_url,
              is_available,
              sort_order
            `,
          )
          .single();

        if (error) {
          throw error;
        }

        savedItem = data;
      } else {
        const { data, error } = await supabase
          .from("menu_items")
          .insert({
            id: itemId,
            ...payload,
          })
          .select(
            `
              id,
              category_id,
              name,
              description,
              price,
              image_url,
              is_available,
              sort_order
            `,
          )
          .single();

        if (error) {
          throw error;
        }

        savedItem = data;
      }

      if (hasVariants) {
        const existingVariantIds = editingItem.variants
          .map((variant) => variant.id)
          .filter((id): id is string => Boolean(id));

        if (existingVariantIds.length > 0) {
          const { error: deleteRemovedError } = await supabase
            .from("menu_item_variants")
            .delete()
            .eq("menu_item_id", savedItem.id)
            .not("id", "in", `(${existingVariantIds.join(",")})`);

          if (deleteRemovedError) {
            throw deleteRemovedError;
          }
        } else {
          const { error: deleteAllError } = await supabase
            .from("menu_item_variants")
            .delete()
            .eq("menu_item_id", savedItem.id);

          if (deleteAllError) {
            throw deleteAllError;
          }
        }

        const variantsToUpsert = editingItem.variants.map(
          (variant, index) => ({
            ...(variant.id ? { id: variant.id } : {}),
            menu_item_id: savedItem.id,
            name: variant.name.trim(),
            price: Number(variant.price),
            is_available: variant.is_available,
            sort_order: index,
          }),
        );

        const { data: savedVariants, error: variantsError } = await supabase
          .from("menu_item_variants")
          .upsert(variantsToUpsert, {
            onConflict: "id",
          })
          .select(
            "id, name, price, is_available, sort_order",
          );

        if (variantsError) {
          throw variantsError;
        }

        const normalizedVariants: EditableMenuVariant[] = (
          savedVariants ?? []
        )
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((variant) => ({
            id: variant.id,
            name: variant.name,
            price: String(variant.price),
            is_available: variant.is_available,
            sort_order: variant.sort_order,
          }));

        const nextItem: EditableMenuItem = {
          ...savedItem,
          description: savedItem.description ?? "",
          price: String(savedItem.price),
          variants: normalizedVariants,
        };

        setItems((current) =>
          editingItem.id
            ? current.map((item) =>
                item.id === savedItem.id ? nextItem : item,
              )
            : [...current, nextItem],
        );
      } else {
        const { error: deleteVariantsError } = await supabase
          .from("menu_item_variants")
          .delete()
          .eq("menu_item_id", savedItem.id);

        if (deleteVariantsError) {
          throw deleteVariantsError;
        }

        const nextItem: EditableMenuItem = {
          ...savedItem,
          description: savedItem.description ?? "",
          price: String(savedItem.price),
          variants: [],
        };

        setItems((current) =>
          editingItem.id
            ? current.map((item) =>
                item.id === savedItem.id ? nextItem : item,
              )
            : [...current, nextItem],
        );
      }

      setModalOpen(false);
      setMenuImageFile(null);

      toast.success(
        editingItem.id
          ? "Menu item updated."
          : "Menu item added.",
      );
    } catch (error) {
      console.error("[CAFÉTA] Menu item save failed:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setSavingItem(false);
    }
  }

  async function deleteItem(item: EditableMenuItem) {
    if (!item.id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", item.id)
      .eq("business_id", business.id);

    if (error) {
      toast.error(error.message);

      return;
    }

    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== item.id),
    );

    toast.success("Menu item deleted.");
  }

  async function addCategory() {
    const name = window.prompt("Category name");

    if (!name?.trim()) {
      return;
    }

    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        business_id: business.id,

        name: name.trim(),

        sort_order: categories.length,
      })
      .select(
        `
          id,
          name,
          sort_order
        `,
      )
      .single();

    if (error) {
      toast.error(error.message);

      return;
    }

    setCategories((current) => [...current, data]);

    toast.success("Category added.");
  }

  async function editCategory(category: EditableMenuCategory) {
    const name = window.prompt("Category name", category.name);

    if (!name?.trim() || name.trim() === category.name) {
      return;
    }

    const { error } = await supabase
      .from("menu_categories")
      .update({
        name: name.trim(),
      })
      .eq("id", category.id)
      .eq("business_id", business.id);

    if (error) {
      toast.error(error.message);

      return;
    }

    setCategories((current) =>
      current.map((currentCategory) =>
        currentCategory.id === category.id
          ? {
              ...currentCategory,

              name: name.trim(),
            }
          : currentCategory,
      ),
    );
  }

  async function deleteCategory(category: EditableMenuCategory) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Items will remain but become uncategorized.`,
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", category.id)
      .eq("business_id", business.id);

    if (error) {
      toast.error(error.message);

      return;
    }

    setCategories((current) =>
      current.filter((currentCategory) => currentCategory.id !== category.id),
    );

    setItems((current) =>
      current.map((item) =>
        item.category_id === category.id
          ? {
              ...item,
              category_id: null,
            }
          : item,
      ),
    );

    toast.success("Category deleted.");
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#f3f5f3]
        pb-28
      "
    >
      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-black/[0.055]
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[68px]
            max-w-[1180px]
            items-center
            gap-3
            px-4
            sm:px-6
          "
        >
          <Link
            href={`/business/${business.slug}`}
            className="
              flex
              size-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-black/[0.035]
              text-[#39433e]
              transition
              hover:bg-[#e8f2ed]
              hover:text-[#006241]
            "
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                truncate
                text-[13px]
                font-black
                text-[#17211c]
              "
            >
              Edit {business.name}
            </p>

            <div
              className="
                mt-0.5
                flex
                items-center
                gap-1.5
              "
            >
              {dirty ? (
                <>
                  <span
                    className="
                      size-1.5
                      rounded-full
                      bg-amber-500
                      animate-pulse
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-black/35
                    "
                  >
                    Unsaved changes
                  </span>
                </>
              ) : (
                <>
                  <Check className="size-3 text-[#006241]" />

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-[#006241]
                    "
                  >
                    All changes saved
                  </span>
                </>
              )}
            </div>
          </div>

          <Link
            href={`/business/${business.slug}`}
            target="_blank"
            className="
              hidden
              h-9
              items-center
              gap-1.5
              rounded-full
              border
              border-black/[0.07]
              px-4
              text-[9px]
              font-bold
              text-[#39433e]
              transition
              hover:border-[#006241]/15
              hover:text-[#006241]
              sm:inline-flex
            "
          >
            <Eye className="size-3.5" />
            View profile
          </Link>

          <button
            type="button"
            onClick={() => void saveAll()}
            disabled={saving || !dirty}
            className="
              inline-flex
              h-9
              min-w-[95px]
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-[#006241]
              px-4
              text-[9px]
              font-bold
              text-white
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#00754a]
              disabled:pointer-events-none
              disabled:opacity-45
            "
          >
            {saving ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}

            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </header>

      <div
        className="
          mx-auto
          grid
          max-w-[1180px]
          gap-5
          px-4
          py-5
          sm:px-6
          lg:grid-cols-[220px_minmax(0,1fr)]
        "
      >
        <aside
          className="
            lg:sticky
            lg:top-[88px]
            lg:self-start
          "
        >
          <div
            className="
              flex
              gap-1
              overflow-x-auto
              rounded-[16px]
              border
              border-black/[0.055]
              bg-white
              p-1.5
              shadow-sm
              lg:block
              lg:space-y-1
            "
          >
            <NavButton
              active={section === "profile"}
              icon={<Settings2 className="size-4" />}
              onClick={() => setSection("profile")}
            >
              Profile
            </NavButton>

            <NavButton
              active={section === "location"}
              icon={<MapPin className="size-4" />}
              onClick={() => setSection("location")}
            >
              Location
            </NavButton>

            <NavButton
              active={section === "hours"}
              icon={<Clock3 className="size-4" />}
              onClick={() => setSection("hours")}
            >
              Hours
            </NavButton>

            <NavButton
              active={section === "menu"}
              icon={<MenuIcon className="size-4" />}
              onClick={() => setSection("menu")}
            >
              Menu
            </NavButton>
          </div>
        </aside>

        <div
          key={section}
          className="
            min-w-0
            animate-in
            fade-in
            slide-in-from-bottom-1
            duration-300
          "
        >
          {section === "profile" && (
            <EditProfileSection
              form={form}
              logoUrl={logoUrl}
              coverUrl={coverUrl}
              onChange={updateForm}
              onLogoChange={handleLogo}
              onCoverChange={handleCover}
            />
          )}

          {section === "hours" && (
            <EditHoursSection hours={hours} onChange={updateHours} />
          )}

          {section === "menu" && !variantsLoaded && (
            <div className="flex min-h-[240px] items-center justify-center rounded-[22px] border border-black/[0.055] bg-white">
              <div className="flex items-center gap-2 text-[10px] font-bold text-black/35">
                <LoaderCircle className="size-4 animate-spin text-[#006241]" />
                Loading menu pricing...
              </div>
            </div>
          )}

          {section === "menu" && variantsLoaded && (
            <EditMenuSection
              categories={categories}
              items={items}
              onAddCategory={addCategory}
              onEditCategory={editCategory}
              onDeleteCategory={deleteCategory}
              onAddItem={addItem}
              onEditItem={editItem}
              onDeleteItem={deleteItem}
            />
          )}

          {section === "location" && (
            <BusinessLocationEdit
              data={{
                address: form.address,
                barangay: form.barangay,
                city: form.city,
                province: form.province,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
              }}
              onChange={(values) => {
                if (values.address !== undefined) {
                  updateForm("address", values.address);
                }

                if (values.barangay !== undefined) {
                  updateForm("barangay", values.barangay ?? "");
                }

                if (values.city !== undefined) {
                  updateForm("city", values.city);
                }

                if (values.province !== undefined) {
                  updateForm("province", values.province);
                }

                if (values.latitude !== undefined) {
                  updateForm("latitude", String(values.latitude));
                }

                if (values.longitude !== undefined) {
                  updateForm("longitude", String(values.longitude));
                }
              }}
            />
          )}
        </div>
      </div>

      <EditMenuItemModal
        open={modalOpen}
        item={editingItem}
        categories={categories}
        saving={savingItem}
        onChange={setEditingItem}
        onImageChange={setMenuImageFile}
        onClose={() => setModalOpen(false)}
        onSave={() => void saveMenuItem()}
      />
    </main>
  );
}

function NavButton({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;

  icon: React.ReactNode;

  onClick: () => void;

  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-10
        shrink-0
        items-center
        gap-2
        rounded-[11px]
        px-3
        text-[10px]
        font-bold
        transition-all
        duration-200
        lg:w-full

        ${
          active
            ? "bg-[#e8f2ed] text-[#006241]"
            : "text-black/40 hover:bg-black/[0.025] hover:text-[#17211c]"
        }
      `}
    >
      {icon}

      {children}
    </button>
  );
}

function nullIfEmpty(value: string) {
  const result = value.trim();

  return result || null;
}

function normalizeUrl(value: string) {
  const result = value.trim();

  if (!result) {
    return null;
  }

  if (/^https?:\/\//i.test(result)) {
    return result;
  }

  return `https://${result}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Something went wrong.";
}
