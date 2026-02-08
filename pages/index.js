import React, { useState } from 'react';
import Head from 'next/head';
import { Layout, Rocket, Shield, Users, Search, PlusCircle, Github, ExternalLink, Heart } from 'lucide-react';

export default function GitUpHome() {
  const [activeTab, setActiveTab] = useState('explore');

  const projects = [
    { id: 1, name: "Discord-Manager-Pro", author: "Roofly", tags: ["Bot", "JS"], likes: 42, color: "from-cyan-500 to-blue-500" },
    { id: 2, name: "Cyber-UI-Kit", author: "AlexDev", tags: ["Web", "React"], likes: 128, color: "from-purple-500 to-pink-500" },
    { id: 3, name: "Auto-Deploy-CLI", author: "GitUpUser", tags: ["Tool", "Python"], likes: 15, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b10] text-gray-100 selection:bg-cyan-500/30">
      <Head>
        <title>GitUp v3 | Hub Communautaire</title>
      </Head>

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Rocket size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              GITUP <span className="text-cyan-400">V3</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {['Explore', 'Community', 'Docs'].map((item) => (
              <a key={item} className="hover:text-cyan-400 transition-colors cursor-pointer">{item}</a>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95">
            <Shield size={18} />
            <span>Login with Discord</span>
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          BUILD. SHARE. <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">CREATE.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
          La plateforme ultime de partage de projets liée à ton serveur Discord.
          Utilise <code className="text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">/gen</code> pour nous rejoindre.
        </p>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un projet, un auteur..." 
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-lg shadow-inner"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Projets Uploadés', value: '1,284', icon: Layout, color: 'text-cyan-400' },
            { label: 'Membres Actifs', value: '856', icon: Users, color: 'text-purple-400' },
            { label: 'Liaisons Discord', value: '100%', icon: Shield, color: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <stat.icon className={`${stat.color} mb-3`} size={24} />
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="text-cyan-400" /> Projets Récents
          </h2>
          <button className="text-sm text-cyan-400 hover:underline">Voir tout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p.id} className="group relative bg-[#11131f] border border-white/5 rounded-3xl p-6 hover:bg-[#161925] transition-all hover:-translate-y-2">
              <div className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${p.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded-md text-gray-400 uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-pink-500 font-medium">
                  <Heart size={14} fill="currentColor" /> {p.likes}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-6">by @{p.author}</p>

              <div className="flex gap-3">
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
                  <Github size={16} /> Code
                </button>
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-lg shadow-cyan-900/20">
                  <ExternalLink size={16} /> Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 text-center text-gray-600 text-sm">
        <p>© 2026 GitUp Platform. Powered by Discord.</p>
      </footer>
    </div>
  );
}
