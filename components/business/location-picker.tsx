"use client";

import {
  useRef,
  useState,
} from "react";

import Map, {
  Marker,
  NavigationControl,
} from "react-map-gl/maplibre";

import {
  LocateFixed,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  CAFETA_MAP_STYLE,
  BASILAN_CENTER,
} from "@/lib/map/config";

import {
  searchLocation,
} from "@/lib/location/geocode";

import type {
  LocationSearchResult,
} from "@/lib/location/types";


type Props = {
  latitude:number | null;

  longitude:number | null;

  onChange:(value:{
    latitude:number;
    longitude:number;
    accuracy?:number;
  })=>void;
};


export function LocationPicker({
  latitude,
  longitude,
  onChange,
}:Props){


const mapRef =
useRef<any>(null);



const [query,setQuery] =
useState("");

const [results,setResults] =
useState<LocationSearchResult[]>([]);

const [loading,setLoading] =
useState(false);



const current = {

latitude:
latitude ?? BASILAN_CENTER[1],

longitude:
longitude ?? BASILAN_CENTER[0],

};



function moveMap(
lat:number,
lng:number,
){

mapRef.current?.flyTo({

center:[
lng,
lat,
],

zoom:17,

duration:1200,

});

}



async function handleSearch(){

if(!query.trim()){
return;
}


setLoading(true);


try{


const data =
await searchLocation(query);


setResults(data);


if(data.length===0){

toast.info(
"No location found",
{
description:
"Try a landmark, street, or nearby business."
}
);

}


}catch{


toast.error(
"Location search failed"
);


}finally{

setLoading(false);

}

}




function selectResult(
item:LocationSearchResult
){

onChange({

latitude:item.latitude,

longitude:item.longitude,

});


moveMap(
item.latitude,
item.longitude,
);


setQuery(
item.displayName
);


setResults([]);

}




function useGPS(){


if(!navigator.geolocation){

toast.error(
"GPS unavailable"
);

return;

}



const toastId =
toast.loading(
"Finding your location..."
);



navigator.geolocation.getCurrentPosition(

(position)=>{


const lat =
position.coords.latitude;


const lng =
position.coords.longitude;



onChange({

latitude:lat,

longitude:lng,

accuracy:
position.coords.accuracy,

});


moveMap(
lat,
lng,
);


toast.success(
"Location detected",
{
id:toastId,
description:
"Move the pin if you need to adjust it."
}
);



},

()=>{


toast.error(
"Unable to access GPS",
{
id:toastId,
}
);


},

{
enableHighAccuracy:true,
timeout:10000,
}

);


}




return (

<div className="space-y-5">


<div>

<p className="
text-xs
font-black
text-[#26322b]
">

Find your business location

</p>


<p className="
mt-1
text-xs
text-black/40
">

Search first or place the pin manually.

</p>


<div className="
mt-3
flex
gap-2
">


<div className="
relative
flex-1
">


<Search
className="
absolute
left-4
top-1/2
size-4
-translate-y-1/2
text-black/30
"
/>


<input

value={query}

onChange={(e)=>
setQuery(e.target.value)
}

onKeyDown={(e)=>{

if(e.key==="Enter"){

e.preventDefault();

handleSearch();

}

}}

placeholder="
Example: Brew Cafe Basilan
"

className="
h-12
w-full
rounded-full
border
border-black/[0.08]
bg-white
pl-11
pr-4
text-sm
outline-none
focus:border-[#006241]/40
"

/>


</div>



<button

type="button"

onClick={handleSearch}

className="
h-12
rounded-full
bg-[#006241]
px-6
text-sm
font-black
text-white
"

>

{
loading
?
<LoaderCircle className="
size-4
animate-spin
"/>
:
"Search"
}

</button>


</div>



{
results.length > 0 && (

<div className="
mt-3
overflow-hidden
rounded-2xl
border
bg-white
shadow-xl
">


{
results.map((item)=>(

<button

key={
`${item.latitude}-${item.longitude}`
}

type="button"

onClick={()=>
selectResult(item)
}

className="
block
w-full
border-b
px-4
py-3
text-left
hover:bg-[#f3f8f5]
"

>

<p className="
text-sm
font-bold
text-[#17211c]
">

{item.name}

</p>


<p className="
mt-1
text-xs
text-black/40
">

{item.displayName}

</p>


</button>

))

}


</div>

)

}



</div>




<div
className="
relative
h-[360px]
w-full
overflow-hidden
rounded-[26px]
border
border-black/[0.08]
"
>


<Map

ref={mapRef}

initialViewState={{

latitude:
current.latitude,

longitude:
current.longitude,

zoom:14,

}}

mapStyle={CAFETA_MAP_STYLE}

style={{

width:"100%",

height:"100%",

}}


onClick={(event)=>{


onChange({

latitude:
event.lngLat.lat,

longitude:
event.lngLat.lng,

});


}}


>


<Marker

latitude={
current.latitude
}

longitude={
current.longitude
}

draggable


onDragEnd={(event)=>{


onChange({

latitude:
event.lngLat.lat,

longitude:
event.lngLat.lng,

});


}}

>


<div className="
flex
size-12
items-center
justify-center
rounded-full
bg-[#006241]
text-white
shadow-xl
">

<MapPin
className="
size-6
"
/>

</div>


</Marker>



<NavigationControl/>

</Map>


<div className="
absolute
bottom-4
left-4
rounded-xl
bg-white/95
px-4
py-3
shadow-lg
backdrop-blur
">

<p className="
text-xs
font-black
text-[#006241]
">

Drag pin to exact entrance

</p>


<p className="
mt-1
text-[11px]
text-black/40
">

Customers will use this location.

</p>


</div>


</div>



<button

type="button"

onClick={useGPS}

className="
flex
h-11
items-center
gap-2
rounded-full
bg-[#edf5f1]
px-5
text-sm
font-black
text-[#006241]
"

>

<LocateFixed
className="
size-4
"
/>

Use my location

</button>



</div>

);

}