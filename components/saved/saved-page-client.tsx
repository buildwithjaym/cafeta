"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  CupSoda,
  Search,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  SavedBusinessCard,
} from "@/components/saved/saved-business-card";

import {
  SavedEmptyState,
} from "@/components/saved/saved-empty-state";

import {
  createClient,
} from "@/lib/supabase/client";


export type SavedBusinessCategory =
  | "coffee_shop"
  | "cafe"
  | "milk_tea"
  | "bakery_cafe"
  | "restaurant_cafe"
  | "other";


export type SavedBusiness = {

  savedId:string;

  savedAt:string;

  business:{
    id:string;

    name:string;

    slug:string;

    category:SavedBusinessCategory;

    description:string | null;

    logo_url:string | null;

    cover_url:string | null;

    address:string;

    barangay:string | null;

    city:string;

    province:string;

    latitude:number;

    longitude:number;

    is_verified:boolean;
  };

};



type Props = {

  initialSaved:SavedBusiness[];

  hasError?:boolean;


  pagination:{
    currentPage:number;

    totalPages:number;

    totalItems:number;
  };

};



type Filter =
  | "all"
  | "coffee"
  | "milk-tea";



const FILTERS = [
  {
    value:"all" as Filter,
    label:"All",
    icon:Coffee,
  },

  {
    value:"coffee" as Filter,
    label:"Coffee",
    icon:Coffee,
  },

  {
    value:"milk-tea" as Filter,
    label:"Milk Tea",
    icon:CupSoda,
  },
];



const COFFEE_CATEGORIES:
SavedBusinessCategory[] = [
  "coffee_shop",
  "cafe",
  "bakery_cafe",
  "restaurant_cafe",
];



