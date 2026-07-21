import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// Weekly Heat Check newsletter sender.
// Triggered by pg_cron every Monday at 12:00 UTC. Also supports manual runs.
// Picks the same weekly product set as /collections (seeded by current Monday date),
// then enqueues a personalized "weekly-heat-check" email for every active subscriber.

function getCurrentMonday(): Date {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff))
  return monday
}

function seedFromDate(d: Date): number {
  return Number(`${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`)
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed)
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function formatPrice(price: number | null | undefined, currency: string | null | undefined): string {
  if (typeof price !== 'number') return ''
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'
  return `${symbol}${price.toFixed(2)}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const monday = getCurrentMonday()
    const seed = seedFromDate(monday)
    const weekLabel = `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`

    // Pick this week's Heat Check from scraped_products (rich metadata).
    const { data: products, error: prodError } = await supabase
      .from('scraped_products')
      .select('name, brand_name, price, currency, image, affiliate_url')
      .not('image', 'is', null)
      .not('affiliate_url', 'is', null)

    if (prodError) throw prodError

    const shuffled = seededShuffle(products || [], seed)
    // 1 per brand for variety, cap at 8 picks.
    const seenBrands = new Set<string>()
    const picks: any[] = []
    for (const p of shuffled) {
      const key = p.brand_name || ''
      if (seenBrands.has(key)) continue
      seenBrands.add(key)
      picks.push({
        name: p.name,
        brandName: p.brand_name,
        price: formatPrice(p.price as any, p.currency as any),
        image: p.image,
        url: p.affiliate_url,
      })
      if (picks.length >= 8) break
    }

    if (picks.length === 0) {
      return new Response(JSON.stringify({ error: 'No products available for this week' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch active subscribers.
    const { data: subs, error: subsError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .is('unsubscribed_at', null)

    if (subsError) throw subsError

    const weekKey = `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, '0')}-${String(monday.getUTCDate()).padStart(2, '0')}`

    let sent = 0
    let failed = 0
    for (const s of subs || []) {
      const { error: invokeError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'weekly-heat-check',
          recipientEmail: s.email,
          idempotencyKey: `heat-check-${weekKey}-${s.email}`,
          templateData: { weekLabel, picks },
        },
      })
      if (invokeError) {
        failed++
        console.error('send failed', s.email, invokeError)
      } else {
        sent++
      }
    }

    return new Response(
      JSON.stringify({ success: true, week: weekKey, picks: picks.length, subscribers: subs?.length ?? 0, sent, failed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    console.error('send-weekly-heat-check error', e)
    const message = e instanceof Error ? e.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})