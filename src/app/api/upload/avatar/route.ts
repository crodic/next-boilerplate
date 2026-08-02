import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/services/storage.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new NextResponse("No file provided", { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const ext = path.extname(file.name) || ".png";
    const filename = `avatars/${session.user.id}_${crypto.randomBytes(4).toString("hex")}${ext}`;

    const url = await StorageService.saveFile(filename, buffer, file.type);
    return NextResponse.json({ url });
  } catch (_error: any) {
    return new NextResponse(_error.message, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return new NextResponse("No URL provided", { status: 400 });
    }

    // Delegate deletion to StorageService — each driver knows how to parse its own URLs
    await StorageService.deleteFile(url);

    return NextResponse.json({ success: true });
  } catch (_error: any) {
    return new NextResponse(_error.message, { status: 500 });
  }
}
