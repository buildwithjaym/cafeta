import type {
  LocationSearchResult,
  ReverseLocationResult,
} from "./types";



const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org";



async function locationRequest(
  url:string,
){

  const response =
    await fetch(
      url,
      {
        headers:{
          "Accept-Language":"en",
        },

        next:{
          revalidate:0,
        },
      },
    );


  if(!response.ok){

    throw new Error(
      "Location service unavailable",
    );

  }


  return response.json();

}



/**
 * Search places by text
 *
 * Example:
 * Brew Cafe Basilan
 * Isabela City
 * Cabunbata
 */
export async function searchLocation(
  query:string,
):Promise<LocationSearchResult[]>{


  if(!query.trim()){

    return [];

  }



  const params =
    new URLSearchParams({

      format:"json",

      addressdetails:"1",

      limit:"5",

      countrycodes:"ph",

      q:query,

    });



  try{


    const data =
      await locationRequest(
        `${NOMINATIM_URL}/search?${params.toString()}`
      );



    return data.map(
      (item:any)=>({

        name:
          item.name ||
          item.display_name,


        displayName:
          item.display_name,


        latitude:
          Number(item.lat),


        longitude:
          Number(item.lon),


      }),
    );


  }catch(error){


    console.error(
      "[CAFÉTA] Location search failed:",
      error,
    );


    return [];

  }

}





/**
 * Convert coordinates back into address
 *
 * Used when user drags the map marker.
 */
export async function reverseGeocode(
 latitude:number,
 longitude:number,
):Promise<ReverseLocationResult|null>{


 try{


 const params =
  new URLSearchParams({

    format:"json",

    addressdetails:"1",

    lat:String(latitude),

    lon:String(longitude),

  });



 const data =
   await locationRequest(
    `${NOMINATIM_URL}/reverse?${params.toString()}`
   );



 const address =
   data.address ?? {};



 return {

   displayName:
    data.display_name,


   address:
    data.display_name,


   barangay:
    address.village ??
    address.suburb ??
    address.neighbourhood ??
    null,


   city:
    address.city ??
    address.town ??
    address.municipality ??
    null,


   province:
    address.state ??
    null,


   latitude,

   longitude,

 };


 }catch(error){


 console.error(
 "[CAFÉTA] Reverse geocode failed:",
 error,
 );


 return null;


 }

}