export function SavedPageClient({
  initialSaved,
  hasError=false,
  pagination,
}:Props){


  const router =
    useRouter();



  const [
    saved,
    setSaved,
  ] =
  useState(
    initialSaved,
  );



  const [
    search,
    setSearch,
  ] =
  useState("");



  const [
    filter,
    setFilter,
  ] =
  useState<Filter>(
    "all",
  );



  const [
    removingId,
    setRemovingId,
  ] =
  useState<string | null>(
    null,
  );




  const visibleSaved =
    useMemo(()=>{

      const query =
        search
          .trim()
          .toLowerCase();



      return saved.filter(
        (item)=>{


          const business =
            item.business;



          const matchesSearch =
            !query ||
            [
              business.name,
              business.address,
              business.barangay,
              business.city,
              business.province,
            ]
            .filter(Boolean)
            .some(
              value =>
                value!
                .toLowerCase()
                .includes(query),
            );



          if(!matchesSearch){
            return false;
          }



          if(filter==="coffee"){

            return COFFEE_CATEGORIES.includes(
              business.category,
            );

          }



          if(filter==="milk-tea"){

            return (
              business.category ===
              "milk_tea"
            );

          }



          return true;

        },
      );

    },[
      saved,
      search,
      filter,
    ]);





  async function handleRemove(
    item:SavedBusiness,
  ){


    if(removingId){
      return;
    }



    setRemovingId(
      item.savedId,
    );



    const previous =
      saved;



    setSaved(
      current =>
        current.filter(
          savedItem =>
            savedItem.savedId !==
            item.savedId,
        ),
    );



    try{


      const supabase =
        createClient();



      const {
        error,
      } =
      await supabase
      .from(
        "saved_businesses",
      )
      .delete()
      .eq(
        "id",
        item.savedId,
      );



      if(error){
        throw error;
      }



      toast.success(
        "Removed from saved",
      );


    }
    catch(error){


      setSaved(
        previous,
      );


      toast.error(
        "Couldn't remove saved place",
      );


      console.error(
        error,
      );


    }
    finally{

      setRemovingId(
        null,
      );

    }


  }





  if(hasError){

    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-[#f7f8f6] px-5">

        <div className="text-center">

          <Coffee className="mx-auto size-10 text-[#006241]" />

          <h1 className="mt-5 text-xl font-black text-[#17211c]">
            Saved places unavailable
          </h1>

          <button
            onClick={()=>{
              window.location.reload();
            }}
            className="mt-5 rounded-full bg-[#006241] px-5 py-2 text-xs font-bold text-white"
          >
            Try again
          </button>

        </div>

      </main>
    );

  }





  return (

    <main className="min-h-[calc(100dvh-72px)] bg-[#f7f8f6] pb-28">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#006241]">
              Your collection
            </p>


            <h1 className="mt-2 text-[2rem] font-black tracking-[-0.055em] text-[#17211c]">
              Saved places
            </h1>


            <p className="mt-2 text-sm text-black/45">
              Keep your favorite CAFÉTA places.
            </p>

          </div>



          <p className="text-sm text-black/40">

            <span className="font-bold text-[#17211c]">
              {
                pagination.totalItems
              }
            </span>

            {" "}

            saved

          </p>


        </header>





        <section className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="relative w-full lg:max-w-md">

            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30"/>


            <input
              value={search}
              onChange={(e)=>
                setSearch(
                  e.target.value,
                )
              }
              placeholder="Search saved places..."
              className="h-12 w-full rounded-full border border-black/[0.07] bg-white pl-11 pr-11 text-sm outline-none"
            />


            {
              search && (
                <button
                  onClick={()=>
                    setSearch("")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="size-4"/>
                </button>
              )
            }


          </div>



          <div className="flex gap-2">

            {
              FILTERS.map(
                item=>{

                  const Icon =
                    item.icon;


                  return (

                    <button
                      key={
                        item.value
                      }
                      onClick={()=>
                        setFilter(
                          item.value,
                        )
                      }
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                        filter===item.value
                        ?
                        "bg-[#006241] text-white"
                        :
                        "bg-white text-black/50"
                      }`}
                    >

                      <Icon className="size-3.5"/>

                      {
                        item.label
                      }

                    </button>

                  );

                },
              )
            }

          </div>


        </section>





        {
          visibleSaved.length === 0
          ?
          <SavedEmptyState/>
          :
          <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


            {
              visibleSaved.map(
                item=>(
                  <SavedBusinessCard

                    key={
                      item.savedId
                    }

                    item={
                      item
                    }

                    removing={
                      removingId ===
                      item.savedId
                    }

                    onRemove={()=>
                      void handleRemove(
                        item,
                      )
                    }

                  />
                ),
              )
            }


          </section>
        }




{
  pagination.totalPages > 1 && (

    <div className="mt-12 flex items-center justify-center gap-2">


      <button
        disabled={
          pagination.currentPage === 1
        }
        onClick={() =>
          router.push(
            `/saved?page=${pagination.currentPage - 1}`,
          )
        }
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-full
          bg-white
          text-black/50
          transition
          hover:bg-[#006241]/10
          disabled:opacity-30
        "
      >

        <ChevronLeft className="size-4"/>

      </button>



      {
        Array.from(
          {
            length:
              pagination.totalPages,
          },
        )
        .map(
          (_,index)=>{

            const page =
              index + 1;


            return (

              <button
                key={
                  page
                }

                onClick={() =>
                  router.push(
                    `/saved?page=${page}`,
                  )
                }

                className={`
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-black
                  transition

                  ${
                    pagination.currentPage === page
                    ?
                    "bg-[#006241] text-white"
                    :
                    "bg-white text-black/50 hover:bg-[#006241]/10"
                  }
                `}
              >

                {
                  page
                }

              </button>

            );

          },
        )
      }



      <button
        disabled={
          pagination.currentPage === pagination.totalPages
        }

        onClick={() =>
          router.push(
            `/saved?page=${pagination.currentPage + 1}`,
          )
        }

        className="
          flex
          size-10
          items-center
          justify-center
          rounded-full
          bg-white
          text-black/50
          transition
          hover:bg-[#006241]/10
          disabled:opacity-30
        "
      >

        <ChevronRight className="size-4"/>

      </button>


    </div>

  )
}


      </div>

    </main>

  );

}