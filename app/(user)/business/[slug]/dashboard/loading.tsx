export default function Loading(){

return (

<main
className="
min-h-screen
bg-[#fbfcfa]
px-5
py-8
sm:px-8
lg:px-12
"
>

<div
className="
mx-auto
max-w-7xl
space-y-8
"
>


<div className="space-y-3">

<div
className="
h-3
w-32
rounded-full
bg-black/10
animate-pulse
"
/>


<div
className="
h-10
w-72
rounded-xl
bg-black/10
animate-pulse
"
/>


<div
className="
h-5
w-96
rounded-xl
bg-black/5
animate-pulse
"
/>


</div>



<div
className="
grid
gap-4
sm:grid-cols-2
xl:grid-cols-4
"
>

{
Array
.from({
length:4
})
.map((_,i)=>(

<div
key={i}
className="
h-44
rounded-[24px]
border
bg-white
animate-pulse
"
/>

))
}


</div>


</div>


</main>

);

}