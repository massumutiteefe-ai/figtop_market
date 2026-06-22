import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDirectory = path.join(process.cwd(), 'public');
    const files = fs.readdirSync(publicDirectory);

    // Look for common media files dropped inside your public/ folder
    const targetFile = files.find(file => 
      file.toLowerCase().endsWith('.mp4') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.webp')
    );

    if (!targetFile) {
      return NextResponse.json({ type: 'none', url: '' });
    }

    const isVideo = targetFile.toLowerCase().endsWith('.mp4');
    
    return NextResponse.json({
      type: isVideo ? 'video' : 'image',
      url: `/${targetFile}`
    });
  } catch (error) {
    return NextResponse.json({ type: 'none', url: '' }, { status: 500 });
  }
}