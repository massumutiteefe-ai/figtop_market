'use client';
import React, { useState, useEffect } from 'react';

interface MediaData {
  type: 'video' | 'image' | 'none';
  url: string;
}

export default function PromoVideo() {
  const [media, setMedia] = useState<MediaData>({ type: 'none', url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Queries your automated api router check on page load mounting 
    fetch('/api/get-latest-ad')
      .then((res) => res.json())
      .then((data: MediaData) => {
        setMedia(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to automatically detect media assets:", err);
        setLoading(false);
      });
  }, []);

  if (loading || media.type === 'none') {
    return null; // Gracefully hides the component frame entirely if no assets exist yet
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-[#0b0f19] flex justify-center items-center w-full">
      <div className="w-full max-w-3xl relative rounded-xl border border-gray-800/60 bg-[#111827]/20 p-1 backdrop-blur-sm shadow-xl">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
          
          {/* Automated structural switching logic accepting any item dynamic type configuration */}
          {media.type === 'video' ? (
            <video 
              src={media.url}
              className="w-full h-full object-cover"
              controls
              playsInline
              autoPlay
              muted
            />
          ) : (
            <img 
              src={media.url} 
              alt="Digital Figtop Dynamically Generated Content Showcase"
              className="w-full h-full object-cover"
            />
          )}

        </div>
      </div>
    </section>
  );
}