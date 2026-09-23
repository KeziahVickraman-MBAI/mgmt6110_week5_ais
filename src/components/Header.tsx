import {
  Bookmark,
  BookmarkCheck,
  Bus,
  Clock,
  LayoutDashboard,
  Radio,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  activeScreen: 'dashboard' | 'bookmark';
  onSelectScreen: (screen: 'dashboard' | 'bookmark') => void;
  bookmarkCount?: number;
}

export default function Header({
  activeScreen,
  onSelectScreen,
  bookmarkCount = 0,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-SG', {
          timeZone: 'Asia/Singapore',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header id="app-header" className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Brand Logo, Title & Visibility Indicator */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
                  SG Bus Arrival
                </h1>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                  Singapore Transit
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Live Arrival Updates & Bookmark Manager
              </p>
            </div>
          </div>

          {/* Visibility indicator chip on mobile/tablet */}
          <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {activeScreen === 'dashboard' ? 'Arrival Dashboard' : 'Bookmark'}
            </span>
          </div>
        </div>

        {/* Right Section: 2-Screen Navigation with Visibility Indicator & Clock */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
          {/* Current view indicator for users to have complete visibility */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Current View:
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-zinc-900">
              {activeScreen === 'dashboard' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Arrival Dashboard (Live)
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                  Saved Bookmarks
                </>
              )}
            </span>
          </div>

          {/* 2-Screen Navigation (Arrival Dashboard & Bookmark) */}
          <nav
            aria-label="Screen Navigation"
            className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 shadow-2xs"
          >
            {/* Screen 1: Arrival Dashboard */}
            <button
              id="nav-dashboard-screen"
              type="button"
              onClick={() => onSelectScreen('dashboard')}
              aria-current={activeScreen === 'dashboard' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScreen === 'dashboard'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Arrival Dashboard</span>
              {activeScreen === 'dashboard' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* Screen 2: Bookmark */}
            <button
              id="nav-bookmark-screen"
              type="button"
              onClick={() => onSelectScreen('bookmark')}
              aria-current={activeScreen === 'bookmark' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScreen === 'bookmark'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmark</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeScreen === 'bookmark'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {bookmarkCount}
              </span>
            </button>
          </nav>

          {/* Current Time Clock */}
          {currentTime && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono font-medium">{currentTime} SGT</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
