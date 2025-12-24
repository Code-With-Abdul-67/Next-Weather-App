import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
        return NextResponse.json({ cities: [] });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "API key not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch cities");
        }

        const data = await response.json();

        // Format cities for autocomplete
        const cities = data.map((city) => ({
            name: city.name,
            country: city.country,
            state: city.state || "",
            displayName: `${city.name}${city.state ? `, ${city.state}` : ""}, ${city.country}`,
        }));

        return NextResponse.json({ cities });
    } catch (error) {
        console.error("City search error:", error);
        return NextResponse.json(
            { error: "Failed to search cities" },
            { status: 500 }
        );
    }
}
