"use client";

import {
  useState,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  createClient,
} from "@/lib/supabase/client";


const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";


type GoogleAuthButtonProps = {
  next?: string;
};


function getSafeNext(next?: string) {
  if (!next) {
    return null;
  }

  if (
    !next.startsWith("/") ||
    next.startsWith("//")
  ) {
    return null;
  }

  if (
    next.startsWith("/admin")
  ) {
    return null;
  }

  return next;
}



export function GoogleAuthButton({
  next,
}: GoogleAuthButtonProps) {


  const [
    loading,
    setLoading,
  ] = useState(false);



  async function handleGoogleAuth() {


    if (loading) {
      return;
    }


    setLoading(true);



    try {


      const supabase =
        createClient();



      const callbackUrl =
        new URL(
          "/auth/callback",
          SITE_URL,
        );



      const safeNext =
        getSafeNext(next);



      if (safeNext) {

        callbackUrl.searchParams.set(
          "next",
          safeNext,
        );

      }



      const {
        error,
      } =
        await supabase.auth.signInWithOAuth({

          provider:
            "google",

          options:{
            redirectTo:
              callbackUrl.toString(),
          },

        });



      if(error){
        throw error;
      }



    } catch(error){


      console.error(
        "[CAFÉTA] Google authentication failed:",
        error,
      );


      toast.error(
        "Could not continue with Google. Please try again.",
      );


      setLoading(false);

    }

  }




  return (

    <button

      type="button"

      onClick={handleGoogleAuth}

      disabled={loading}

      className="
      group
      flex
      h-12
      w-full
      items-center
      justify-center
      gap-3
      rounded-xl
      border
      border-black/[0.09]
      bg-white
      px-5
      text-sm
      font-semibold
      text-[#17211c]
      transition
      duration-200
      hover:border-black/20
      hover:bg-black/[0.015]
      disabled:pointer-events-none
      disabled:opacity-60
      "

    >

      {
        loading
        ?
        (
          <>

          <LoaderCircle
            className="
            size-[18px]
            animate-spin
            "
          />

          Connecting...

          </>
        )
        :
        (
          <>

          <span
            className="
            transition-transform
            duration-200
            group-hover:scale-105
            "
          >

            <GoogleIcon />

          </span>


          Continue with Google


          </>
        )
      }


    </button>

  );

}




function GoogleIcon() {

  return (

    <svg

      viewBox="0 0 24 24"

      className="size-[18px]"

      aria-hidden="true"

    >

      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.509h3.232c1.891-1.741 2.981-4.305 2.981-7.35Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.964-.895 6.619-2.423l-3.232-2.509c-.896.6-2.039.955-3.387.955-2.605 0-4.809-1.761-5.596-4.127H3.063v2.591A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.404 13.896A6.01 6.01 0 0 1 6.091 12c0-.658.113-1.298.313-1.896V7.513H3.063A10 10 0 0 0 2 12c0 1.613.386 3.141 1.063 4.487l3.341-2.591Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.96 2.991 14.696 2 12 2a10 10 0 0 0-8.937 5.513l3.341 2.591C7.191 7.739 9.395 5.977 12 5.977Z"
      />

    </svg>

  );

}