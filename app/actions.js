"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateCity(city) {
    const cookieStore = await cookies();
    // city can be a string or an object { lat, lon }
    // We should stringify it if it's an object
    const value = typeof city === 'object' ? JSON.stringify(city) : city;
    cookieStore.set("city", value);
    revalidatePath("/");
}

export async function updateUnit(unit) {
    const cookieStore = await cookies();
    cookieStore.set("units", unit);
    revalidatePath("/");
}
