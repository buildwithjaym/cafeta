export type AnalyticsEventType =

  | "profile_view"
  | "qr_scan"
  | "menu_view"
  | "direction_click"
  | "phone_click"
  | "website_click"
  | "share_click";



export type AnalyticsGrowth = {

  views:number;

  qr_scans:number;

  menu_views:number;

  directions:number;

};



export type BusinessAnalyticsSummary = {


  views:number;


  qr_scans:number;


  menu_views:number;


  direction_clicks:number;



  previous_views:number;


  previous_qr_scans:number;


  previous_menu_views:number;


  previous_direction_clicks:number;




  growth:AnalyticsGrowth;





  action_distribution:{

    name:string;

    value:number;

  }[];





  daily_views:{

    date:string;

    views:number;

  }[];





  funnel:{

    profile_views:number;

    menu_views:number;

    directions:number;

  };


};