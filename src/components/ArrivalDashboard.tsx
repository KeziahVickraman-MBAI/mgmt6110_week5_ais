import {
  Accessibility,
  Activity,
  AlertCircle,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Bus,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Heart,
  Home,
  Layers,
  MapPin,
  PlusCircle,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BookmarkItem, BusStop } from '../App.tsx';
import { BOOKMARK_TAGS } from '../data/mockBusData.js';

interface ArrivalDashboardProps {
  busStops: BusStop[];
  selectedStopCode: string;
  onSelectStop: (code: string) => void;
  onAddBusStop: (stop: { code: string; name: string; road?: string }) => void;
  onUpdateTimes: () => void;
  lastUpdatedTime: string;
  bookmarks?: BookmarkItem[];
  onToggleBookmark: (stopCode: string, bookmarkData: { tag?: string; label?: string; notes?: string } | null) => void;
  onNavigateToBookmarks?: () => void;
}

export default function ArrivalDashboard({
  busStops,
  selectedStopCode,
  onSelectStop,
  onAddBusStop,
  onUpdateTimes,
  lastUpdatedTime,
  bookmarks = [],
  onToggleBookmark,
  onNavigateToBookmarks,
}: ArrivalDashboardProps) {
  // Search and form state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStopCode, setNewStopCode] = useState('');
  const [newStopName, setNewStopName] = useState('');
  const [newStopRoad, setNewStopRoad] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Live update and refresh state
  const [isUpdating, setIsUpdating] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [countdown, setCountdown] = useState(25);
  const [justUpdated, setJustUpdated] = useState(false);

  // Bookmark modal state for active stop
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkTag, setBookmarkTag] = useState('home');
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [bookmarkNotes, setBookmarkNotes] = useState('');

  // Filter stops by query (search by bus stop code or name or road)
  const filteredStops = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return busStops;
    return busStops.filter(
      (stop) =>
        stop.code.toLowerCase().includes(q) ||
        stop.name.toLowerCase().includes(q) ||
        stop.road.toLowerCase().includes(q)
    );
  }, [busStops, searchQuery]);

  // Currently active stop
  const activeStop = useMemo(() => {
    return (
      busStops.find((s) => s.code === selectedStopCode) ||
      filteredStops[0] ||
      busStops[0]
    );
  }, [busStops, selectedStopCode, filteredStops]);

  // Check if active stop is bookmarked
  const activeBookmark = useMemo(() => {
    if (!activeStop) return null;
    return bookmarks.find((bm) => bm.stopCode === activeStop.code);
  }, [bookmarks, activeStop]);

  // Handle manual update trigger
  const handleTriggerUpdate = useCallback(() => {
    setIsUpdating(true);
    setJustUpdated(true);
    onUpdateTimes();
    setCountdown(25);
    setTimeout(() => {
      setIsUpdating(false);
    }, 450);
    setTimeout(() => {
      setJustUpdated(false);
    }, 3000);
  }, [onUpdateTimes]);

  // Auto-refresh countdown timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onUpdateTimes();
          setJustUpdated(true);
          setTimeout(() => setJustUpdated(false), 2500);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, onUpdateTimes]);

  // Form submit for adding custom bus stop details
  const handleAddStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const trimmedCode = newStopCode.trim();
    const trimmedName = newStopName.trim();
    const trimmedRoad = newStopRoad.trim() || 'Singapore Urban Link';

    if (!trimmedCode || !trimmedName) {
      setFormError('Please enter both bus stop number and name.');
      return;
    }

    if (!/^\d{4,5}$/.test(trimmedCode)) {
      setFormError('Bus stop number should be 4 or 5 digits (e.g. 08057).');
      return;
    }

    const exists = busStops.some((s) => s.code === trimmedCode);
    if (exists) {
      setFormError(`Bus stop #${trimmedCode} is already registered.`);
      return;
    }

    onAddBusStop({
      code: trimmedCode,
      name: trimmedName,
      road: trimmedRoad,
    });

    setFormSuccess(`Bus stop #${trimmedCode} (${trimmedName}) registered successfully!`);
    setNewStopCode('');
    setNewStopName('');
    setNewStopRoad('');
    setTimeout(() => {
      setShowAddForm(false);
      setFormSuccess('');
    }, 1600);
  };

  // Open bookmark modal for active stop
  const handleOpenBookmarkModal = () => {
    if (activeBookmark) {
      // If already bookmarked, populate with existing info
      setBookmarkTag(activeBookmark.tag || 'home');
      setBookmarkLabel(activeBookmark.label || activeStop.name);
      setBookmarkNotes(activeBookmark.notes || '');
    } else {
      setBookmarkTag('home');
      setBookmarkLabel(`${activeStop.name} (Home)`);
      setBookmarkNotes('');
    }
    setShowBookmarkModal(true);
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStop) return;

    onToggleBookmark(activeStop.code, {
      tag: bookmarkTag,
      label: bookmarkLabel.trim() || activeStop.name,
      notes: bookmarkNotes.trim(),
    });

    setShowBookmarkModal(false);
  };

  // Crowding badge helper
  const getOccupancyBadge = (statusCode?: string, label?: string) => {
    switch (statusCode) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {label}
          </span>
        );
      case 'amber':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {label}
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            {label}
          </span>
        );
    }
  };

  // Earliest arriving bus
  const earliestBus = useMemo(() => {
    if (!activeStop || !activeStop.buses || activeStop.buses.length === 0) return null;
    return [...activeStop.buses].sort((a, b) => a.etaMinutes - b.etaMinutes)[0];
  }, [activeStop]);

  return (
    <section id="arrival-dashboard-screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Search & Stop Input Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="bus-search-input" className="sr-only">
            Search bus stops
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="bus-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by 5-digit stop code (e.g. 08057) or stop name..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Input Bus Stop Details button */}
        <button
          id="btn-toggle-input-stop"
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Close Stop Form' : 'Input Bus Stop Details'}</span>
        </button>
      </div>

      {/* Input Bus Stop Details Collapsible Form */}
      {showAddForm && (
        <div
          id="add-stop-panel"
          className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6 mb-6 transition-all shadow-xs"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Input Bus Stop Details
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Register a new Singapore bus stop by entering its 5-digit number and name to track live arrivals.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddStopSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="new-stop-code"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Stop Code (5 digits)*
                </label>
                <input
                  id="new-stop-code"
                  type="text"
                  maxLength={5}
                  value={newStopCode}
                  onChange={(e) => setNewStopCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 11401"
                  className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-stop-name"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Bus Stop Name*
                </label>
                <input
                  id="new-stop-name"
                  type="text"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  placeholder="e.g. Havelock Central Plaza"
                  className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-stop-road"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Road / Area (Optional)
                </label>
                <input
                  id="new-stop-road"
                  type="text"
                  value={newStopRoad}
                  onChange={(e) => setNewStopRoad(e.target.value)}
                  placeholder="e.g. Havelock Road"
                  className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {formError && (
              <p className="text-xs text-rose-600 font-medium">{formError}</p>
            )}
            {formSuccess && (
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {formSuccess}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                id="btn-save-new-stop"
                type="submit"
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Save Bus Stop
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Available Bus Stops Pills / Switcher */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Available Bus Stops ({filteredStops.length})
          </span>
          {searchQuery && (
            <span className="text-xs text-zinc-400">
              Filtering for &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filteredStops.map((stop) => {
            const isSelected = activeStop && activeStop.code === stop.code;
            const isSaved = bookmarks.some((bm) => bm.stopCode === stop.code);
            return (
              <button
                id={`stop-pill-${stop.code}`}
                key={stop.code}
                type="button"
                onClick={() => onSelectStop(stop.code)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isSaved && (
                  <BookmarkCheck
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-amber-400' : 'text-amber-500'
                    }`}
                  />
                )}
                <span
                  className={`font-mono px-1.5 py-0.5 rounded text-[11px] ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-200'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  #{stop.code}
                </span>
                <span className="truncate max-w-[150px]">{stop.name}</span>
              </button>
            );
          })}
          {filteredStops.length === 0 && (
            <div className="text-xs text-zinc-500 py-2">
              No matching bus stops found. Click &ldquo;Input Bus Stop Details&rdquo; to register one.
            </div>
          )}
        </div>
      </div>

      {/* When it worked banner: Updated arrival times notification */}
      {justUpdated && (
        <div
          id="eta-updated-banner"
          className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Arrival times refreshed! New ETAs calculated for all {activeStop?.buses?.length || 0} services.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700">
            {lastUpdatedTime}
          </span>
        </div>
      )}

      {/* Main Bus Stop Details & Live Arrival Panel */}
      {activeStop && (
        <div
          id="live-bus-arrival-card"
          className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs mb-8"
        >
          {/* Card Header with Stop Info & Live Controls */}
          <div className="p-5 sm:p-6 border-b border-zinc-200 bg-zinc-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="px-2.5 py-1 bg-zinc-900 text-white font-mono text-xs font-semibold rounded-lg tracking-wider">
                  #{activeStop.code}
                </span>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  {activeStop.name}
                </h2>
                {activeBookmark && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Saved as {activeBookmark.label}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{activeStop.road}</span>
                <span>•</span>
                <span>{activeStop.buses.length} active bus services</span>
              </p>
            </div>

            {/* Actions: Bookmark Button + Live Update Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Bookmark Toggle Button */}
              <button
                id="btn-bookmark-stop"
                type="button"
                onClick={handleOpenBookmarkModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-2xs ${
                  activeBookmark
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400'
                }`}
                title="Save stop to Home, Work, School or Other bookmarks"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    activeBookmark ? 'fill-amber-500 text-amber-600' : 'text-zinc-500'
                  }`}
                />
                <span>{activeBookmark ? 'Bookmarked' : 'Bookmark Stop'}</span>
              </button>

              {/* Auto-update switch */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg text-xs text-zinc-600 border border-zinc-200">
                <input
                  id="toggle-live-refresh"
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300 cursor-pointer"
                />
                <label htmlFor="toggle-live-refresh" className="cursor-pointer select-none">
                  Auto-update ({autoRefreshEnabled ? `${countdown}s` : 'Off'})
                </label>
              </div>

              {/* Update Arrival Times button */}
              <button
                id="btn-update-arrival-times"
                type="button"
                onClick={handleTriggerUpdate}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`}
                />
                <span>{isUpdating ? 'Updating...' : 'Update Arrival Times'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 border-b border-zinc-200 bg-white">
            <div className="p-4 flex items-center justify-between sm:justify-start gap-4">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
                  Next Bus Arriving
                </span>
                {earliestBus ? (
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold font-mono text-emerald-600">
                      {earliestBus.etaMinutes <= 1
                        ? 'ARRIVING'
                        : `${earliestBus.etaMinutes} mins`}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      (Bus {earliestBus.serviceNo})
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400">No buses</span>
                )}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between sm:justify-start gap-4">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
                  Live Feed Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-zinc-800">
                    Live Updates Active
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between sm:justify-start gap-4">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
                  Last Synchronized
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-zinc-700">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-mono text-xs font-medium">
                    {lastUpdatedTime} SGT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* List of Bus Services at this Stop */}
          <div className="divide-y divide-zinc-200">
            {activeStop.buses.map((bus) => {
              const isUnderOneMin = bus.etaMinutes <= 1;
              return (
                <div
                  id={`bus-service-row-${bus.serviceNo}`}
                  key={bus.serviceNo}
                  className="p-5 sm:p-6 hover:bg-zinc-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Service No, Destination & Badges */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-12 rounded-xl bg-zinc-900 text-white font-mono font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs">
                      {bus.serviceNo}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-zinc-900 text-sm">
                          To {bus.destination}
                        </span>
                        {getOccupancyBadge(bus.statusCode, bus.status)}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-zinc-400" />
                          <span>{bus.type}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Accessibility className="w-3 h-3 text-zinc-400" />
                          <span>{bus.wheelchair ? 'Accessible' : 'Standard'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: ETAs in minutes */}
                  <div className="flex items-center gap-3 sm:gap-6 bg-zinc-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                    {/* Primary Next Bus Arrival */}
                    <div className="text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                        Next Bus
                      </span>
                      {isUnderOneMin ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg animate-pulse tracking-wide">
                          ARRIVING
                        </span>
                      ) : (
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-2xl font-extrabold font-mono text-zinc-900">
                            {bus.etaMinutes}
                          </span>
                          <span className="text-xs font-medium text-zinc-500">
                            mins
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-px h-8 bg-zinc-200 hidden sm:block"></div>

                    {/* 2nd Bus Arrival */}
                    <div className="text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                        2nd Bus
                      </span>
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-base font-bold font-mono text-zinc-700">
                          {bus.subsequentEta}
                        </span>
                        <span className="text-[11px] font-medium text-zinc-400">
                          mins
                        </span>
                      </div>
                    </div>

                    {/* 3rd Bus Arrival */}
                    {bus.thirdEta && (
                      <>
                        <div className="w-px h-8 bg-zinc-200 hidden sm:block"></div>
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                            3rd Bus
                          </span>
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-base font-bold font-mono text-zinc-600">
                              {bus.thirdEta}
                            </span>
                            <span className="text-[11px] font-medium text-zinc-400">
                              mins
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {activeStop.buses.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-500">
                No buses currently running for this bus stop.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-zinc-900" />
                <h3 className="text-base font-semibold text-zinc-900">
                  Bookmark #{activeStop.code} ({activeStop.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookmarkModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBookmark} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Select Category Tag*
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BOOKMARK_TAGS.map((t) => {
                    const isSelected = bookmarkTag === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setBookmarkTag(t.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-base mb-0.5">{t.emoji}</span>
                        <span className="text-[11px]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="bm-label-input"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Custom Label
                </label>
                <input
                  id="bm-label-input"
                  type="text"
                  value={bookmarkLabel}
                  onChange={(e) => setBookmarkLabel(e.target.value)}
                  placeholder={`e.g. My ${bookmarkTag.toUpperCase()} Stop`}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label
                  htmlFor="bm-notes-input"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Commuter Notes (Optional)
                </label>
                <textarea
                  id="bm-notes-input"
                  rows={2}
                  value={bookmarkNotes}
                  onChange={(e) => setBookmarkNotes(e.target.value)}
                  placeholder="e.g. Catch bus 14 to Orchard, bus 65 to Bedok..."
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                {activeBookmark ? (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleBookmark(activeStop.code, null);
                      setShowBookmarkModal(false);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Remove Bookmark
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookmarkModal(false)}
                    className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Save Bookmark
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
