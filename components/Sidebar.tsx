import React from 'react';
import { NavItem, AppView } from '../types';
import { NAV_ITEMS, PROFILE_IMAGE } from '../constants';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="hidden md:flex flex-col w-72 h-full p-4 shrink-0">
      <div className="flex flex-col h-full bg-surface-dark rounded-2xl p-6 shadow-2xl border border-white/5 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

        {/* Profile / Brand */}
        <div className="flex items-center gap-4 mb-10 z-10">
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
        <div className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
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
        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={() => onNavigate(AppView.SETTINGS)}
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
    </nav>
  );
};