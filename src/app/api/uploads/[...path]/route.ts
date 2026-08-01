import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/services/storage.service";
import mime from "mime";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const filePath = (await params).path.join("/");

  try {
    const bytes = await StorageService.getBytes(filePath);
    const ext = path.extname(filePath);
    const contentType = mime.getType(ext) || "application/octet-stream";

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
