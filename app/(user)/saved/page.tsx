import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  SavedPageClient,
} from "@/components/saved/saved-page-client";

import type {
  SavedBusiness,
} from "@/components/saved/saved-page-client";

import {
  createClient,
} from "@/lib/supabase/server";


export const metadata: Metadata = {
  title:
    "Saved Places",

  description:
    "View and manage your saved cafés, coffee shops, milk-tea shops, and local favorites on CAFÉTA.",
};



type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};



const PAGE_SIZE = 12;



export default async function SavedPage({
  searchParams,
}:Props){


  const {
    page = "1",
  } =
  await searchParams;



  const parsedPage =
    Number(page);



  const currentPage =
  Number.isFinite(parsedPage) &&
  parsedPage > 0
    ? Math.floor(parsedPage)
    : 1;



  const from =
    (
      currentPage - 1
    )
    *
    PAGE_SIZE;



  const to =
    from +
    PAGE_SIZE -
    1;



  const supabase =
    await createClient();



  const {
    data:{
      user,
    },
    error:
      authError,
  } =
  await supabase.auth.getUser();



  if(
    authError ||
    !user
  ){

    redirect(
      "/auth/login?next=/saved",
    );

  }



  const {
    data,
    error,
    count,
  } =
  await supabase
  .from(
    "saved_businesses",
  )
  .select(
    `
      id,
      created_at,

      business:businesses(
        id,
        name,
        slug,
        category,
        description,

        logo_url,
        cover_url,

        address,
        barangay,
        city,
        province,

        latitude,
        longitude,

        is_verified
      )
    `,
    {
      count:
        "exact",
    },
  )
  .eq(
    "user_id",
    user.id,
  )
  .order(
    "created_at",
    {
      ascending:false,
    },
  )
  .range(
    from,
    to,
  );



  const totalItems =
    count ?? 0;



  const totalPages =
    Math.ceil(
      totalItems /
      PAGE_SIZE,
    );



  if(error){

    console.error(
      "[CAFÉTA] Failed to load saved businesses:",
      {
        code:
          error.code,

        message:
          error.message,

        details:
          error.details,

        hint:
          error.hint,
      },
    );


    return (
      <SavedPageClient

        initialSaved={[]}

        hasError

        pagination={{
          currentPage,

          totalPages:0,

          totalItems:0,
        }}

      />
    );

  }



  const savedBusinesses:
    SavedBusiness[] =
    [];



  for(
    const item of
    data ?? []
  ){


    const business =
      Array.isArray(
        item.business,
      )
        ? item.business[0]
        : item.business;



    if(!business){

      continue;

    }



    savedBusinesses.push({

      savedId:
        item.id,


      savedAt:
        item.created_at,



      business:{

        id:
          business.id,


        name:
          business.name,


        slug:
          business.slug,


        category:
          business.category as SavedBusiness["business"]["category"],


        description:
          business.description,


        logo_url:
          business.logo_url,


        cover_url:
          business.cover_url,


        address:
          business.address,


        barangay:
          business.barangay,


        city:
          business.city,


        province:
          business.province,


        latitude:
          Number(
            business.latitude,
          ),


        longitude:
          Number(
            business.longitude,
          ),


        is_verified:
          business.is_verified,

      },

    });


  }




  return (

    <SavedPageClient

      initialSaved={
        savedBusinesses
      }


      pagination={{

        currentPage,

        totalPages,

        totalItems,

      }}

    />

  );

}