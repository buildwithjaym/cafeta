export function calculateGrowth(
current:number,
previous:number,
){

if(previous === 0){

return 100;

}


return Math.round(
(
(current - previous)
/
previous
)
*
100
);

}