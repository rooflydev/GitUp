import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function GitUpV3() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([
    { id: 1, name: "CyberBot", author: "Roofly", likes: 12, downloads: 45, category: "Bot" },
    { id: 2, name: "AlphaScript", author: "DevMax", likes: 8, downloads: 20, category: "Web" }
  ]);

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans">
      <Head>
        <title>GitUp v3 - Cyber Dashboard</title>
      </Head>

      {/* Navbar */}
      <nav className="border-b border-cyan-500/30 p-4 flex justify-between items-center bg-[#161925]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          GITUP v3
        </h1>
        <button className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-full font-medium transition shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          Login with Discord
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Explore & Share Projects</h2>
          <p className="text-gray-400">Le hub communautaire lié à Discord.</p>
        </header>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="flex-1 bg-[#1c2030] border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Grid Projets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-[#161925] border border-gray-800 p-5 rounded-xl hover:border-cyan-500/50 transition group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">{project.category}</span>
                <div className="flex gap-3 text-gray-500 text-sm">
                  <span>❤️ {project.likes}</span>
                  <span>📥 {project.downloads}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition">{project.name}</h3>
              <p className="text-gray-500 text-sm mb-4">By @{project.author}</p>
              <button className="w-full bg-[#1c2030] hover:bg-gray-700 py-2 rounded-lg text-sm font-semibold transition">
                View Project
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
