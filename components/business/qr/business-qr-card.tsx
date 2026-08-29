"use client";

import {
  useEffect,
  useState,
} from "react";

import QRCode from "qrcode";

import {
  Download,
} from "lucide-react";


type Props = {
  businessName:string;
  slug:string;
};


export function BusinessQrCard({
  businessName,
  slug,
}:Props){

  const [
    qr,
    setQr,
  ] = useState("");


  const url =
    `https://www.cafeta.online/business/${slug}`;


  useEffect(()=>{

    QRCode.toDataURL(
      url,
      {
        width:400,
        margin:2,
      },
    )
    .then(setQr);


  },[
    url
  ]);


  function downloadQR(){

    const link =
      document.createElement(
        "a"
      );

    link.href = qr;

    link.download =
      `${slug}-cafeta-qr.png`;

    link.click();

  }


  return (

    <div
      className="
      rounded-3xl
      border
      bg-white
      p-6
      text-center
      "
    >

      <h3
        className="
        text-lg
        font-black
        "
      >
        {businessName}
      </h3>


      <p
        className="
        mt-1
        text-sm
        text-black/50
        "
      >
        Scan to view menu,
        location and reviews
      </p>


      {
        qr && (
          <img
            src={qr}
            alt="CAFÉTA QR Code"
            className="
            mx-auto
            mt-5
            size-52
            "
          />
        )
      }


      <button
        onClick={downloadQR}
        className="
        mt-5
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[#006241]
        py-3
        text-sm
        font-bold
        text-white
        "
      >

        <Download
          className="size-4"
        />

        Download QR Code

      </button>


    </div>

  );
}