"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSiteContent } from "../actions/admin";

// Available Google Fonts with their URLs
const GOOGLE_FONTS: Record<string, string> = {
  'Genos': 'https://fonts.googleapis.com/css2?family=Genos:wght@300;400;500;600;700;800;900&display=swap',
  'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
  'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
  'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap',
  'Space Grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  'DM Sans': 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  'Outfit': 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap',
  'Plus Jakarta Sans': 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'Sora': 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap',
  'Urbanist': 'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800;900&display=swap',
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
  'Lora': 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
  'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
  'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap',
  'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
};

interface FontSettings {
  primary: string;
  heading: string;
  body: string;
}

interface FontContextType {
  fonts: FontSettings;
  isLoaded: boolean;
}

const defaultFonts: FontSettings = {
  primary: 'Genos',
  heading: 'Genos',
  body: 'Genos',
};

const FontContext = createContext<FontContextType>({
  fonts: defaultFonts,
  isLoaded: false,
});

export function useFonts() {
  return useContext(FontContext);
}

interface FontProviderProps {
  children: ReactNode;
}

export function FontProvider({ children }: FontProviderProps) {
  const [fonts, setFonts] = useState<FontSettings>(defaultFonts);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedFontLinks, setLoadedFontLinks] = useState<Set<string>>(new Set());

  // Load a Google Font dynamically
  const loadFont = (fontName: string) => {
    if (loadedFontLinks.has(fontName)) return;
    
    const url = GOOGLE_FONTS[fontName];
    if (!url) return;

    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) {
      setLoadedFontLinks(prev => new Set([...prev, fontName]));
      return;
    }

    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    setLoadedFontLinks(prev => new Set([...prev, fontName]));
  };

  // Load font settings from CMS on mount
  useEffect(() => {
    async function loadFontSettings() {
      try {
        const data = await getSiteContent();
        const fontData = data.filter((c: { page: string; section: string }) => 
          c.page === 'settings' && c.section === 'fonts'
        );

        if (fontData.length > 0) {
          const newFonts: FontSettings = { ...defaultFonts };
          fontData.forEach((f: { id: string; content: string }) => {
            if (f.id === 'settings.fonts.primary' && f.content) newFonts.primary = f.content;
            if (f.id === 'settings.fonts.heading' && f.content) newFonts.heading = f.content;
            if (f.id === 'settings.fonts.body' && f.content) newFonts.body = f.content;
          });
          setFonts(newFonts);

          // Load all required fonts
          loadFont(newFonts.primary);
          loadFont(newFonts.heading);
          loadFont(newFonts.body);
        } else {
          // Load default font
          loadFont('Genos');
        }
      } catch (error) {
        console.error('Failed to load font settings:', error);
        loadFont('Genos');
      }
      setIsLoaded(true);
    }

    loadFontSettings();
  }, []);

  // Apply CSS variables when fonts change
  useEffect(() => {
    if (!isLoaded) return;
    
    document.documentElement.style.setProperty('--font-primary', `"${fonts.primary}", sans-serif`);
    document.documentElement.style.setProperty('--font-heading', `"${fonts.heading}", sans-serif`);
    document.documentElement.style.setProperty('--font-body', `"${fonts.body}", sans-serif`);
  }, [fonts, isLoaded]);

  return (
    <FontContext.Provider value={{ fonts, isLoaded }}>
      {children}
    </FontContext.Provider>
  );
}

// Component to inject font styles
export function FontStyleInjector() {
  const { fonts, isLoaded } = useFonts();

  if (!isLoaded) return null;

  return (
    <style jsx global>{`
      :root {
        --font-primary: "${fonts.primary}", sans-serif;
        --font-heading: "${fonts.heading}", sans-serif;
        --font-body: "${fonts.body}", sans-serif;
      }
      
      .font-primary { font-family: var(--font-primary); }
      .font-heading { font-family: var(--font-heading); }
      .font-body { font-family: var(--font-body); }
      
      /* Override font-genos to use primary font from CMS */
      .font-genos { font-family: var(--font-primary); }
      
      /* Apply heading font to all headings */
      h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
      
      /* Apply body font to paragraphs */
      p, span, li, td, th { font-family: var(--font-body); }
      
      /* Buttons and navigation use primary */
      button, a, nav { font-family: var(--font-primary); }
    `}</style>
  );
}