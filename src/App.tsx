import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav, type TabId } from '@/components/layout/TopNav';
import { CommandPalette } from '@/components/CommandPalette';
import { FavouritesProvider } from '@/context/FavouritesContext';
import { AllReports } from '@/pages/AllReports';
import { AIBuilder } from '@/pages/AIBuilder';
import { Scheduled } from '@/pages/Scheduled';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<TabId>('all-reports');
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    setCollapsed(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Listen for AI generate events from PromptPanel
  useEffect(() => {
    const handler = () => toast.success('Report generation started...');
    window.addEventListener('ai-generate', handler);
    return () => window.removeEventListener('ai-generate', handler);
  }, []);

  return (
    <FavouritesProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav active={tab} onChange={setTab} />
          <main className="flex-1 overflow-y-auto">
            {tab === 'all-reports' && <AllReports />}
            {tab === 'ai-builder' && <AIBuilder />}
            {tab === 'scheduled' && <Scheduled />}
          </main>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onNavigate={setTab} />
      <Toaster position="bottom-right" richColors closeButton />
    </FavouritesProvider>
  );
}

export default App;
