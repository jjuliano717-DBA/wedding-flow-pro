// Supabase Edge Function for Google Places API
// This function securely proxies requests to Google Places API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS })
    }

    try {
        const { placeId, url } = await req.json()

        if (!placeId && !url) {
            return new Response(
                JSON.stringify({ error: 'placeId or url is required' }),
                {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                }
            )
        }

        // Extract Place ID from URL if needed
        let finalPlaceId = placeId
        if (url && !placeId) {
            // For g.page URLs, we need to follow redirects
            if (url.includes('g.page') || url.includes('goo.gl')) {
                try {
                    const redirectResponse = await fetch(url, { redirect: 'follow' })
                    const finalUrl = redirectResponse.url

                    // Extract Place ID from final URL
                    const placeIdMatch = finalUrl.match(/!1s(ChIJ[^!&]+)/)
                    if (placeIdMatch) {
                        finalPlaceId = placeIdMatch[1]
                    }
                } catch (error) {
                    console.error('Error following redirect:', error)
                }
            }

            // Extract from other URL formats
            if (!finalPlaceId) {
                const urlObj = new URL(url)

                // CID format
                if (urlObj.searchParams.has('cid')) {
                    // Note: CID to Place ID conversion requires additional API call
                    // For now, return error
                    return new Response(
                        JSON.stringify({ error: 'CID format not supported. Please use full Google Maps URL or Place ID.' }),
                        {
                            status: 400,
                            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                        }
                    )
                }

                // Extract from path
                const pathMatch = url.match(/place\/([^\/]+)/)
                if (pathMatch) {
                    finalPlaceId = decodeURIComponent(pathMatch[1])
                }

                // Extract from data parameter
                const dataParam = urlObj.searchParams.get('data')
                if (dataParam) {
                    const placeIdMatch = dataParam.match(/!1s(ChIJ[^!]+)/)
                    if (placeIdMatch) {
                        finalPlaceId = placeIdMatch[1]
                    }
                }
            }
        }

        if (!finalPlaceId) {
            return new Response(
                JSON.stringify({ error: 'Could not extract Place ID from URL' }),
                {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                }
            )
        }

        // Call Google Places API
        const fields = [
            'name',
            'formatted_address',
            'address_components',
            'formatted_phone_number',
            'website',
            'rating',
            'user_ratings_total'
        ].join(',')

        const googleResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${finalPlaceId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`
        )

        const data = await googleResponse.json()

        if (data.status !== 'OK') {
            return new Response(
                JSON.stringify({ error: `Google Places API error: ${data.status}` }),
                {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                }
            )
        }

        return new Response(
            JSON.stringify(data),
            {
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            }
        )
    }
})
