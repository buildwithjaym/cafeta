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



  /*
    Prevent duplicate views

    Same user
    Same business
    Same event
    Within 30 minutes
  */


  if(
    user &&
    eventType === "profile_view"
  ){


    const thirtyMinutesAgo =
      new Date(
        Date.now() -
        30 * 60 * 1000,
      )
      .toISOString();



    const {
      data:existing,
    } =
    await supabase
    .from(
      "business_analytics_events",
    )
    .select("id")
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
      thirtyMinutesAgo,
    )
    .contains(
      "metadata",
      {
        user_id:
          user.id,
      },
    )
    .maybeSingle();



    if(existing){

      return;

    }

  }




  const {
    error,
  } =
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

      ...metadata,
    },

  });



  if(error){

    console.error(
      "[CAFÉTA ANALYTICS]",
      {
        message:error.message,
        code:error.code,
        details:error.details,
      },
    );

  }

}