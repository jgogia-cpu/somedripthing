import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLOG_TOPICS = [
  { title: "Nike Just Killed Their Best Shoe and Nobody's Talking About It", category: "trend" },
  { title: "The $30 Brand That's Making Stüssy Fans Switch Up", category: "trend" },
  { title: "Why Every Rapper Is Wearing This One Brand Right Now", category: "spotlight" },
  { title: "I Wore Only Thrift Fits for 30 Days — Here's What Happened", category: "style" },
  { title: "The Underground Brand That Sold Out in 47 Seconds", category: "spotlight" },
  { title: "Corteiz vs Stüssy: Which One Actually Holds Up?", category: "guide" },
  { title: "These 7 Brands Will Blow Up in 2026 (Get in Early)", category: "trend" },
  { title: "Why Your Favorite Streetwear Brand Is Dying", category: "trend" },
  { title: "The Real Reason Vintage Tees Cost $500 Now", category: "guide" },
  { title: "Jordan Dropped Their Most Controversial Shoe Yet", category: "trend" },
  { title: "TikTok Made This Brand Famous Overnight — But Is It Actually Good?", category: "spotlight" },
  { title: "How to Build a $10K Wardrobe for Under $500", category: "guide" },
  { title: "The Hoodie That's Outselling Supreme Right Now", category: "trend" },
  { title: "Drake's Secret Wardrobe: Every Brand He's Worn This Year", category: "style" },
  { title: "5 Dead Brands That Need to Come Back Immediately", category: "trend" },
  { title: "This Japanese Brand Is About to Take Over Streetwear", category: "spotlight" },
  { title: "Why Balenciaga Fans Are Switching to This $80 Brand", category: "trend" },
  { title: "The Most Overhyped Streetwear Drops of 2026 (So Far)", category: "guide" },
  { title: "Kanye's New Brand vs Yeezy: Which One Actually Wins?", category: "spotlight" },
  { title: "Gen Z Killed Hypebeast Culture — Here's What Replaced It", category: "trend" },
  { title: "The Comeback Nobody Expected: Baggy Jeans Are Everywhere Again", category: "style" },
  { title: "I Spent $1000 at 5 Different Streetwear Brands — Ranking Them All", category: "guide" },
  { title: "Why London Streetwear Hits Different Than New York", category: "trend" },
  { title: "The Influence War: How Streetwear Brands Are Buying Your Feed", category: "trend" },
  { title: "A$AP Rocky's Stylist Just Leaked the Next Big Trend", category: "style" },
  { title: "This $40 Cargo Pant Is Beating Every Designer Pair", category: "guide" },
  { title: "Streetwear Is Dead — Long Live Streetwear", category: "trend" },
  { title: "The Brand Supreme Doesn't Want You to Know About", category: "spotlight" },
  { title: "Why Gorpcore Kids Are the New Hypebeasts", category: "trend" },
  { title: "We Asked 100 Sneakerheads Their All-Time Grails — The Results Are Wild", category: "guide" },
  { title: "The Fastest-Growing Streetwear Brands on Instagram Right Now", category: "trend" },
  { title: "How One Drop Made This Unknown Brand Worth Millions", category: "spotlight" },
  { title: "The Real Cost of Running a Streetwear Brand in 2026", category: "guide" },
  { title: "Travis Scott's Outfit Breakdown: Every Piece Identified", category: "style" },
  { title: "Why Heavyweight Blanks Are the Future of Fashion", category: "trend" },
  { title: "The Archive Fashion Trend Is Getting Out of Hand", category: "trend" },
  { title: "7 Outfit Formulas That Work Every Single Time", category: "guide" },
  { title: "This Startup Just Raised $20M to Disrupt Streetwear", category: "spotlight" },
  { title: "Quiet Luxury Is Dead — Loud Fashion Is Back", category: "trend" },
  { title: "The Best Streetwear Under $50 That Doesn't Look Cheap", category: "guide" },
  { title: "How Resellers Ruined Streetwear (And How Brands Fight Back)", category: "trend" },
  { title: "The 10 Collabs That Actually Changed Fashion Forever", category: "guide" },
  { title: "Why Korean Streetwear Is Taking Over the World", category: "trend" },
  { title: "These Influencers Are Lying About Their Outfits", category: "trend" },
  { title: "The New Wave of Black-Owned Streetwear Brands You Need to Know", category: "spotlight" },
  { title: "How to Tell if a Streetwear Brand Is Actually Independent", category: "guide" },
  { title: "The Sneaker Bubble Finally Popped — Now What?",  category: "trend" },
  { title: "Palace vs Stüssy vs Carhartt WIP: The Ultimate Comparison", category: "guide" },
  { title: "Why Your Style Peaked in 2019 (And How to Fix It)", category: "style" },
  { title: "The Brands Celebrities Wear When They're NOT Being Paid", category: "spotlight" },
];

