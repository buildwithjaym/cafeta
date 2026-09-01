"use client";

import {
  MapPinCheck,
  Sparkles,
} from "lucide-react";

import {
  LocationPicker,
} from "@/components/business/location-picker";

type BusinessLocation = {
  address:string;
  barangay:string | null;
  city:string;
  province:string;
  latitude:number;
  longitude:number;
};

type Props = {
  data:BusinessLocation;
  onChange:(values:Partial<BusinessLocation>)=>void;
};

export function BusinessLocationEdit({
  data,
  onChange,
}:Props){

  return (

    <section className="rounded-[24px] border border-black/[0.06] bg-white p-5 sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#006241]">
            Location
          </p>

          <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#17211c]">
            Business location
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-black/45">
            Update your address and move your map pin if your business location has changed.
          </p>

        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#edf5f1] text-[#006241]">
          <MapPinCheck className="size-5" />
        </div>

      </div>


      <div className="mt-6 space-y-5">

        <div className="rounded-[18px] border border-[#006241]/10 bg-[#f2f8f5] p-4">

          <div className="flex gap-3">

            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#006241] text-white">
              <MapPinCheck className="size-4" />
            </div>

            <div>

              <p className="text-sm font-black text-[#17211c]">
                Keep your location accurate
              </p>

              <p className="mt-1 text-xs leading-5 text-black/45">
                Customers use this location for CAFÉTA Map, nearby searches, and directions.
              </p>

            </div>

          </div>

        </div>


        <div className="grid gap-4 sm:grid-cols-2">

          <Field label="Business address" required>

            <input
              value={data.address}
              onChange={(event)=>onChange({
                address:event.target.value,
              })}
              placeholder="Example: Rizal Avenue, near public market"
              className={inputClass}
            />

          </Field>


          <Field label="Barangay">

            <input
              value={data.barangay ?? ""}
              onChange={(event)=>onChange({
                barangay:event.target.value,
              })}
              placeholder="Barangay"
              className={inputClass}
            />

          </Field>

        </div>


        <div className="grid gap-4 sm:grid-cols-2">

          <Field label="City / Municipality" required>

            <input
              value={data.city}
              onChange={(event)=>onChange({
                city:event.target.value,
              })}
              placeholder="Isabela City"
              className={inputClass}
            />

          </Field>


          <Field label="Province">

            <input
              value={data.province}
              onChange={(event)=>onChange({
                province:event.target.value,
              })}
              placeholder="Basilan"
              className={inputClass}
            />

          </Field>

        </div>


        <LocationPicker
          latitude={data.latitude}
          longitude={data.longitude}
          onChange={(location)=>onChange({
            latitude:location.latitude,
            longitude:location.longitude,
          })}
        />


        <div className="flex items-start gap-3 rounded-[18px] border border-black/[0.06] bg-[#fafbfa] p-4">

          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#006241]/10 text-[#006241]">
            <Sparkles className="size-4" />
          </div>

          <div>

            <p className="text-xs font-black text-[#17211c]">
              Map pin matters
            </p>

            <p className="mt-1 text-xs leading-5 text-black/40">
              Place the pin directly on your business entrance or storefront so customers get the most accurate directions.
            </p>

          </div>

        </div>

      </div>

    </section>

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

      <label className="text-xs font-black text-[#26322b]">

        {label}

        {required && (
          <span className="ml-1 text-[#006241]">
            *
          </span>
        )}

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