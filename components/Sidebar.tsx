import React, { useEffect } from 'react';
import { NavItem, AppView } from '../types';
import { NAV_ITEMS, PROFILE_IMAGE } from '../constants';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  // Close sidebar when navigating on mobile
  const handleNavigation = (view: AppView) => {
    onNavigate(view);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent backgound scroll when open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-dark rounded-2xl md:rounded-2xl p-6 shadow-2xl border-r md:border border-white/5 relative overflow-hidden w-full h-full">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      {/* Close Button Mobile */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Profile / Brand */}
      <div className="flex items-center gap-4 mb-10 z-10 mt-8 md:mt-0">
        <div className="relative group cursor-pointer">
          <div
            className="size-12 rounded-full bg-center bg-cover border-2 border-primary/30 group-hover:border-primary transition-colors duration-300"
            style={{ backgroundImage: `url('${PROFILE_IMAGE}')` }}
          ></div>
          <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-surface-dark animate-pulse-slow"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-lg font-bold tracking-tight">KikiGains</h1>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group w-full text-left
              ${currentView === item.id
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(19,236,146,0.1)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
          >
            <span className={`material-symbols-outlined transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Settings */}
      <div className="mt-auto pt-6 border-t border-white/10 shrink-0">
        <button
          onClick={() => handleNavigation(AppView.SETTINGS)}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group w-full text-left
          ${currentView === AppView.SETTINGS
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(19,236,146,0.1)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
        >
          <span className={`material-symbols-outlined transition-transform duration-500 ${currentView === AppView.SETTINGS ? 'rotate-90' : 'group-hover:rotate-90'}`}>settings</span>
          <span className="font-medium">Configuración</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Sidebar Container */}
      <nav className={`
        fixed inset-y-0 left-0 z-50 w-80 md:w-72 h-full transition-transform duration-300 ease-out md:translate-x-0 md:static md:flex md:flex-col md:p-4 shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </nav>
    </>
  );
};