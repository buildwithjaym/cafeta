"use client";

import {
  MapPinCheck,
  Sparkles,
} from "lucide-react";

import {
  LocationPicker,
} from "@/components/business/location-picker";

import type {
  BusinessFormData,
} from "@/lib/business/types";


type Props = {
  data: BusinessFormData;

  updateData: (
    values: Partial<BusinessFormData>,
  ) => void;
};



export function LocationStep({
  data,
  updateData,
}: Props) {


return (

<div className="
animate-in
fade-in
slide-in-from-bottom-3
duration-300
">


<div>

<p className="
text-[10px]
font-black
uppercase
tracking-[0.16em]
text-[#006241]
">

Business location

</p>


<h2 className="
mt-2
text-2xl
font-black
tracking-[-0.045em]
text-[#17211c]
sm:text-[28px]
">

Where should customers visit you?

</h2>


<p className="
mt-2
max-w-xl
text-sm
leading-6
text-black/45
">

Add your business location so customers can discover your place, view it on the map, and get accurate directions.

</p>


</div>



<div className="
mt-8
space-y-6
">



<div className="
rounded-[22px]
border
border-[#006241]/10
bg-[#f2f8f5]
p-4
">


<div className="
flex
gap-3
">


<div className="
flex
size-10
shrink-0
items-center
justify-center
rounded-full
bg-[#006241]
text-white
">

<MapPinCheck
className="size-5"
/>

</div>



<div>

<p className="
text-sm
font-black
text-[#17211c]
">

Make your location easy to find

</p>


<p className="
mt-1
text-xs
leading-5
text-black/45
">

CAFÉTA uses your location for search, directions, and nearby recommendations. A precise pin helps customers reach the right place.

</p>


</div>


</div>


</div>




{/* ADDRESS INFORMATION */}


<div className="
grid
gap-4
sm:grid-cols-2
">


<Field
label="Business address"
required
>

<input

value={
data.address
}

onChange={(event)=>
updateData({

address:
event.target.value,

})
}

placeholder="
Example: Rizal Avenue, near public market
"

className={inputClass}

/>

</Field>



<Field
label="Barangay"
>

<input

value={
data.barangay
}

onChange={(event)=>
updateData({

barangay:
event.target.value,

})
}

placeholder="
Barangay
"

className={inputClass}

/>

</Field>


</div>




<div className="
grid
gap-4
sm:grid-cols-2
">


<Field
label="City / Municipality"
required
>

<input

value={
data.city
}

onChange={(event)=>
updateData({

city:
event.target.value,

})
}

placeholder="
Isabela City
"

className={inputClass}

/>


</Field>




<Field
label="Province"
>

<input

value={
data.province
}

onChange={(event)=>
updateData({

province:
event.target.value,

})
}

placeholder="
Basilan
"

className={inputClass}

/>


</Field>



</div>






{/* MAP PICKER */}


<LocationPicker

latitude={
data.latitude
}

longitude={
data.longitude
}


onChange={(location)=>{


updateData({

latitude:
location.latitude,

longitude:
location.longitude,

});


}}


/>





<div className="
flex
items-start
gap-3
rounded-[18px]
border
border-black/[0.06]
bg-white
p-4
">


<div className="
flex
size-8
items-center
justify-center
rounded-full
bg-[#006241]/10
text-[#006241]
">

<Sparkles
className="size-4"
/>

</div>



<div>

<p className="
text-xs
font-black
text-[#17211c]
">

Almost done

</p>


<p className="
mt-1
text-xs
leading-5
text-black/40
">

After placing your pin, customers will see your business on CAFÉTA Map and nearby searches.

</p>


</div>


</div>




</div>


</div>

);

}





function Field({

label,

required=false,

children,

}:{

label:string;

required?:boolean;

children:React.ReactNode;

}){


return (

<div>


<label className="
text-xs
font-black
text-[#26322b]
">

{label}


{
required && (

<span className="
ml-1
text-[#006241]
">

*

</span>

)

}


</label>


<div className="mt-2">

{children}

</div>


</div>

);


}



const inputClass = `
h-12
w-full
rounded-[15px]
border
border-black/[0.08]
bg-[#fafbfa]
px-4
text-sm
font-medium
text-[#17211c]
outline-none
transition-all
placeholder:text-black/25
focus:border-[#006241]/40
focus:bg-white
focus:ring-4
focus:ring-[#006241]/[0.06]
`;