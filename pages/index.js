import React, { useState, useEffect } from 'react';
import { Search, Rocket, Shield, Github, ExternalLink } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const VPS_URL = "http://88.178.167.134:1067"; 

  useEffect(() => {
    fetch(`${VPS_URL}/api/projects?q=${search}`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => console.log("VPS déconnecté"));
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white font-sans">
      <nav className="p-5 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <Rocket className="text-cyan-400" />
          <span className="font-bold text-xl">GITUP <span className="text-cyan-400">V3</span></span>
        </div>
        <button className="bg-[#5865F2] px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Shield size={18} /> Login Discord
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-10">
        <div className="relative mb-10">
          <Search className="absolute left-4 top-4 text-gray-500" />
          <input 
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-cyan-500"
            placeholder="Rechercher sur le VPS..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="bg-[#11131f] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-4">@{p.author}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white/5 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1"><Github size={14}/> Code</button>
                <button className="flex-1 bg-cyan-600 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1"><ExternalLink size={14}/> Demo</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
