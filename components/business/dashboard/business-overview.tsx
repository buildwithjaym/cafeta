import {
  Eye,
  QrCode,
  Navigation,
  Utensils,
} from "lucide-react";

import {
  AnalyticsCard,
} from "./analytics-card";


import {
  calculateGrowth,
} from "@/lib/analytics/growth";



type Props = {

data:{
  views:number;

  qr_scans:number;

  menu_views:number;

  direction_clicks:number;


  previous_views:number;

  previous_qr_scans:number;

  previous_menu_views:number;

  previous_direction_clicks:number;
};

};



export function BusinessOverview({
data,
}:Props){


return (

<section>

<div
className="
grid

gap-4

sm:grid-cols-2

xl:grid-cols-4
"
>


<AnalyticsCard

title="Profile Views"

value={
data.views.toLocaleString()
}

growth={
calculateGrowth(
data.views,
data.previous_views,
)
}

description="Customers viewed your page"

icon={Eye}

/>



<AnalyticsCard

title="QR Scans"

value={
data.qr_scans.toLocaleString()
}

growth={
calculateGrowth(
data.qr_scans,
data.previous_qr_scans,
)
}

description="People scanned your QR"

icon={QrCode}

/>



<AnalyticsCard

title="Directions"

value={
data.direction_clicks.toLocaleString()
}

growth={
calculateGrowth(
data.direction_clicks,
data.previous_direction_clicks,
)
}

description="Customers looking for you"

icon={Navigation}

/>



<AnalyticsCard

title="Menu Views"

value={
data.menu_views.toLocaleString()
}

growth={
calculateGrowth(
data.menu_views,
data.previous_menu_views,
)
}

description="Customers checking your menu"

icon={Utensils}

/>


</div>

</section>

);

}