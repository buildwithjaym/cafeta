"use server";

import {
  trackBusinessEvent,
} from "./events";


export async function createBusinessAnalyticsEvent(
  businessId:string,
  eventType:
    | "qr_scan"
    | "menu_view"
    | "direction_click"
    | "phone_click"
    | "website_click"
    | "share_click",
){

  await trackBusinessEvent(
    businessId,
    eventType,
    {
      source:"business_profile",
    },
  );

}