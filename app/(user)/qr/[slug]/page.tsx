import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  trackBusinessEvent,
} from "@/lib/analytics/events";


type Props = {
  params: Promise<{
    slug:string;
  }>;
};


export default async function QRPage({
  params,
}:Props){

  noStore();


  const {
    slug,
  } = await params;


  const supabase =
    await createClient();


  const {
    data:business,
  } =
  await supabase
  .from(
    "businesses",
  )
  .select(
    "id, slug",
  )
  .eq(
    "slug",
    slug,
  )
  .maybeSingle();


  if(!business){

    redirect("/explore");

  }


  await trackBusinessEvent(
    business.id,
    "qr_scan",
    {
      source:"qr",
    },
  );


  redirect(
    `/business/${business.slug}`,
  );

}