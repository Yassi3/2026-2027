import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  Grid,
  KeyRound,
  ShoppingCart,
  User
} from 'lucide-react';

export const MobileNavBar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    vaultItems,
    setIsVaultOpen,
    setIsAccountOpen,
    setSelectedCategory,
    setSelectedPlatform
  } = useStore();

  const handleHome = () => {
    setSelectedCategory('all');
    setSelectedPlatform('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-4 py-2 flex items-center justify-around">
      <button
        onClick={handleHome}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
      >
        <Home className="w-5 h-5 text-indigo-400" />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button
        onClick={handleExplore}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
      >
        <Grid className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] font-medium">Catalog</span>
      </button>

      <button
        onClick={() => setIsVaultOpen(true)}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors relative"
      >
        <KeyRound className="w-5 h-5 text-cyan-400" />
        <span className="text-[10px] font-medium">Vault</span>
        {vaultItems.length > 0 && (
          <span className="absolute -top-1 right-1 flex items-center justify-center w-4 h-4 bg-cyan-500 text-slate-950 font-black text-[9px] rounded-full">
            {vaultItems.length}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors relative"
      >
        <ShoppingCart className="w-5 h-5 text-indigo-400" />
        <span className="text-[10px] font-medium">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 right-1 flex items-center justify-center w-4 h-4 bg-indigo-500 text-white font-black text-[9px] rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsAccountOpen(true)}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
      >
        <User className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] font-medium">Account</span>
      </button>
    </div>
  );
};
