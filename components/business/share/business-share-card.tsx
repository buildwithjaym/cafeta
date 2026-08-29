"use client";


import {
  BusinessQR,
} from "./business-qr";


type Props = {

business:{
 name:string;
 slug:string;
 logo_url?:string|null;
 category:string;
 address:string;
 city:string;
 province:string;
};

};


export function BusinessShareCard({
business,
}:Props){


const url =
`https://www.cafeta.online/business/${business.slug}`;


return (

<div
id="cafeta-share-card"
className="
overflow-hidden
rounded-[32px]
bg-white
p-6
shadow-sm
border
border-black/[0.08]
"
>


<div
className="
flex
items-center
gap-4
"
>


<div
className="
flex
size-16
items-center
justify-center
overflow-hidden
rounded-full
bg-[#006241]
"
>

{
business.logo_url ? (

<img
src={business.logo_url}
alt={business.name}
className="
size-full
object-cover
"
/>

):(

<span
className="
text-xl
font-black
text-white
"
>
☕
</span>

)

}

</div>



<div>

<h3
className="
text-xl
font-black
text-[#17211c]
"
>
{business.name}
</h3>


<p
className="
text-xs
font-bold
text-[#006241]
"
>
{business.category}
</p>


</div>


</div>




<div
className="
mt-6
rounded-[24px]
bg-[#f3f7f5]
p-5
text-center
"
>

<BusinessQR
url={url}
/>


<p
className="
mt-4
text-sm
font-black
text-[#17211c]
"
>
Scan to view our menu
</p>


<p
className="
mt-1
text-xs
text-black/45
"
>
Location · Reviews · Business info
</p>


</div>




<p
className="
mt-5
text-center
text-xs
font-bold
text-[#006241]
"
>
www.cafeta.online
</p>


</div>

);

}