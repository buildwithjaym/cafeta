"use client";


import {
  useState,
} from "react";


import {
 X,
 Copy,
 Download,
 Share2,
} from "lucide-react";


import {
 toast,
} from "sonner";


import {
 toPng,
} from "html-to-image";


import {
 BusinessShareCard,
} from "./business-share-card";



type Props = {

business:any;

onClose:()=>void;

};



export function BusinessShareModal({
business,
onClose,
}:Props){


const [
loading,
setLoading,
]=useState(false);



const url =
`https://www.cafeta.online/business/${business.slug}`;



async function copyLink(){


await navigator.clipboard.writeText(
url
);


toast.success(
"CAFÉTA link copied"
);


}



async function downloadCard(){


const element =
document.getElementById(
"cafeta-share-card"
);


if(!element){

return;

}


setLoading(true);


try{


const image =
await toPng(element);


const link =
document.createElement("a");


link.href=image;


link.download =
`${business.slug}-cafeta-card.png`;


link.click();



toast.success(
"Marketing card downloaded"
);


}
finally{

setLoading(false);

}


}



async function share(){


if(
navigator.share
){

await navigator.share({

title:
business.name,

text:
`Discover ${business.name} on CAFÉTA`,

url,

});


}


}




return (

<div
className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
p-4
"
>


<div
className="
relative
w-full
max-w-md
rounded-[32px]
bg-white
p-6
"
>


<button
onClick={onClose}
className="
absolute
right-5
top-5
flex
size-9
items-center
justify-center
rounded-full
bg-black/5
"
>

<X className="size-4"/>

</button>



<h2
className="
text-2xl
font-black
text-[#17211c]
"
>
Share business
</h2>


<p
className="
mt-1
text-sm
text-black/45
"
>
Share your CAFÉTA profile anywhere.
</p>



<div
className="
mt-6
"
>

<BusinessShareCard
business={business}
/>

</div>




<div
className="
mt-6
grid
gap-3
"
>


<button
onClick={copyLink}
className="
flex
h-12
items-center
justify-center
gap-2
rounded-xl
bg-[#edf5f1]
font-bold
text-[#006241]
"
>

<Copy className="size-4"/>

Copy link

</button>



<button
onClick={downloadCard}
disabled={loading}
className="
flex
h-12
items-center
justify-center
gap-2
rounded-xl
bg-[#006241]
font-bold
text-white
"
>

<Download className="size-4"/>

{
loading
?
"Preparing..."
:
"Download PNG"
}

</button>



<button
onClick={share}
className="
flex
h-12
items-center
justify-center
gap-2
rounded-xl
border
font-bold
"
>

<Share2 className="size-4"/>

Share

</button>


</div>


</div>


</div>

);

}