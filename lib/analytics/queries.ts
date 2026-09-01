import {
  createClient,
} from "@/lib/supabase/server";

import type {
  BusinessAnalyticsSummary,
} from "./types";



type BusinessDashboardAccess = {

  role:
    | "owner"
    | "manager";

  business:{
    id:string;

    name:string;

    slug:string;
  };

};





export async function getBusinessDashboardAccess(
  slug:string,
)
:Promise<BusinessDashboardAccess | null>{


  const supabase =
    await createClient();



  const {
    data:{
      user,
    },
  } =
  await supabase.auth.getUser();



  if(
    !user
  ){

    return null;

  }



  const {
    data:
      business,
    error:
      businessError,
  } =
  await supabase
  .from(
    "businesses",
  )
  .select(
    `
      id,
      name,
      slug,
      created_by
    `,
  )
  .eq(
    "slug",
    slug,
  )
  .maybeSingle();



  if(
    businessError ||
    !business
  ){

    console.error(
      "[CAFÉTA DASHBOARD ACCESS]",
      businessError,
    );


    return null;

  }





  const {
    data:
      membership,
  } =
  await supabase
  .from(
    "business_members",
  )
  .select(
    "role",
  )
  .eq(
    "business_id",
    business.id,
  )
  .eq(
    "user_id",
    user.id,
  )
  .maybeSingle();




  let role:
    "owner"
    |
    "manager"
    |
    null = null;



  if(
    business.created_by ===
    user.id
  ){

    role =
      "owner";

  }



  else if(
    membership?.role ===
    "owner"
  ){

    role =
      "owner";

  }



  else if(
    membership?.role ===
    "manager"
  ){

    role =
      "manager";

  }



  if(
    !role
  ){

    return null;

  }




  return {

    role,


    business:{

      id:
        business.id,


      name:
        business.name,


      slug:
        business.slug,

    },

  };


}









export async function getBusinessAnalyticsSummary(
  businessId:string,
)
:Promise<BusinessAnalyticsSummary>{


  const supabase =
    await createClient();



  const now =
    new Date();



  const currentStart =
    new Date(
      now,
    );


  currentStart.setDate(
    currentStart.getDate() - 30,
  );



  const previousStart =
    new Date(
      currentStart,
    );


  previousStart.setDate(
    previousStart.getDate() - 30,
  );





  const {
    data,
    error,
  } =
  await supabase
  .from(
    "business_analytics_events",
  )
  .select(
    `
      event_type,
      created_at,
      metadata
    `,
  )
  .eq(
    "business_id",
    businessId,
  )
  .gte(
    "created_at",
    previousStart.toISOString(),
  );




  if(error){

    console.error(
      "[CAFÉTA ANALYTICS QUERY]",
      error,
    );


    throw error;

  }




  const events =
    data ?? [];





  function countEvents(
    type:string,
    start:Date,
    end?:Date,
  ){


    return events.filter(
      (event)=>{


        const created =
          new Date(
            event.created_at,
          );



        return (

          event.event_type === type

          &&

          created >= start

          &&

          (
            !end ||
            created < end
          )

        );


      },
    ).length;


  }







  function calculateGrowth(
    current:number,
    previous:number,
  ){


    if(
      previous === 0
    ){

      return current > 0
        ? 100
        : 0;

    }



    return Math.round(

      (
        (
          current -
          previous
        )
        /
        previous
      )

      *
      100

    );


  }







  const views =
    countEvents(
      "profile_view",
      currentStart,
    );


  const qrScans =
    countEvents(
      "qr_scan",
      currentStart,
    );


  const menuViews =
    countEvents(
      "menu_view",
      currentStart,
    );


  const directions =
    countEvents(
      "direction_click",
      currentStart,
    );






  const previousViews =
    countEvents(
      "profile_view",
      previousStart,
      currentStart,
    );


  const previousQr =
    countEvents(
      "qr_scan",
      previousStart,
      currentStart,
    );


  const previousMenu =
    countEvents(
      "menu_view",
      previousStart,
      currentStart,
    );


  const previousDirections =
    countEvents(
      "direction_click",
      previousStart,
      currentStart,
    );








  const dailyMap =
    new Map<string,number>();



  events
  .filter(
    event =>
      event.event_type ===
      "profile_view",
  )
  .forEach(
    event=>{


      const date =
        new Date(
          event.created_at,
        )
        .toLocaleDateString(
          "en-US",
          {
            month:"short",
            day:"numeric",
          },
        );



      dailyMap.set(
        date,
        (
          dailyMap.get(date)
          ??
          0
        )
        +
        1,
      );


    },
  );





  const daily_views =
    Array
    .from(
      dailyMap.entries(),
    )
    .map(
      ([
        date,
        views,
      ])=>({

        date,

        views,

      }),
    );









  return {


    views,


    qr_scans:
      qrScans,


    menu_views:
      menuViews,


    direction_clicks:
      directions,





    previous_views:
      previousViews,


    previous_qr_scans:
      previousQr,


    previous_menu_views:
      previousMenu,


    previous_direction_clicks:
      previousDirections,





    growth:{


      views:
        calculateGrowth(
          views,
          previousViews,
        ),



      qr_scans:
        calculateGrowth(
          qrScans,
          previousQr,
        ),



      menu_views:
        calculateGrowth(
          menuViews,
          previousMenu,
        ),



      directions:
        calculateGrowth(
          directions,
          previousDirections,
        ),


    },






    action_distribution:[


      {
        name:"Views",

        value:
          views,
      },


      {
        name:"Menu",

        value:
          menuViews,
      },


      {
        name:"QR",

        value:
          qrScans,
      },


      {
        name:"Directions",

        value:
          directions,
      },


    ],






    daily_views,






    funnel:{


      profile_views:
        views,


      menu_views:
        menuViews,


      directions,

    },


  };


}