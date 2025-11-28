// ==============================================================================
// ClarityClaim AI - Email Notification Edge Function
// ==============================================================================
// This Supabase Edge Function sends email notifications when:
// - A demo request is submitted
// - A contact form is submitted
// - A newsletter subscription is created
//
// Deploy with: supabase functions deploy send-notification
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "team@clarityclaim.ai";

interface NotificationPayload {
  type: "demo_request" | "contact_form" | "newsletter_subscription";
  data: {
    fullName?: string;
    email: string;
    organizationName?: string;
    organizationType?: string;
    monthlyClaimVolume?: string;
    message?: string;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const { type, data } = payload;

    // Validate payload
    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: "Missing type or data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Skip if no API key configured
    if (!RESEND_API_KEY) {
      console.log("No RESEND_API_KEY configured, skipping email notification");
      return new Response(
        JSON.stringify({ success: true, message: "Email skipped (no API key)" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build email based on notification type
    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "demo_request":
        subject = `🎯 New Demo Request from ${data.organizationName || data.email}`;
        htmlContent = `
          <h2>New Demo Request</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organization</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.organizationName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Type</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.organizationType}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Monthly Claims</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.monthlyClaimVolume}</td></tr>
            ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td></tr>` : ""}
          </table>
          <p style="margin-top: 16px;">View all requests in your <a href="https://app.supabase.com">Supabase Dashboard</a>.</p>
        `;
        break;

      case "contact_form":
        subject = `📬 New Contact Form Submission from ${data.fullName || data.email}`;
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organization</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.organizationName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Type</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.organizationType}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Monthly Claims</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.monthlyClaimVolume}</td></tr>
            ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td></tr>` : ""}
          </table>
          <p style="margin-top: 16px;">View all submissions in your <a href="https://app.supabase.com">Supabase Dashboard</a>.</p>
        `;
        break;

      case "newsletter_subscription":
        subject = `📧 New Newsletter Subscription: ${data.email}`;
        htmlContent = `
          <h2>New Newsletter Subscriber</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p style="margin-top: 16px;">View all subscribers in your <a href="https://app.supabase.com">Supabase Dashboard</a>.</p>
        `;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Unknown notification type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ClarityClaim AI <notifications@clarityclaim.ai>",
        to: [NOTIFICATION_EMAIL],
        subject,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email send failed:", errorData);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
