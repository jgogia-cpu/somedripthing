const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cache rates for 1 hour in memory
let cachedRates: Record<string, number> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = Date.now();

    // Return cached rates if fresh
    if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
      return new Response(JSON.stringify({ success: true, rates: cachedRates }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch live rates from free API (no key needed)
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error('Exchange rate API returned unsuccessful result');
    }

    // Extract only the currencies we need
    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'NGN'];
    const rates: Record<string, number> = {};
    for (const code of currencies) {
      rates[code] = data.rates[code] ?? 1;
    }

    // Cache the result
    cachedRates = rates;
    cacheTimestamp = now;

    console.log('Fetched live exchange rates:', rates);

    return new Response(JSON.stringify({ success: true, rates }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Exchange rate error:', error);
    
    // Fallback rates if API fails
    const fallbackRates = {
      USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.55, JPY: 150.5, NGN: 1550
    };

    return new Response(JSON.stringify({ success: true, rates: fallbackRates, fallback: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
