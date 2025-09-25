import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { year, gallery, filename } = await req.json();
    const res = await fetch("https://tonbandleipzig.de/tonband/api/delete_image.php", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-API-TOKEN": process.env.NEXT_PUBLIC_TONBAND_API_TOKEN || "mysecrettoken"
      },
      body: JSON.stringify({ year, gallery, filename }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return NextResponse.json({ error: data.error || "Fehler beim Löschen" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
