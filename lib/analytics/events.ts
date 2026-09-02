import {
  createClient,
} from "@/lib/supabase/server";


type EventType =
  | "profile_view"
  | "qr_scan"
  | "menu_view"
  | "direction_click"
  | "phone_click"
  | "website_click"
  | "share_click";


export async function trackBusinessEvent(
  businessId:string,
  eventType:EventType,
  metadata?:Record<string,any>,
){


  const supabase =
    await createClient();



  const {
    data:{
      user,
    },
  } =
  await supabase.auth.getUser();



  if(user){

    const {
      data:business,
    } =
    await supabase
    .from(
      "businesses",
    )
    .select(
      "created_by",
    )
    .eq(
      "id",
      businessId,
    )
    .maybeSingle();



    if(
      business?.created_by === user.id
    ){

      return;

    }

  }



  const visitorId =
    metadata?.visitor_id ??
    user?.id ??
    null;



  if(visitorId){


    const limit =
      new Date(
        Date.now() -
        15 * 60 * 1000,
      )
      .toISOString();



    const {
      data:existing,
    } =
    await supabase
    .from(
      "business_analytics_events",
    )
    .select(
      "id",
    )
    .eq(
      "business_id",
      businessId,
    )
    .eq(
      "event_type",
      eventType,
    )
    .gte(
      "created_at",
      limit,
    )
    .contains(
      "metadata",
      {
        visitor_id:visitorId,
      },
    )
    .maybeSingle();



    if(existing){

      return;

    }

  }



  await supabase
  .from(
    "business_analytics_events",
  )
  .insert({

    business_id:
      businessId,

    event_type:
      eventType,


    metadata:{

      user_id:
        user?.id ??
        null,

      visitor_id:
        visitorId,

      ...metadata,

    },

  });

}