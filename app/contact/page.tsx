'use client';

import { useState } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/95 backdrop-blur">
        <nav className="px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Jakobs Photography
          </Link>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
            <Link href="/" className="hover:text-gray-400 transition">Images</Link>
            <Link href="/about" className="hover:text-gray-400 transition">About</Link>
            <Link href="/contact" className="hover:text-gray-400 transition">Contact</Link>
          </div>
        </nav>
      </header>

      <section className="px-8 py-24 text-center border-b border-white/10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Get in Touch
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Have a project in mind or just want to say hello? I'd love to hear from you.
        </p>
      </section>

      <section className="px-8 py-20">
        <div className="max-w-xl mx-auto">
          {status === 'success' ? (
            <div className="text-center py-16 border border-white/10">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Message sent</p>
              <p className="text-2xl font-bold tracking-tight mb-6">Thank you.</p>
              <p className="text-gray-400 mb-10">I'll get back to you as soon as possible.</p>
              <button
                onClick={() => setStatus('idle')}
                className="text-xs uppercase tracking-widest text-gray-400 border-b border-gray-600 pb-0.5 hover:text-white hover:border-white transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Write your message here..."
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs uppercase tracking-widest text-red-500">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-gray-100 transition disabled:opacity-40"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 px-8 py-12 text-center text-sm text-gray-500">
        <p>&copy; 2026 Maretyui. All rights reserved.</p>
        <br />
        <Link href="/admin/login" className="underline hover:text-gray-400 transition">Login</Link>
      </footer>
    </div>
  );
}
