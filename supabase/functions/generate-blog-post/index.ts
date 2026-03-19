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
  { title: "The Sneaker Bubble Finally Popped — Now What?", category: "trend" },
  { title: "Palace vs Stüssy vs Carhartt WIP: The Ultimate Comparison", category: "guide" },
  { title: "Why Your Style Peaked in 2019 (And How to Fix It)", category: "style" },
  { title: "The Brands Celebrities Wear When They're NOT Being Paid", category: "spotlight" },
];

const AUTHOR_NAMES = [
  "Jordan Ellis",
  "Mia Chen",
  "Kwame Asante",
  "Lena Petrova",
  "Marcus Webb",
  "Aisha Nakamura",
  "Diego Reyes",
  "Priya Sharma",
];

// Real Unsplash streetwear/fashion editorial photos
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1551803091-e20673f15770?w=1200&h=630&fit=crop",
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

    const { data: existing } = await supabase.from("blog_posts").select("slug");
    const existingSlugs = new Set((existing || []).map((p: any) => p.slug));

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    const available = BLOG_TOPICS.filter(t => !existingSlugs.has(generateSlug(t.title, dateStr)));
    if (available.length === 0) {
      return new Response(JSON.stringify({ message: "All topics used for today" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const topic = available[dayOfYear % available.length];
    const slug = generateSlug(topic.title, dateStr);
    const author = AUTHOR_NAMES[dayOfYear % AUTHOR_NAMES.length];

    // Generate article — Highsnobiety style: 4-5 tight paragraphs, editorial tone
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
            content: `You are ${author}, a streetwear journalist writing for an editorial fashion publication similar to Highsnobiety. Your writing style is polished, opinionated, culturally informed, and reads like a real magazine article. You write in first person when it adds personality, but mostly in a confident editorial voice. Never mention AI, algorithms, or automated content. Write like a real journalist who lives and breathes this culture.`
          },
          {
            role: "user",
            content: `Write an article titled "${topic.title}".

Requirements:
- Write 4-5 paragraphs, each 4-6 sentences
- Write like Highsnobiety or Complex — polished editorial, not a blog post
- Reference real brands: Corteiz, Stüssy, Palace, Carhartt WIP, Aimé Leon Dore, Nike, Represent, Fear of God, Chrome Hearts, etc
- Reference real cultural figures where relevant
- Mention real trends: archive fashion, gorpcore, quiet luxury, Y2K revival, heavyweight blanks
- Sound like insider knowledge — authoritative but conversational
- Write a compelling excerpt (1-2 sentences) that hooks readers
- Do NOT mention DRIPWAY or any house brands
- Do NOT mention AI or that this is AI-generated in any way

Return as JSON:
{
  "excerpt": "...",
  "paragraph1": "...",
  "paragraph2": "...",
  "paragraph3": "...",
  "paragraph4": "...",
  "paragraph5": "..."
}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_blog_post",
              description: "Create a structured article with excerpt and paragraphs",
              parameters: {
                type: "object",
                properties: {
                  excerpt: { type: "string" },
                  paragraph1: { type: "string" },
                  paragraph2: { type: "string" },
                  paragraph3: { type: "string" },
                  paragraph4: { type: "string" },
                  paragraph5: { type: "string", description: "Optional 5th paragraph" }
                },
                required: ["excerpt", "paragraph1", "paragraph2", "paragraph3", "paragraph4"],
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

    const paragraphs = [
      blogContent.paragraph1,
      blogContent.paragraph2,
      blogContent.paragraph3,
      blogContent.paragraph4,
      blogContent.paragraph5,
    ].filter(Boolean);

    const fullContent = paragraphs.join("\n\n");

    const { data: post, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: topic.title,
        slug,
        excerpt: blogContent.excerpt,
        content: fullContent,
        cover_image_url: COVER_IMAGES[dayOfYear % COVER_IMAGES.length],
        category: topic.category,
        author,
        read_time: Math.ceil(fullContent.split(" ").length / 250),
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
