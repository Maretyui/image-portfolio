'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface PortfolioImage {
  id: number;
  title: string | null;
  image_url: string;
  width_span: number;
  height_span: number;
}

export default function HomePage() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const onKey = (a: KeyboardEvent) => {
      if (a.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeLightbox]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/95 backdrop-blur">
        <nav className="px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            JAKOBs PHOTOGRPHIE
          </Link>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
            <Link href="#" className="hover:text-gray-400 transition">Images</Link>
            <Link href="#" className="hover:text-gray-400 transition">About</Link>
            <Link href="#" className="hover:text-gray-400 transition">Contact</Link>
          </div>
        </nav>
      </header>

      <section className="px-8 py-24 text-center border-b border-white/10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          PHOTOGRAPHER BASED IN GERMANY
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Just hanging out at the moment
        </p>
      </section>

      <section className="w-full">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-600 text-sm uppercase tracking-widest">No images yet</p>
          </div>
        ) : (
          <div
            className="columns-3 px-8"
            style={{ columnGap: '8px' }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="break-inside-avoid cursor-pointer group relative"
                style={{ marginBottom: '8px' }}
                onClick={() => setLightbox(image)}
              >
                <img
                  src={image.image_url}
                  alt={image.title || ''}
                  className="w-full block"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-8 py-12 text-center text-sm text-gray-500">
        <p>&copy; 2026 Maretyui. All rights reserved.</p>
        <br /> <Link href="admin/login" className="underline hover:text-gray-400 transition">Login</Link>
      </footer>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center p-6 md:p-12"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-6 text-white/50 hover:text-white text-3xl leading-none transition"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={lightbox.image_url}
            alt={lightbox.title || ''}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.title && (
            <p className="mt-5 text-white/60 text-sm tracking-widest uppercase">
              {lightbox.title}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
