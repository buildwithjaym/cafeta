"use client";

import type {
  LucideIcon,
} from "lucide-react";


type Props = {

  title:string;

  value:string;

  growth:number;

  description:string;

  icon:LucideIcon;

};



export function AnalyticsCard({
  title,
  value,
  growth,
  description,
  icon:Icon,
}:Props){


  const positive =
    growth >= 0;



  return (

    <div
      className="
      rounded-[26px]
      border
      border-black/[0.06]
      bg-white
      p-5
      shadow-sm
      transition
      hover:-translate-y-1
      hover:shadow-lg
      "
    >

      <div
        className="
        flex
        items-start
        justify-between
        "
      >

        <div
          className="
          flex
          size-11
          items-center
          justify-center
          rounded-2xl
          bg-[#006241]/10
          text-[#006241]
          "
        >

          <Icon
            className="
            size-5
            "
          />

        </div>



        <span
          className={`
          rounded-full
          px-2.5
          py-1
          text-[11px]
          font-black
          ${
            positive
              ? "bg-[#edf7f2] text-[#006241]"
              : "bg-red-50 text-red-500"
          }
          `}
        >

          {positive ? "+" : ""}
          {growth}%

        </span>


      </div>




      <div
        className="
        mt-5
        "
      >

        <p
          className="
          text-xs
          font-black
          uppercase
          tracking-[0.14em]
          text-black/40
          "
        >

          {title}

        </p>



        <h3
          className="
          mt-2
          text-3xl
          font-black
          tracking-[-0.05em]
          text-[#17211c]
          "
        >

          {value}

        </h3>



        <p
          className="
          mt-2
          text-sm
          text-black/45
          "
        >

          {description}

        </p>


      </div>


    </div>

  );

}