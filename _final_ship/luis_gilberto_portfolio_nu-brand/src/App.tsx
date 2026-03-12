import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimaryNav } from './components/PrimaryNav';
import { HeroSection } from './components/HeroSection';
import { BannerRotator } from './components/BannerRotator';
import { QuickTourSection } from './components/QuickTourSection';
import { WhatsNextSection } from './components/WhatsNextSection';
import { TimelinePage } from './components/TimelinePage';
import { BrandGuidelinesPage } from './components/BrandGuidelinesPage';
import { BrandPage } from './components/BrandPage';
import { SystemPage } from './components/SystemPage';
import { Footer } from './components/Footer';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <PrimaryNav isDark={isDark} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={
            <main>
              <HeroSection />
              <BannerRotator />
              <QuickTourSection />
              <WhatsNextSection />
            </main>
          } />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/brand-guidelines" element={<BrandGuidelinesPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/system" element={<SystemPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
