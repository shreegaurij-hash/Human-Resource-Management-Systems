import { NextResponse } from 'next/server';
const pdfParse = require('pdf-parse');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.name.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text });
    } else if (file.name.endsWith('.txt')) {
      const text = buffer.toString('utf-8');
      return NextResponse.json({ text });
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload .pdf or .txt' }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
