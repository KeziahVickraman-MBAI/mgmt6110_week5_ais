/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import ArrivalDashboard from './components/ArrivalDashboard.tsx';
import BookmarkScreen from './components/BookmarkScreen.tsx';
import Header from './components/Header.tsx';
import { INITIAL_BOOKMARKS, INITIAL_BUS_STOPS } from './data/mockBusData.js';

export interface BusService {
  serviceNo: string;
  destination: string;
  status: string;
  statusCode: string;
  type: string;
  wheelchair: boolean;
  etaMinutes: number;
  subsequentEta: number;
  thirdEta?: number;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  buses: BusService[];
}

export interface BookmarkItem {
  id: string;
  stopCode: string;
  label: string;
  tag: string;
  notes?: string;
  createdAt?: string;
}

export default function App() {
  // Navigation between the 2 primary screens: 'dashboard' (Arrival Dashboard) and 'bookmark' (Bookmark)
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'bookmark'>('dashboard');
  const [busStops, setBusStops] = useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [selectedStopCode, setSelectedStopCode] = useState<string>('08057');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);

  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-SG', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  });

  // Function to simulate receiving updates on bus arrival times (recalculating the new ETA)
  const handleUpdateTimes = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString('en-SG', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setLastUpdatedTime(timestamp);

    setBusStops((prevStops) =>
      prevStops.map((stop) => ({
        ...stop,
        buses: stop.buses.map((bus) => {
          // Decrement ETA or reset to new cycle if it reaches 0
          let newEta = bus.etaMinutes - 1;
          let newSubsequent = bus.subsequentEta - 1;
          let newThird = (bus.thirdEta ?? 20) - 1;

          if (newEta < 0) {
            newEta = Math.max(1, newSubsequent);
            newSubsequent = Math.max(newEta + 4, newThird);
            newThird = newSubsequent + Math.floor(Math.random() * 6) + 6;
          }

          // Randomly fluctuate occupancy status over time (Nielsen Heuristic #2: Match between system and real world)
          const statuses = [
            { text: 'Seats Available', code: 'green' },
            { text: 'Standing space only and filling fast', code: 'yellow' },
            { text: 'Alert: No space', code: 'red' },
          ];

          const shouldShiftStatus = Math.random() < 0.2;
          const randomStatus = shouldShiftStatus
            ? statuses[Math.floor(Math.random() * statuses.length)]
            : { text: bus.status, code: bus.statusCode };

          return {
            ...bus,
            etaMinutes: newEta,
            subsequentEta: Math.max(newEta + 3, newSubsequent),
            thirdEta: Math.max(newSubsequent + 5, newThird),
            status: randomStatus.text,
            statusCode: randomStatus.code,
          };
        }),
      }))
    );
  }, []);

  // Function to input/add new bus stop details (Stop number and Name)
  const handleAddBusStop = useCallback(
    ({ code, name, road }: { code: string; name: string; road?: string }) => {
      // Generate synthetic bus services for the new stop
      const sampleServices = ['23', '36', '124', '167', '851'];
      const generatedBuses: BusService[] = sampleServices
        .slice(0, 3 + (code.charCodeAt(0) % 2))
        .map((srv, idx) => ({
          serviceNo: srv,
          destination: `Transit Point ${srv}`,
          status:
            idx === 0
              ? 'Seats Available'
              : idx === 1
              ? 'Standing space only and filling fast'
              : 'Alert: No space',
          statusCode: idx === 0 ? 'green' : idx === 1 ? 'yellow' : 'red',
          type: idx % 2 === 0 ? 'Double Deck' : 'Single Deck',
          wheelchair: true,
          etaMinutes: (idx + 1) * 3 + Math.floor(Math.random() * 2),
          subsequentEta: (idx + 1) * 3 + 8,
          thirdEta: (idx + 1) * 3 + 18,
        }));

      const newStop: BusStop = {
        code,
        name,
        road: road || 'Singapore Urban Link',
        buses: generatedBuses,
      };

      setBusStops((prev) => [newStop, ...prev]);
      setSelectedStopCode(code);
      return newStop;
    },
    []
  );

  // Bookmark management handlers
  const handleToggleBookmark = useCallback(
    (stopCode: string, bookmarkData: { tag?: string; label?: string; notes?: string } | null) => {
      if (bookmarkData === null) {
        // Remove bookmark
        setBookmarks((prev) => prev.filter((bm) => bm.stopCode !== stopCode));
      } else {
        // Add or update bookmark
        setBookmarks((prev) => {
          const existingIdx = prev.findIndex((bm) => bm.stopCode === stopCode);
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              tag: bookmarkData.tag || updated[existingIdx].tag,
              label: bookmarkData.label || updated[existingIdx].label,
              notes: bookmarkData.notes ?? updated[existingIdx].notes,
            };
            return updated;
          } else {
            const stop = busStops.find((s) => s.code === stopCode);
            const newBookmark: BookmarkItem = {
              id: `bm-${Date.now()}`,
              stopCode,
              tag: bookmarkData.tag || 'home',
              label: bookmarkData.label || stop?.name || `Stop #${stopCode}`,
              notes: bookmarkData.notes || '',
              createdAt: new Date().toISOString().split('T')[0],
            };
            return [newBookmark, ...prev];
          }
        });
      }
    },
    [busStops]
  );

  const handleAddBookmark = useCallback(
    ({
      stopCode,
      tag,
      label,
      notes,
    }: {
      stopCode: string;
      tag: string;
      label: string;
      notes?: string;
    }) => {
      setBookmarks((prev) => {
        const filtered = prev.filter((bm) => bm.stopCode !== stopCode);
        const newBm: BookmarkItem = {
          id: `bm-${Date.now()}`,
          stopCode,
          tag,
          label,
          notes: notes || '',
          createdAt: new Date().toISOString().split('T')[0],
        };
        return [newBm, ...filtered];
      });
    },
    []
  );

  const handleRemoveBookmark = useCallback((bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bm) => bm.id !== bookmarkId));
  }, []);

  // Navigation handlers
  const handleNavigateToDashboard = useCallback((stopCode?: string) => {
    if (stopCode) setSelectedStopCode(stopCode);
    setActiveScreen('dashboard');
  }, []);

  const handleNavigateToBookmarks = useCallback(() => {
    setActiveScreen('bookmark');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100/60 text-zinc-900 flex flex-col font-sans antialiased">
      {/* App Header & 2-Screen Navigation with Visibility Indicator */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        bookmarkCount={bookmarks.length}
      />

      {/* Screen Views (Navigated purely by React State) */}
      <main className="flex-1">
        {activeScreen === 'dashboard' && (
          <ArrivalDashboard
            busStops={busStops}
            selectedStopCode={selectedStopCode}
            onSelectStop={setSelectedStopCode}
            onAddBusStop={handleAddBusStop}
            onUpdateTimes={handleUpdateTimes}
            lastUpdatedTime={lastUpdatedTime}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onNavigateToBookmarks={handleNavigateToBookmarks}
          />
        )}

        {activeScreen === 'bookmark' && (
          <BookmarkScreen
            bookmarks={bookmarks}
            busStops={busStops}
            onSelectStop={setSelectedStopCode}
            onNavigateToDashboard={() => setActiveScreen('dashboard')}
            onAddBookmark={handleAddBookmark}
            onRemoveBookmark={handleRemoveBookmark}
            lastUpdatedTime={lastUpdatedTime}
          />
        )}
      </main>

      {/* Minimalist Context Footer */}
      <footer
        id="app-footer"
        className="border-t border-zinc-200 bg-white py-4 px-4 sm:px-6 text-center text-xs text-zinc-500"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Data source: LTA DataMall, under the Singapore Open Data Licence v1.0.
          </span>
          <span className="font-mono text-[11px] text-zinc-400">
            SG Bus Arrival • MGMT 6110
          </span>
        </div>
      </footer>
    </div>
  );
}
