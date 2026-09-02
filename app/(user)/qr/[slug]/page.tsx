import { redirect } from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  trackBusinessEvent,
} from "@/lib/analytics/events";

import {
  cookies,
} from "next/headers";

import {
  randomUUID,
} from "crypto";


type Props = {
  params: Promise<{
    slug:string;
  }>;
};


export default async function QRPage({
  params,
}:Props){


  const {
    slug,
  } =
  await params;


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
    "id,slug",
  )
  .eq(
    "slug",
    slug,
  )
  .maybeSingle();



  if(!business){

    redirect("/explore");

  }



  const cookieStore =
    await cookies();


  let visitorId =
    cookieStore.get(
      "cafeta_visitor_id",
    )?.value;



  if(!visitorId){

    visitorId =
      randomUUID();


    cookieStore.set(
      "cafeta_visitor_id",
      visitorId,
      {
        maxAge:
          60 * 60 * 24 * 365,
        httpOnly:true,
      },
    );

  }



  await trackBusinessEvent(
    business.id,
    "qr_scan",
    {
      source:"qr",
      visitor_id:visitorId,
    },
  );



  redirect(
    `/business/${slug}`,
  );

}