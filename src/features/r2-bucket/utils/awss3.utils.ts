import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_S3_API_URL ?? "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadFileToS3(params: {
  file: File;
  prefix: string;
  filename: string;
}) {
  const filebuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(filebuffer);
  const fileExtension = params.filename.split(".").pop();
  const uniqueFilename = `${params.prefix}/${params.filename}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
    Key: uniqueFilename,
    Body: buffer,
    ContentType: params.file.type,
  });

  try {
    await s3Client.send(command);

    return {
      url: `${process.env.R2_URL}/${process.env.AWS_S3_BUCKET_NAME}/${uniqueFilename}`,
    };
  } catch (error) {
    throw error;
  }
}
