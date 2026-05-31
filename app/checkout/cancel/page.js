import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-6 font-sans text-white">
      <div className="bg-luxury-charcoal p-8 border border-white/5 space-y-6 flex flex-col items-center">
        <XCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl uppercase tracking-[0.2em] font-light">Transaction Halted</h1>
        <p className="text-xs text-white/60 leading-relaxed font-light">
          The processing signature loop was interrupted. No institutional financial charges were processed.
        </p>
        <Link href="/checkout" className="inline-block bg-white text-luxury-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors">
          Return To Cart Review
        </Link>
      </div>
    </div>
  );
}
