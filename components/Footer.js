export default function Footer() {
    return (
      <footer className="bg-luxury-black text-white/50 text-xs border-t border-white/10 font-sans">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-sm uppercase tracking-[0.3em] font-bold mb-4">AURA LUXURY</h3>
            <p className="leading-relaxed text-white/40">The pinnacle of premium craftsmanship. Delivering uncompromised elegance to the modern connoisseur.</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest font-semibold mb-4">Collections</h4>
            <ul className="space-y-2 uppercase text-[10px] tracking-wider">
              <li><a href="/shop" className="hover:text-luxury-gold">Timepieces</a></li>
              <li><a href="/shop" className="hover:text-luxury-gold">Artisanal Bags</a></li>
              <li><a href="/shop" className="hover:text-luxury-gold">Haute Couture</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest font-semibold mb-4">Assistance</h4>
            <ul className="space-y-2 uppercase text-[10px] tracking-wider">
              <li><a href="#" className="hover:text-luxury-gold">Private Concierge</a></li>
              <li><a href="#" className="hover:text-luxury-gold">Premium Shipping</a></li>
              <li><a href="#" className="hover:text-luxury-gold">Returns Matrix</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest font-semibold mb-4">Mailing Club</h4>
            <p className="mb-4 text-white/40">Subscribe to receive private seasonal invitations.</p>
            <div className="flex border-b border-white/20 pb-1">
              <input type="email" placeholder="ENTER EMAIL..." className="bg-transparent text-white focus:outline-none w-full text-[11px]" />
              <button className="text-white uppercase tracking-widest text-[10px] font-bold ml-2">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 text-center text-[10px] uppercase tracking-widest text-white/30">
          © 2026 Aura Luxury Store. All rights reserved. Made for the US Market.
        </div>
      </footer>
    );
  }
  