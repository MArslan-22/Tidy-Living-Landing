'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import legacyPins from '../config/legacy_pins.json';

// Type definition for legacy pin data
type LegacyPin = {
  img: string;
  price: string;
  rating: string;
  name: string;
};

// Component to handle search params (must be inside Suspense)
function ProductBridge() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState({
    name: 'Loading Product...',
    img: '',
    price: '$0.00',
    rating: '5.0',
    asin: '',
    tag: 'tidylivingc0e-20',
    found: false
  });

  useEffect(() => {
    const asin = searchParams.get('asin');
    const nameParam = searchParams.get('name');
    const imgParam = searchParams.get('img');
    const priceParam = searchParams.get('price');
    const ratingParam = searchParams.get('rating');
    const tagParam = searchParams.get('tag') || 'tidylivingc0e-20';

    if (asin) {
      let finalName = 'Your Selected Home Find';
      let finalImg = '';
      let finalPrice = '';
      let finalRating = '';

      // Try to get from legacy map first
      const legacyData = (legacyPins as Record<string, LegacyPin>)[asin];

      if (legacyData) {
        finalName = legacyData.name || finalName;
        finalImg = legacyData.img;
        finalPrice = legacyData.price;
        finalRating = legacyData.rating;
      }

      // Override with URL params if present
      if (nameParam) finalName = decodeURIComponent(nameParam.replace(/\+/g, ' '));
      if (imgParam) finalImg = decodeURIComponent(imgParam);
      if (priceParam && priceParam !== 'nan' && priceParam !== 'N/A') finalPrice = decodeURIComponent(priceParam);
      if (ratingParam && ratingParam !== 'nan' && ratingParam !== 'N/A') finalRating = ratingParam;

      setProduct({
        name: finalName,
        img: finalImg,
        price: finalPrice,
        rating: finalRating,
        asin,
        tag: tagParam,
        found: true
      });
    }
  }, [searchParams]);

  if (!product.found) return null;

  return (
    <div className="bridge-card glass-panel p-8 rounded-2xl max-w-md w-full mx-auto text-center animate-fade-in relative z-10">
      <div className="bridge-image-container mb-6 relative w-64 h-64 mx-auto rounded-xl overflow-hidden shadow-lg">
        {product.img && (
          <Image
            src={product.img}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105 duration-700"
            unoptimized // Allow external images from Amazon
          />
        )}
      </div>

      <div className="bridge-content space-y-4">
        <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">You're one step away from:</p>
        <h2 className="text-2xl font-semibold text-gray-800 leading-tight">{product.name}</h2>

        <div className="flex justify-center gap-3 items-center">
          {product.price && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 shadow-sm">
              {product.price}
            </span>
          )}
          {product.rating && (
            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 shadow-sm">
              ⭐ {Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>

        <a
          href={`https://www.amazon.com/dp/${product.asin}?tag=${product.tag}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn block w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95"
        >
          Shop on Amazon
        </a>
        <p className="text-xs text-gray-400 mt-4">Redirecting you to the official Amazon store.</p>
      </div>
    </div>
  );
}

// Links Component
function StandardLinks({ show }: { show: boolean }) {
  if (!show) return null;

  const links = [
    { href: "https://www.amazon.com/hz/wishlist/ls/3J69E22OXPF7A?ref_=wl_share", icon: "✨", label: "Amazon Home Finds" },
    { href: "https://www.amazon.com/hz/wishlist/ls/1VSMUN51KT9NA?ref_=wl_share", icon: "🍽️", label: "Kitchen Storage Ideas" },
    { href: "https://www.amazon.com/hz/wishlist/ls/1LDZPGUUP9YMV?ref_=wl_share", icon: "🛁", label: "Bathroom Storage Solutions" },
    { href: "https://www.amazon.com/hz/wishlist/ls/3M6C3T4LT1CUK?ref_=wl_share", icon: "👗", label: "Closet Organization Hacks" },
    { href: "https://www.amazon.com/hz/wishlist/ls/1KEGJ2D7X05IJ?ref_=wl_share", icon: "🏠", label: "Small Home Organization" },
    { href: "/blog/closet-organizers-small-apartments", icon: "📝", label: "Read: Closet Organization Guide" } // New Blog Link
  ];

  return (
    <div className="links-container space-y-4 max-w-md mx-auto w-full z-10 relative">
      {links.map((link, idx) => (
        <Link
          key={idx}
          href={link.href}
          target={link.href.startsWith('http') ? "_blank" : "_self"}
          className="glass-btn flex items-center p-4 rounded-xl hover:bg-white/40 transition group"
        >
          <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">{link.icon}</span>
          <span className="font-medium text-gray-700">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  // We check for search params in the wrapper to decide layout
  // But since we can't condition on hooks easily in server components (or mixed), 
  // we'll let the client component handle the "Bridge Mode" vs "Link Mode" visual toggle.
  // Actually, standard practice: render both, let CSS/State hide one.

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <header className="profile-header text-center mb-8 z-10">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <Image
            src="/assets/cover.png"
            alt="Tidy Living Aesthetic"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="profile-info">
          <Image src="/assets/logo.png" alt="Tidy Living Co" width={200} height={60} className="mx-auto mb-2 opacity-90" />
          <p className="text-gray-600 font-light italic">Curating the chaotic. Making home your favorite place.</p>
        </div>
      </header>

      <Suspense fallback={<div className="text-center p-10"><div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto"></div></div>}>
        <SearchWrapper />
      </Suspense>

      <footer className="mt-12 text-center text-gray-400 text-sm z-10">
        <div className="flex justify-center gap-4 mb-4">
          <a href="https://pinterest.com/tidylivingco" target="_blank" aria-label="Pinterest" className="hover:text-red-500 transition-colors">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0"></path>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="M4.9 4.9l1.4 1.4"></path>
              <path d="M17.7 17.7l1.4 1.4"></path>
              <path d="M19.1 4.9l-1.4 1.4"></path>
              <path d="M6.3 17.7l-1.4 1.4"></path>
            </svg>
          </a>
        </div>
        <p className="mb-2">As an Amazon Associate I earn from qualifying purchases.</p>
        <p>&copy; 2026 Tidy Living Co.</p>
      </footer>
    </main>
  );
}

// Wrapper to handle state lifting
function SearchWrapper() {
  const searchParams = useSearchParams();
  const hasAsin = searchParams.has('asin');

  return (
    <>
      {hasAsin ? <ProductBridge /> : <StandardLinks show={true} />}
      {hasAsin && (
        <button
          onClick={() => window.history.pushState({}, '', '/')}
          className="mt-6 text-gray-500 hover:text-gray-800 underline text-sm z-10 cursor-pointer"
        >
          View All Finds
        </button>
      )}
    </>
  );
}
