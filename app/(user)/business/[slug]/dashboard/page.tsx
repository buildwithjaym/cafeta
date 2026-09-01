import {
  redirect,
} from "next/navigation";

import {
  getBusinessDashboardAccess,
  getBusinessAnalyticsSummary,
} from "@/lib/analytics/queries";

import {
  BusinessOverview,
} from "@/components/business/dashboard/business-overview";

import {
  EngagementDonut,
} from "@/components/business/dashboard/engagement-donut";


export const metadata = {
  title: "Business Dashboard | CAFÉTA",
  description: "Manage and track your CAFÉTA business.",
};


type PageProps = {
  params: Promise<{
    slug:string;
  }>;
};



export default async function BusinessDashboardPage({
  params,
}:PageProps){


  const {
    slug,
  } = await params;



  const access =
    await getBusinessDashboardAccess(
      slug,
    );



  if(!access){
    redirect("/explore");
  }



  const analytics =
    await getBusinessAnalyticsSummary(
      access.business.id,
    );



  return (

    <main className="min-h-screen bg-[#fbfcfa] px-5 py-8 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl space-y-8">


        {/* Header */}

        <header>

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#006241]">
            Business Dashboard
          </p>


          <div className="mt-2 flex items-start justify-between gap-4">

            <div>

              <h1 className="text-4xl font-black tracking-[-0.05em] text-[#17211c]">
                {access.business.name}
              </h1>


              <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
                Understand how customers discover, visit, and interact with your CAFÉTA profile.
              </p>

            </div>


            <span className="hidden rounded-full bg-[#edf5f1] px-4 py-2 text-xs font-bold text-[#006241] sm:block">
              {access.role === "owner" ? "Owner" : "Manager"}
            </span>


          </div>

        </header>





        {/* Main Analytics */}

        <section className="space-y-8">


          <BusinessOverview
            data={analytics}
          />



          <div className="grid gap-6 lg:grid-cols-2">


            <EngagementDonut
              data={
                analytics.action_distribution
              }
            />



            <div className="rounded-[28px] border border-black/[0.06] bg-white p-6">

              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#006241]">
                Customer Journey
              </p>


              <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-[#17211c]">
                How visitors convert
              </h2>



              <div className="mt-6 space-y-4">


                <div className="rounded-2xl bg-[#f5f8f6] p-4">

                  <p className="text-xs text-black/40">
                    Profile Visitors
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {analytics.funnel.profile_views}
                  </p>

                </div>



                <div className="rounded-2xl bg-[#f5f8f6] p-4">

                  <p className="text-xs text-black/40">
                    Menu Interest
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {analytics.funnel.menu_views}
                  </p>

                </div>



                <div className="rounded-2xl bg-[#f5f8f6] p-4">

                  <p className="text-xs text-black/40">
                    Direction Requests
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {analytics.funnel.directions}
                  </p>

                </div>


              </div>


            </div>


          </div>


        </section>


      </div>

    </main>

  );

}