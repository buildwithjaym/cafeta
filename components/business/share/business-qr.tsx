"use client";

import {
  useEffect,
  useState,
} from "react";

import QRCode from "qrcode";


type Props = {
  url:string;
};


export function BusinessQR({
  url,
}:Props){

const [
  qr,
  setQr,
]=useState("");


useEffect(()=>{

QRCode.toDataURL(
  url,
  {
    width:500,
    margin:2,
  },
)
.then(setQr);


},[
 url
]);


if(!qr){

return null;

}


return (

<img
src={qr}
alt="CAFÉTA QR Code"
className="
mx-auto
size-48
rounded-xl
bg-white
p-3
"
/>

);

}