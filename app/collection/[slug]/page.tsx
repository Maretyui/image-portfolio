'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PortfolioImage {
  id: number;
  collection_id: number;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  display_order: number;
  width_span: number;
  height_span: number;
}

interface Collection {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  display_order: number;
}

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionRes, imagesRes] = await Promise.all([
          fetch(`/api/collections/${slug}`),
          fetch(`/api/collections/${slug}/images`),
        ]);

        if (!collectionRes.ok) {
          throw new Error('Collection not found');
        }

        const collectionData = await collectionRes.json();
        const imagesData = await imagesRes.json();

        setCollection(collectionData);
        setImages(imagesData);
      } catch (error) {
        console.error('Failed to fetch collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
        <Link href="/" className="text-gray-400 hover:text-white transition">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/95 backdrop-blur">
        <nav className="px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            JAKOB BILDER
          </Link>
          <Link
            href="/"
            className="text-sm uppercase tracking-wider text-gray-400 hover:text-white transition"
          >
            Back
          </Link>
        </nav>
      </header>

      <section className="px-8 py-16 border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-gray-400 text-lg max-w-3xl">
            {collection.description}
          </p>
        )}
      </section>

      <section className="px-8 py-16">
        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images in this collection yet</p>
          </div>
        ) : (
          <div className="grid gap-6" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gridAutoRows: 'auto',
          }}>
            {images.map((image) => {
              const colSpan = image.width_span || 1;
              const rowSpan = image.height_span || 1;

              return (
                <div
                  key={image.id}
                  className="overflow-hidden border border-white/10 hover:border-white/30 transition cursor-pointer group"
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  <div className="relative w-full h-full bg-gray-900 overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Portfolio image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {image.title && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end">
                        <div className="w-full p-4 text-white opacity-0 group-hover:opacity-100 transition">
                          <p className="text-sm font-medium">{image.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-8 py-12 text-center text-sm text-gray-500">
        <p>&copy; 2024 Jakob Bilder. All rights reserved.</p>
      </footer>
    </div>
  );
}
