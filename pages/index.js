import React from 'react';
import Head from 'next/head';

// J'ai supprimé l'import de '../gitup-dashboard' qui faisait planter le build

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.6', padding: '20px', textAlign: 'center' }}>
      <Head>
        <title>GitUp - Dashboard</title>
        <meta name="description" content="Mon projet GitUp sur Vercel" />
      </Head>

      <main>
        <h1>Bienvenue sur GitUp 🚀</h1>
        <p>
          Le déploiement fonctionne maintenant ! 
        </p>
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eaeaea', borderRadius: '10px' }}>
          <h2>Dashboard</h2>
          <p>Ton projet est prêt à être développé.</p>
        </div>
      </main>

      <footer style={{ marginTop: '50px', color: '#666' }}>
        <p>© 2024 GitUp Project</p>
      </footer>
    </div>
  );
}
