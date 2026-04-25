'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/95 backdrop-blur">
        <nav className="px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Jakobs Photography
          </Link>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
            <Link href="./" className="hover:text-gray-400 transition">Images</Link>
            <Link href="./about" className="hover:text-gray-400 transition">About</Link>
            <Link href="./contact" className="hover:text-gray-400 transition">Contact</Link>
          </div>
        </nav>
      </header>

      <section className="px-8 py-24 text-center border-b border-white/10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          About Me
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          welcome to my collection of photographs.
        </p>
      </section>

      <section className="w-full">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Who I Am</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto border-b border-white/10 pb-12">
            Im Jakob and I am a hobby photographer based in Hamburg, Germany. I have a passion for capturing the beauty of the world around me through my camera lens. My photography style is a mix of landscape, portrait, and street photography, and I love experimenting with different techniques and perspectives to create unique and compelling images.
          </p>
          <h2 className="text-3xl font-bold mt-12 mb-4">My Journey</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto border-b border-white/10 pb-12">
            My journey in photography started as a simple hobby, but it quickly evolved into a deep passion. Over the years, I have had the opportunity to explore various locations and subjects, each contributing to my growth as a photographer.
          </p>
          <h2 className="text-3xl font-bold mt-12 mb-4">What I Do</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            I specialize in capturing the essence of moments, whether it's the serene beauty of a landscape, the candid emotions of a street scene, or the intimate connection in a portrait. My goal is to create images that resonate with viewers and evoke emotions.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-8 py-12 text-center text-sm text-gray-500">
        <p>&copy; 2026 Maretyui. All rights reserved.</p>
        <br /> <Link href="admin/login" className="underline hover:text-gray-400 transition">Login</Link>
      </footer>
    </div>
  );
}
