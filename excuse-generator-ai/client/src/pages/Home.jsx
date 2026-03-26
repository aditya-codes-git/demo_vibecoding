import { useState, useEffect } from 'react';
import AuthButton from '../components/AuthButton';
import InputBox from '../components/InputBox';
import ModeSelector from '../components/ModeSelector';
import OutputCard from '../components/OutputCard';
import Loader from '../components/Loader';
import CinematicHero from '../components/CinematicHero';
import { onAuthStateChange, getCurrentUser } from '../services/auth';
import { getExcuse } from '../services/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [situation, setSituation] = useState('');
  const [mode, setMode] = useState('normal');
  const [excuse, setExcuse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthLoading(false);
    });

    const subscription = onAuthStateChange((u) => {
      setUser(u);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setExcuse('');
    setError('');

    try {
      const result = await getExcuse(user.id, situation.trim(), mode);
      setExcuse(result);
    } catch (err) {
      console.error('Error generating excuse:', err);
      setError(err.message || 'Failed to generate excuse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full min-h-screen" style={{ background: '#080e1c' }}>
      {/* Cinematic Hero Section */}
      <CinematicHero />

      {/* Generator Section */}
      <section id="generator" className="app-container" style={{ minHeight: '100vh' }}>
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">💡</span>
              Excuse Generator AI
            </h1>
            <AuthButton user={user} />
          </div>
        </header>

        <main className="main-content">
          {user ? (
            <div className="generator-card">
              <h2 className="welcome-title">The Observatory</h2>
              <p className="generator-subtitle">
                Input your situation and choose a mode. Our synthesis engine
                will craft the perfect excuse for you.
              </p>

              <InputBox
                value={situation}
                onChange={setSituation}
                disabled={loading}
              />

              <ModeSelector mode={mode} onSelect={setMode} />

              <button
                id="generate-btn"
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading || !situation.trim()}
              >
                {loading ? 'Synthesizing…' : 'Generate Excuse'}
              </button>

              {loading && <Loader />}
              {error && <p className="error-text">{error}</p>}
              <OutputCard excuse={excuse} mode={mode} />
            </div>
          ) : (
            <div className="welcome-card">
              <div className="welcome-emoji">🌌</div>
              <h2 className="welcome-title">Enter The Neon Observatory</h2>
              <p className="welcome-text">
                In an era of flat AI, we choose experience. Sign in to access
                cinematic, storytelling-style excuses for the modern world.
              </p>
              <AuthButton user={user} />
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Built with React, Supabase & Gemini AI</p>
        </footer>
      </section>
    </div>
  );
}
