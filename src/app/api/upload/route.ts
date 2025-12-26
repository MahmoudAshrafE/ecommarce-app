import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Missing Cloudinary configuration environment variables");
            return NextResponse.json({ error: "Cloudinary configuration missing" }, { status: 500 });
        }

        const secret = process.env.CLOUDINARY_API_SECRET;
        console.log(`Cloudinary Secret Debug - Length: ${secret.length}, Starts with: ${secret.substring(0, 2)}, Ends with: ${secret.substring(secret.length - 2)}`);

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("Starting Cloudinary upload for file:", file.name);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a Promise to handle the stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "ecommerce-app",
                    resource_type: "auto",
                    use_filename: true,
                    unique_filename: true,
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload stream error:", error);
                        reject(error);
                    }
                    else {
                        console.log("Cloudinary upload success");
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        // @ts-ignore
        const imageUrl = result.secure_url;
        console.log("File uploaded successfully to:", imageUrl);

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error("Upload API route error:", error);
        const errorMessage = error.message || (typeof error === 'string' ? error : JSON.stringify(error)) || "Unknown error";
        return NextResponse.json({
            error: "Upload failed: " + errorMessage
        }, { status: 500 });
    }
}
