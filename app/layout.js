import '@/styles/globals.css';

import { Inter, Playfair_Display } from 'next/font/google';

import { AppProvider } from '@/context/AppContext';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata = {
  metadataBase: new URL('https://auraluxurystore.vercel.app'),

  title: {
    default: 'Aura Luxury Store',
    template: '%s | Aura Luxury',
  },

  description:
    'Discover premium luxury fashion, designer accessories, handcrafted leather goods, and exclusive lifestyle collections curated for modern elegance.',

  keywords: [
    'luxury fashion',
    'designer accessories',
    'premium watches',
    'luxury handbags',
    'modern luxury',
    'high-end fashion',
    'USA luxury store',
  ],

  openGraph: {
    title: 'Aura Luxury Store',
    description:
      'Curated luxury collections crafted for elegance and sophistication.',

    url: 'https://auraluxurystore.vercel.app',

    siteName: 'Aura Luxury Store',

    locale: 'en_US',

    type: 'website',

    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aura Luxury Store',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Aura Luxury Store',

    description:
      'Luxury fashion and premium lifestyle collections.',

    images: ['/og-image.jpg'],
  },

  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="bg-luxury-black text-luxury-cream antialiased overflow-x-hidden selection:bg-luxury-gold selection:text-luxury-black">
        <AppProvider>
          <div className="relative min-h-screen flex flex-col bg-luxury-black">
            
            {/* Ambient luxury background glow */}
            <div className="pointer-events-none fixed inset-0 bg-luxuryRadial opacity-40 z-0" />

            {/* Main Navigation */}
            <Navbar />

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Main Content */}
            <main className="relative z-10 flex-1 pt-20">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}