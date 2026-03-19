import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLOG_TOPICS = [
  { title: "10 Underground Streetwear Brands You've Never Heard Of", category: "guide", slug: "underground-streetwear-brands" },
  { title: "Best Niche Instagram Brands for Gorpcore", category: "trend", slug: "niche-gorpcore-brands" },
  { title: "DripByRage Review: Is It Worth It?", category: "spotlight", slug: "dripbyrage-review" },
  { title: "Best Niche Instagram Brands for Y2K Style", category: "trend", slug: "niche-y2k-brands" },
  { title: "How to Build a Streetwear Wardrobe on a Budget", category: "guide", slug: "streetwear-budget-wardrobe" },
  { title: "Top Emerging Canadian Streetwear Labels to Watch", category: "trend", slug: "canadian-streetwear-labels" },
  { title: "Brands Like Supreme: 15 Alternatives You'll Love", category: "guide", slug: "brands-like-supreme-alternatives" },
  { title: "The Rise of South Asian Streetwear Culture", category: "trend", slug: "south-asian-streetwear-culture" },
  { title: "Best Oversized Hoodies for Every Aesthetic", category: "guide", slug: "best-oversized-hoodies" },
  { title: "SABR Clothing Review: Rhinestone Tracksuits Worth the Hype?", category: "spotlight", slug: "sabr-clothing-review" },
  { title: "Varsity Jackets Are Back: How to Style Them in 2026", category: "style", slug: "varsity-jackets-styling-2026" },
  { title: "Dark Academia Meets Streetwear: The Unexpected Crossover", category: "trend", slug: "dark-academia-streetwear" },
  { title: "Preview Worldwide: Y2K Racing Aesthetics Explained", category: "spotlight", slug: "preview-worldwide-y2k-racing" },
  { title: "Grunge Streetwear: Why Faded Hoodies Are Dominating 2026", category: "trend", slug: "grunge-faded-hoodies-trend" },
  { title: "How Small Fashion Brands Build Loyal Communities", category: "guide", slug: "small-brands-build-communities" },
  { title: "Best Streetwear Brands for Women in 2026", category: "guide", slug: "best-streetwear-women-2026" },
  { title: "Techwear vs Gorpcore: What's the Difference?", category: "guide", slug: "techwear-vs-gorpcore" },
  { title: "The Complete Guide to Archive Fashion", category: "guide", slug: "archive-fashion-guide" },
  { title: "Touro Studio: Minimalist Streetwear Done Right", category: "spotlight", slug: "touro-studio-minimalist-review" },
  { title: "Kogi Collective: Where Emotion Meets Fabric", category: "spotlight", slug: "kogi-collective-spotlight" },
  { title: "Why Oversized Fits Are Here to Stay", category: "trend", slug: "oversized-fits-staying" },
  { title: "Dimito: Korean Snowboard Culture Goes Global", category: "spotlight", slug: "dimito-snowboard-culture" },
  { title: "Best Streetwear Accessories Under $50", category: "guide", slug: "streetwear-accessories-under-50" },
  { title: "How to Spot Fake Streetwear: A Buyer's Guide", category: "guide", slug: "spot-fake-streetwear" },
  { title: "The Dovira Effect: Eastern European Fashion Rising", category: "spotlight", slug: "dovira-eastern-european-fashion" },
  { title: "Cottagecore to Streetwear: Cross-Aesthetic Outfit Ideas", category: "style", slug: "cottagecore-streetwear-outfits" },
  { title: "Best Graphic Tees That Actually Stand Out", category: "guide", slug: "best-graphic-tees-standout" },
  { title: "Street Style Photography: Capturing the Culture", category: "style", slug: "street-style-photography" },
  { title: "Workwear Aesthetics: From Factory Floor to Fashion Week", category: "trend", slug: "workwear-aesthetics-trend" },
  { title: "How Dripway Curates the Best Underground Brands", category: "spotlight", slug: "how-dripway-curates-brands" },
];

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

    // Get existing slugs to avoid duplicates
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("slug");
    const existingSlugs = new Set((existing || []).map((p: any) => p.slug));

    // Pick a topic that hasn't been used yet
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const availableTopics = BLOG_TOPICS.filter(t => {
      const dated = `${t.slug}-${dateStr}`;
      return !existingSlugs.has(dated);
    });

    if (availableTopics.length === 0) {
      return new Response(JSON.stringify({ message: "All topics used for today" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rotate through topics based on day count
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const topic = availableTopics[dayOfYear % availableTopics.length];
    const slug = `${topic.slug}-${dateStr}`;

    // Generate blog content with AI
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
            content: `You are a streetwear fashion editorial writer for DRIPWAY, a curated streetwear discovery platform featuring brands like Drip by Rage, SABR Clothing, Touro Studio, Kogi Collective, Preview Worldwide, Dimito, Dovira, and Christopher Noir. Write in an engaging, knowledgeable, slightly edgy tone — like a streetwear insider who genuinely cares about the culture. Use SEO-friendly language naturally. Never sound robotic or generic.`
          },
          {
            role: "user",
            content: `Write a blog post titled "${topic.title}".

Requirements:
- Write exactly 4 paragraphs, each 4-6 sentences long
- Make it informative, engaging, and SEO-optimized
- Naturally mention brands available on DRIPWAY when relevant (Drip by Rage, SABR Clothing, Touro Studio, Kogi Collective, Preview Worldwide, Dimito, Dovira)
- Include the discount code DRIPWAYAPPAREL for 10% off at Drip by Rage when mentioning that brand
- Write a compelling 1-2 sentence excerpt/summary

Format your response as JSON with this structure:
{
  "excerpt": "...",
  "paragraph1": "...",
  "paragraph2": "...",
  "paragraph3": "...",
  "paragraph4": "..."
}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_blog_post",
              description: "Create a structured blog post with excerpt and 4 paragraphs",
              parameters: {
                type: "object",
                properties: {
                  excerpt: { type: "string", description: "1-2 sentence compelling summary" },
                  paragraph1: { type: "string", description: "First paragraph" },
                  paragraph2: { type: "string", description: "Second paragraph" },
                  paragraph3: { type: "string", description: "Third paragraph" },
                  paragraph4: { type: "string", description: "Fourth paragraph" }
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
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
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
      // Fallback: try parsing the content directly
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }
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
          messages: [
            {
              role: "user",
              content: `Create a stylish, editorial-quality fashion photography image for a streetwear blog post titled "${topic.title}". The image should look like a high-end fashion magazine cover photo with moody lighting, urban backdrop, and contemporary streetwear styling. No text or watermarks. Cinematic color grading.`
            }
          ],
          modalities: ["image", "text"],
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const imageBase64 = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (imageBase64) {
          // Upload to Supabase Storage
          const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          const filePath = `blog-covers/${slug}.png`;
          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(filePath, imageBytes, { contentType: "image/png", upsert: true });
          
          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("blog-images")
              .getPublicUrl(filePath);
            coverImageUrl = urlData.publicUrl;
          } else {
            console.error("Upload error:", uploadError);
          }
        }
      }
    } catch (imgErr) {
      console.error("Image generation error:", imgErr);
    }

    // Compose full content with paragraphs
    const fullContent = [
      blogContent.paragraph1,
      blogContent.paragraph2,
      blogContent.paragraph3,
      blogContent.paragraph4,
    ].join("\n\n");

    // Insert into database
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
        read_time: 5,
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
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
