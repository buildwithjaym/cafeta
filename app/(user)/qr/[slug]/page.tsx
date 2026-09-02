import { redirect } from "next/navigation";


type Props = {
  params: Promise<{
    slug:string;
  }>;
};


export default async function QRPage({
  params,
}:Props){

  const {
    slug,
  } = await params;


  console.log(
    "QR ROUTE HIT:",
    slug,
  );


  redirect(
    `/business/${slug}`
  );

}