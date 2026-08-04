'use client';

import { useState } from 'react';
import { ClimbView } from '@/components/climb-view';
import { SiteHeader, type PortfolioView } from '@/components/site-header';
import { WordsView } from '@/components/words-view';

export function Portfolio() {
  const [view, setView] = useState<PortfolioView>('climb');

  const changeView = (next: PortfolioView) => {
    window.scrollTo(0, 0);
    setView(next);
  };

  return (
    <div className='min-h-screen overflow-x-hidden'>
      <SiteHeader view={view} onViewChange={changeView} />
      {view === 'climb' ? <ClimbView /> : <WordsView />}
    </div>
  );
}
