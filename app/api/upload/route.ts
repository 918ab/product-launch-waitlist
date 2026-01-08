import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { list } from '@vercel/blob'; 
import { NextResponse } from 'next/server';

// 1. 업로드 토큰 발급 (POST)
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['application/pdf', 'image/jpeg', 'image/png'], 
          
          addRandomSuffix: false, 
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('업로드 완료:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'No filename' }, { status: 400 });
  }

  const extIndex = filename.lastIndexOf('.');
  const namePart = extIndex !== -1 ? filename.substring(0, extIndex) : filename;
  const extPart = extIndex !== -1 ? filename.substring(extIndex) : '';

  const { blobs } = await list({ prefix: namePart, limit: 100 });
  
  let finalName = filename;
  let counter = 1;

  while (blobs.some(b => b.pathname === finalName)) {
    finalName = `${namePart} (${counter})${extPart}`;
    counter++;
  }

  return NextResponse.json({ uniqueName: finalName });
}