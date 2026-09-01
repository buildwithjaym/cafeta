import {
  Camera,
  MessageCircleHeart,
  QrCode,
  ArrowRight,
} from "lucide-react";


const actions = [
  {
    icon: Camera,
    title: "Add more photos",
    description:
      "Businesses with photos attract more customers.",
  },
  {
    icon: MessageCircleHeart,
    title: "Get more reviews",
    description:
      "Reviews help customers trust your business.",
  },
  {
    icon: QrCode,
    title: "Share your QR code",
    description:
      "Let more people discover your CAFÉTA page.",
  },
];


export function NextActions(){

return (

<div
className="
rounded-[28px]

border

border-[#006241]/10

bg-[#edf5f1]

p-6
"
>

<div>

<p
className="
text-[10px]

font-black

uppercase

tracking-[0.18em]

text-[#006241]
"
>
Growth Tips
</p>


<h3
className="
mt-2

text-xl

font-black

tracking-[-0.04em]

text-[#17211c]
"
>
Recommended Actions
</h3>


<p
className="
mt-1

text-sm

text-black/45
"
>
Small improvements can help your business grow faster.
</p>

</div>



<div
className="
mt-5

space-y-3
"
>

{
actions.map(
({
icon:Icon,
title,
description,
}) => (

<button
key={title}

className="
group

flex

w-full

items-center

gap-4

rounded-2xl

bg-white

p-4

text-left

transition

hover:-translate-y-0.5

hover:shadow-sm

active:scale-[0.98]
"
>


<div
className="
flex

size-11

shrink-0

items-center

justify-center

rounded-xl

bg-[#006241]/10

text-[#006241]

transition

group-hover:bg-[#006241]

group-hover:text-white
"
>

<Icon
className="
size-5
"
/>

</div>



<div
className="
min-w-0

flex-1
"
>

<h4
className="
text-sm

font-black

text-[#17211c]
"
>
{title}
</h4>


<p
className="
mt-1

text-xs

leading-5

text-black/45
"
>
{description}
</p>


</div>



<ArrowRight
className="
size-4

shrink-0

text-black/30

transition

group-hover:translate-x-1

group-hover:text-[#006241]
"
/>


</button>

)

)

}

</div>


</div>

);

}