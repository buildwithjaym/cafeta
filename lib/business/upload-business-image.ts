import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  BusinessImageKind,
} from "@/lib/business/image-optimizer";

const BUCKET =
  "business-media";

export async function uploadBusinessImage({
  supabase,
  businessId,
  kind,
  file,
}: {
  supabase: SupabaseClient;
  businessId: string;
  kind: BusinessImageKind;
  file: File;
}) {
  const path =
    `${businessId}/${kind}.webp`;

  const {
    error: uploadError,
  } = await supabase.storage
    .from(BUCKET)
    .upload(
      path,
      file,
      {
        contentType:
          "image/webp",

        cacheControl:
          "31536000",

        upsert: true,
      },
    );

  if (uploadError) {
    throw uploadError;
  }

  const {
    data,
  } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    path,
    publicUrl:
      data.publicUrl,
  };
}