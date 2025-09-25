import { NextResponse } from 'next/server';

export async function GET() {
  // Ein einfaches 1x1 transparentes ICO-Format
  const emptyFavicon = Buffer.from(
    'AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    'base64'
  );

  return new NextResponse(emptyFavicon, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