function generateSlug(title: string, date: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) + `-${date}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get existing slugs
    const { data: existing } = await supabase.from("blog_posts").select("slug");
    const existingSlugs = new Set((existing || []).map((p: any) => p.slug));

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    // Pick unused topic
    const available = BLOG_TOPICS.filter(t => !existingSlugs.has(generateSlug(t.title, dateStr)));
    if (available.length === 0) {
      return new Response(JSON.stringify({ message: "All topics used for today" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const topic = available[dayOfYear % available.length];
    const slug = generateSlug(topic.title, dateStr);

    // Generate 6-7 paragraph blog post
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a viral streetwear journalist and culture writer. You write like a mix of Complex, Highsnobiety, and a streetwear Reddit power user. Your tone is confident, opinionated, a little provocative, and deeply knowledgeable. You reference real brands, real trends, real cultural moments. You know the difference between hype and substance. You write for people who actually wear this stuff — not fashion students. Keep it punchy, insightful, and shareable.`
          },
          {
            role: "user",
            content: `Write a blog post titled "${topic.title}".

Requirements:
- Write 6-7 paragraphs, each 5-7 sentences long
- Be opinionated and bold — take stances, name names
- Reference real trending streetwear brands (Corteiz, Stüssy, Palace, Carhartt WIP, Aimé Leon Dore, New Balance, Nike, Represent, Fear of God, Chrome Hearts, Raf Simons, etc)
- Reference cultural figures where relevant (rappers, athletes, influencers)
- Talk about real trends: archive fashion, gorpcore, quiet luxury, Y2K revival, heavyweight blanks, etc
- Make it feel like insider knowledge — the kind of stuff people screenshot and share
- Write a clickbait-worthy excerpt (1-2 sentences) that makes people NEED to click
- DO NOT mention DRIPWAY or any house brands

Return as JSON:
{
  "excerpt": "...",
  "paragraph1": "...",
  "paragraph2": "...",
  "paragraph3": "...",
  "paragraph4": "...",
  "paragraph5": "...",
  "paragraph6": "...",
  "paragraph7": "..."
}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_blog_post",
              description: "Create a structured blog post with excerpt and 6-7 paragraphs",
              parameters: {
                type: "object",
                properties: {
                  excerpt: { type: "string" },
                  paragraph1: { type: "string" },
                  paragraph2: { type: "string" },
                  paragraph3: { type: "string" },
                  paragraph4: { type: "string" },
                  paragraph5: { type: "string" },
                  paragraph6: { type: "string" },
                  paragraph7: { type: "string", description: "Optional 7th paragraph" }
                },
                required: ["excerpt", "paragraph1", "paragraph2", "paragraph3", "paragraph4", "paragraph5", "paragraph6"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_blog_post" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let blogContent;

    if (toolCall) {
      blogContent = JSON.parse(toolCall.function.arguments);
    } else {
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) blogContent = JSON.parse(jsonMatch[0]);
      else throw new Error("Failed to parse AI response");
    }

    // Generate cover image
    let coverImageUrl = null;
    try {
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{
            role: "user",
            content: `Create a cinematic editorial fashion photograph for a streetwear article titled "${topic.title}". Urban environment, moody lighting, high contrast. Think Highsnobiety or Complex magazine cover photo. No text, no watermarks, no logos. Photorealistic, editorial quality.`
          }],
          modalities: ["image", "text"],
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const imageBase64 = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (imageBase64) {
          const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const filePath = `blog-covers/${slug}.png`;
          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(filePath, imageBytes, { contentType: "image/png", upsert: true });
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(filePath);
            coverImageUrl = urlData.publicUrl;
          }
        }
      }
    } catch (imgErr) {
      console.error("Image generation error:", imgErr);
    }

    // Build content
    const paragraphs = [
      blogContent.paragraph1,
      blogContent.paragraph2,
      blogContent.paragraph3,
      blogContent.paragraph4,
      blogContent.paragraph5,
      blogContent.paragraph6,
      blogContent.paragraph7,
    ].filter(Boolean);

    const fullContent = paragraphs.join("\n\n");

    const { data: post, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: topic.title,
        slug,
        excerpt: blogContent.excerpt,
        content: fullContent,
        cover_image_url: coverImageUrl,
        category: topic.category,
        author: "DRIPWAY Editorial",
        read_time: Math.ceil(fullContent.split(" ").length / 200),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, post }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog-post error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
