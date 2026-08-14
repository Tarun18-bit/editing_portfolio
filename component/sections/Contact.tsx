"use client";

import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-28 md:px-12">
      <div className="w-full max-w-4xl rounded-3xl border border-cyan-500/30 bg-slate-950/85 p-8 md:p-14 shadow-[0_0_100px_rgba(0,180,240,0.2)] backdrop-blur-xl">
        
        {/* Expedition End Header */}
        <div className="text-center">
          <span className="font-mono text-xs font-semibold tracking-[0.4em] text-cyan-400 uppercase">
            SECTOR 06 // OCEAN FLOOR (11,000M)
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-light text-white tracking-tight">
            EXPEDITION COMPLETE
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base font-light text-slate-300 leading-relaxed">
            You have reached the deepest point of the portfolio. Let’s collaborate on your next high-impact video edit or motion project.
          </p>
        </div>

        {/* Contact Form / Success Message */}
        {submitted ? (
          <div className="mt-10 rounded-2xl border border-cyan-400/40 bg-cyan-950/40 p-8 text-center">
            <span className="text-3xl">📡</span>
            <h3 className="mt-3 text-xl font-medium text-cyan-200">TRANSMISSION RECEIVED</h3>
            <p className="mt-2 text-sm text-slate-300">
              Thank you for reaching out. I will respond to your message shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-xs text-cyan-300 uppercase tracking-widest block mb-2">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-cyan-300 uppercase tracking-widest block mb-2">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-cyan-300 uppercase tracking-widest block mb-2">
                PROJECT DETAILS
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your video edit or timeline goals..."
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-3 rounded-full border border-cyan-400/50 bg-cyan-950/60 py-4 font-mono text-xs font-bold tracking-[0.4em] text-white uppercase backdrop-blur-md transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]"
            >
              SEND TRANSMISSION
            </button>
          </form>
        )}

        {/* Social Links Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-between border-t border-white/10 pt-8 font-mono text-xs text-slate-400">
          <span>TARUN // VIDEO EDITOR & MOTION DESIGNER</span>
          <div className="flex gap-6">
            <a href="mailto:contact@example.com" className="hover:text-cyan-300 transition-colors">EMAIL</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">TWITTER / X</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">LINKEDIN</a>
          </div>
        </div>

      </div>
    </section>
  );
}
