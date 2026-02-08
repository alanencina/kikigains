
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatBot } from './components/ChatBot';
import { MediaAnalyzer } from './components/MediaAnalyzer';
import { TrainingView } from './components/TrainingView';
import { CommunityView } from './components/CommunityView';
import { AchievementsView } from './components/AchievementsView';
import { OnboardingView } from './components/OnboardingView';
import { SettingsView } from './components/SettingsView';
import { AppView, UserProfile } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';

const AuthenticatedApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initialPlan, setInitialPlan] = useState<string>('');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark text-primary">
        <span className="material-symbols-outlined text-6xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleOnboardingComplete = (profile: UserProfile, plan: string) => {
    setUserProfile(profile);
    setInitialPlan(plan);
    setShowOnboarding(false);
    // In a real app, you would save 'profile' to localStorage or backend here
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // In a real app, you would also trigger a re-generation of the plan or save to backend
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard userProfile={userProfile} initialPlan={initialPlan} />;
      case AppView.TRAINING:
        return <div className="h-full"><TrainingView /></div>;
      case AppView.COMMUNITY:
        return <div className="h-full"><CommunityView /></div>;
      case AppView.ACHIEVEMENTS:
        return <div className="h-full"><AchievementsView /></div>;
      case AppView.AI_COACH:
        // Pass user name for personalization
        return <div className="h-[calc(100vh-2rem)] max-w-4xl mx-auto"><ChatBot userName={userProfile?.name} /></div>;
      case AppView.MEDIA_ANALYSIS:
        return <div className="h-full"><MediaAnalyzer /></div>;
      case AppView.SETTINGS:
        return <div className="h-full"><SettingsView userProfile={userProfile} onUpdateProfile={handleUpdateProfile} /></div>;
      default:
        // For other views, show a placeholder reusing the dashboard style
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-6">construction</span>
            <h2 className="text-3xl font-bold text-white mb-2">En Construcción</h2>
            <p className="text-slate-400">El módulo {currentView} está actualmente en desarrollo.</p>
            <button
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        );
    }
  };

  if (showOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden p-4 md:gap-4 animate-in fade-in duration-700 relative">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1 h-full overflow-y-auto custom-scrollbar md:pl-0 rounded-2xl">
        <div className="max-w-[1400px] mx-auto min-h-full">
          {renderContent()}
        </div>
      </main>

      {/* Floating AI Chat Button & Widget */}
      {currentView !== AppView.AI_COACH && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">

          {isFloatingChatOpen && (
            <div className="pointer-events-auto w-[350px] h-[500px] shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
              <ChatBot
                userName={userProfile?.name}
                variant="widget"
                onClose={() => setIsFloatingChatOpen(false)}
              />
            </div>
          )}

          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="pointer-events-auto size-14 rounded-full bg-primary hover:bg-primary-hover text-surface-darker shadow-[0_0_20px_rgba(19,236,146,0.4)] hover:shadow-[0_0_30px_rgba(19,236,146,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          >
            <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${isFloatingChatOpen ? 'rotate-180' : ''}`}>
              {isFloatingChatOpen ? 'close' : 'smart_toy'}
            </span>

            {/* Tooltip */}
            {!isFloatingChatOpen && (
              <span className="absolute right-16 px-3 py-1 bg-surface-dark text-white text-xs font-bold rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Hablar con Entrenador IA
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;