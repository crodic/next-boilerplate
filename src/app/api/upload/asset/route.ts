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
  const folder = (formData.get("folder") as string | null) || "assets";

  if (!file) {
    return new NextResponse("No file provided", { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const ext = path.extname(file.name) || ".png";
    const filename = `${folder}/${crypto.randomBytes(8).toString("hex")}${ext}`;

    const url = await StorageService.saveFile(filename, buffer, file.type);
    return NextResponse.json({ url });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
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

    await StorageService.deleteFile(url);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
