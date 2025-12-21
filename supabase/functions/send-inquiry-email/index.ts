import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryPayload {
  type: "vendor_notification" | "confirmation" | "welcome";
  vendor_name?: string;
  vendor_email?: string;
  contact_name: string;
  contact_email: string;
  event_date?: string;
  guest_count?: number;
  message?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const payload: InquiryPayload = await req.json();
    let emailRequest;

    if (payload.type === "vendor_notification" && payload.vendor_email) {
      // Email to vendor about new inquiry
      emailRequest = {
        from: "2PlanAWedding <notifications@app.2planawedding.com>",
        to: [payload.vendor_email],
        subject: `🎊 New Wedding Inquiry from ${payload.contact_name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f5e6e0 0%, #fff5f3 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
              <h1 style="color: #8b5a5a; margin: 0 0 10px 0; font-size: 24px;">New Wedding Inquiry! 💒</h1>
              <p style="color: #666; margin: 0;">A couple is interested in your services</p>
            </div>
            
            <div style="background: #fff; border: 1px solid #f0e6e4; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Contact Details</h2>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${payload.contact_name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${payload.contact_email}" style="color: #8b5a5a;">${payload.contact_email}</a></p>
              ${payload.event_date ? `<p style="margin: 8px 0;"><strong>Event Date:</strong> ${payload.event_date}</p>` : ''}
              ${payload.guest_count ? `<p style="margin: 8px 0;"><strong>Guest Count:</strong> ${payload.guest_count}</p>` : ''}
            </div>
            
            ${payload.message ? `
            <div style="background: #fafafa; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Their Message</h2>
              <p style="color: #555; line-height: 1.6; margin: 0;">${payload.message}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; padding: 20px;">
              <a href="mailto:${payload.contact_email}" style="display: inline-block; background: #8b5a5a; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 500;">Reply to ${payload.contact_name}</a>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              This inquiry was sent via 2PlanAWedding
            </p>
          </div>
        `,
        reply_to: payload.contact_email,
      };
    } else if (payload.type === "confirmation") {
      // Confirmation email to the couple
      emailRequest = {
        from: "2PlanAWedding <notifications@app.2planawedding.com>",
        to: [payload.contact_email],
        subject: `Your inquiry has been sent! 💌`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f5e6e0 0%, #fff5f3 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <h1 style="color: #8b5a5a; margin: 0 0 10px 0; font-size: 24px;">Inquiry Sent! 🎉</h1>
              <p style="color: #666; margin: 0;">We've notified ${payload.vendor_name || 'the vendor'} about your interest</p>
            </div>
            
            <div style="background: #fff; border: 1px solid #f0e6e4; border-radius: 12px; padding: 25px;">
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">What happens next?</h2>
              <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                <li>The vendor will receive your inquiry immediately</li>
                <li>Most vendors respond within 24-48 hours</li>
                <li>Keep an eye on your inbox at <strong>${payload.contact_email}</strong></li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              Happy Planning! 💕<br>
              The 2PlanAWedding Team
            </p>
          </div>
        `,
      };
    } else if (payload.type === "welcome") {
      // Welcome email for new users
      emailRequest = {
        from: "2PlanAWedding <notifications@app.2planawedding.com>",
        to: [payload.contact_email],
        subject: `Welcome to 2PlanAWedding! 💒`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f5e6e0 0%, #fff5f3 100%); padding: 40px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <h1 style="color: #8b5a5a; margin: 0 0 10px 0; font-size: 28px;">Welcome, ${payload.contact_name}! 🎊</h1>
              <p style="color: #666; margin: 0; font-size: 16px;">Your wedding planning journey starts here</p>
            </div>
            
            <div style="background: #fff; border: 1px solid #f0e6e4; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Get Started</h2>
              <ul style="color: #555; line-height: 2; padding-left: 20px;">
                <li>🎯 Take the <strong>Style Matcher</strong> quiz to discover your wedding aesthetic</li>
                <li>📍 Browse <strong>verified vendors</strong> in your area</li>
                <li>💰 Use our <strong>Budget Planner</strong> to stay on track</li>
                <li>💬 Chat with our <strong>AI Planning Buddy</strong> anytime</li>
              </ul>
            </div>
            
            <div style="text-align: center; padding: 20px;">
              <a href="https://2planawedding.com/style-matcher" style="display: inline-block; background: #8b5a5a; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 500;">Start Style Quiz</a>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              Questions? Reply to this email anytime.<br>
              Happy Planning! 💕
            </p>
          </div>
        `,
      };
    } else {
      return new Response(JSON.stringify({ error: "Invalid email type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Email error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
