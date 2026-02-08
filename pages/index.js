import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Rocket, Shield, Github, ExternalLink, Heart } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // On appelle ton API interne Vercel qui fait le pont avec Altreon
        const res = await fetch(`/api/projects?q=${search}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Erreur de récupération des projets");
      } finally {
        setLoading(false);
      }
    };

    // Petit délai pour éviter de spam l'API à chaque lettre tapée
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white">
      <Head>
        <title>GitUp V3 | Dashboard</title>
      </Head>

      {/* Navbar */}
      <nav className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0a0b10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Rocket className="text-cyan-400" size={24} />
          <span className="text-xl font-black tracking-tighter">GITUP <span className="text-cyan-400">V3</span></span>
        </div>
        <button className="bg-[#5865F2] hover:bg-[#4752C4] px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95">
          <Shield size={18} /> Login Discord
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Barre de recherche */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Rechercher un projet..." 
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-cyan-500 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grille des projets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-10">Chargement des données...</div>
          ) : projects.length > 0 ? (
            projects.map((p) => (
              <div key={p.id} className="bg-[#11131f] border border-white/5 p-6 rounded-3xl hover:border-cyan-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] bg-cyan-400/10 text-cyan-400 px-2 py-1 rounded-md font-bold uppercase">En ligne</span>
                  <Heart size={18} className="text-gray-600 group-hover:text-pink-500 transition-colors cursor-pointer" />
                </div>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-6">@{p.author}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10">
                    <Github size={14} /> Code
                  </button>
                  <button className="flex-1 bg-cyan-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-cyan-500 transition-all">
                    <ExternalLink size={14} /> Demo
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/5">
              <p className="text-gray-500">Aucun projet trouvé sur le VPS Altreon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
