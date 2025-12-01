import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import formidable, { File } from "formidable";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
    multiples: false,
  });

  try {
    const data = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { fields, files } = data;
    const file = files.image as File | undefined;

    const userIdField = fields.userId;
    const usernameField = fields.username;

    const userId = Array.isArray(userIdField) ? userIdField[0] : userIdField;
    const username = Array.isArray(usernameField)
      ? usernameField[0]
      : usernameField;

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = `/uploads/${path.basename(file.filepath)}`;
    }

    await prisma.user.update({
      where: { id: userId as string },
      data: {
        name: username as string,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update failed:", err);
    return NextResponse.json({
      success: false,
      error: "Failed to update profile",
    });
  }
}
