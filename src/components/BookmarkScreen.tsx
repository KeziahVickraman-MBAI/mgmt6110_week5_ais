import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Bus,
  Clock,
  ExternalLink,
  GraduationCap,
  Heart,
  Home,
  Info,
  MapPin,
  Plus,
  PlusCircle,
  Search,
  Star,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { BookmarkItem, BusStop } from '../App.tsx';
import { BOOKMARK_TAGS } from '../data/mockBusData.js';

interface BookmarkScreenProps {
  bookmarks: BookmarkItem[];
  busStops: BusStop[];
  onSelectStop: (code: string) => void;
  onNavigateToDashboard: () => void;
  onAddBookmark: (bookmark: {
    stopCode: string;
    tag: string;
    label: string;
    notes?: string;
  }) => void;
  onRemoveBookmark: (id: string) => void;
  lastUpdatedTime: string;
}

export default function BookmarkScreen({
  bookmarks,
  busStops,
  onSelectStop,
  onNavigateToDashboard,
  onAddBookmark,
  onRemoveBookmark,
  lastUpdatedTime,
}: BookmarkScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Heuristic #3: User Control & Freedom - Undo deleted bookmarks
  const [recentlyDeleted, setRecentlyDeleted] = useState<BookmarkItem | null>(null);

  // Form state
  const [formStopCode, setFormStopCode] = useState(busStops[0]?.code || '');
  const [formTag, setFormTag] = useState('home');
  const [formLabel, setFormLabel] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleDeleteWithUndo = (bm: BookmarkItem) => {
    setRecentlyDeleted(bm);
    onRemoveBookmark(bm.id);
  };

  const handleUndoDelete = () => {
    if (!recentlyDeleted) return;
    onAddBookmark({
      stopCode: recentlyDeleted.stopCode,
      tag: recentlyDeleted.tag,
      label: recentlyDeleted.label,
      notes: recentlyDeleted.notes,
    });
    setRecentlyDeleted(null);
  };

  // Map each bookmark with its corresponding bus stop data
  const populatedBookmarks = useMemo(() => {
    return bookmarks.map((bm) => {
      const stop = busStops.find((s) => s.code === bm.stopCode);
      const tagInfo =
        BOOKMARK_TAGS.find((t) => t.id === bm.tag) || {
          id: 'other',
          label: 'Other',
          emoji: '⭐',
          color: 'amber',
        };
      return {
        ...bm,
        stop,
        tagInfo,
      };
    });
  }, [bookmarks, busStops]);

  // Filtered bookmarks by category and search text
  const filteredBookmarks = useMemo(() => {
    return populatedBookmarks.filter((bm) => {
      const matchesCategory =
        selectedCategory === 'all' || bm.tag === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        bm.label.toLowerCase().includes(q) ||
        bm.stopCode.toLowerCase().includes(q) ||
        (bm.stop?.name && bm.stop.name.toLowerCase().includes(q)) ||
        (bm.notes && bm.notes.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [populatedBookmarks, selectedCategory, searchQuery]);

  // Counts per tag
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: bookmarks.length,
      home: 0,
      work: 0,
      school: 0,
      other: 0,
    };
    bookmarks.forEach((bm) => {
      const tag = bm.tag || 'other';
      if (counts[tag] !== undefined) {
        counts[tag]++;
      } else {
        counts.other = (counts.other || 0) + 1;
      }
    });
    return counts;
  }, [bookmarks]);

  const handleOpenAdd = (defaultStopCode?: string) => {
    setFormStopCode(defaultStopCode || busStops[0]?.code || '');
    setFormTag('home');
    setFormLabel('');
    setFormNotes('');
    setFormError('');
    setShowAddModal(true);
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Heuristic #5: Error Prevention & Heuristic #9: Helpful Error Message
    if (!formStopCode || !/^\d{5}$/.test(formStopCode)) {
      setFormError('make sure to include numeric 5 digit code (refer to bus stop pole board/ panel for bus stop details)');
      return;
    }

    const selectedStop = busStops.find((s) => s.code === formStopCode);
    const resolvedLabel =
      formLabel.trim() ||
      `${selectedStop?.name || 'Bus Stop'} (${formTag.toUpperCase()})`;

    onAddBookmark({
      stopCode: formStopCode,
      tag: formTag,
      label: resolvedLabel,
      notes: formNotes.trim(),
    });

    setShowAddModal(false);
  };

  const handleViewLiveArrivals = (stopCode: string) => {
    onSelectStop(stopCode);
    onNavigateToDashboard();
  };

  const getTagBadge = (
    tag: string,
    tagInfo: { emoji: string; label: string; color: string }
  ) => {
    const colorClasses: Record<string, string> = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
          colorClasses[tagInfo.color] || colorClasses.amber
        }`}
      >
        <span>{tagInfo.emoji}</span>
        <span>{tagInfo.label}</span>
      </span>
    );
  };

  return (
    <section id="bookmark-screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
                <BookmarkCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Favorite Stops & Bookmarks
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-xl">
              Organize your frequent transit locations for Home, School, Work, and personal routes.
              Tap any saved stop to immediately load its live arrival updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-add-bookmark-modal"
              type="button"
              onClick={() => handleOpenAdd()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Bookmark New Stop</span>
            </button>
          </div>
        </div>

        {/* Category Pills & Quick Filter */}
        <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              <span>All Saved</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  selectedCategory === 'all'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {categoryCounts.all}
              </span>
            </button>

            {BOOKMARK_TAGS.map((tag) => {
              const isSelected = selectedCategory === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedCategory(tag.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {categoryCounts[tag.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search within bookmarks */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved stops..."
              className="w-full pl-8 pr-7 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBookmarks.map((bm) => {
          const stop = bm.stop;
          const nextBus = stop?.buses?.[0];
          return (
            <div
              key={bm.id}
              className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Tag + Stop Code + Remove */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {getTagBadge(bm.tag, bm.tagInfo)}
                    {/* Differentiated Bus Stop Number Badge: Amber Roadside Plate */}
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-600 text-white border border-amber-700 shadow-2xs inline-flex items-center gap-1">
                      🚏 #{bm.stopCode}
                    </span>
                  </div>

                  {/* Heuristic #3: User Control & Freedom - Delete bookmark with Undo */}
                  <button
                    type="button"
                    onClick={() => handleDeleteWithUndo(bm)}
                    className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Nickname & Stop Name */}
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">
                  {bm.label}
                </h3>
                {stop && (
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span>{stop.name}</span>
                    <span>•</span>
                    <span>{stop.road}</span>
                  </p>
                )}

                {/* Commuter Notes */}
                {bm.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-150 text-xs text-zinc-600">
                    <span className="font-medium text-zinc-700">Note:</span> {bm.notes}
                  </div>
                )}

                {/* Live Preview of buses at this stop */}
                {stop && stop.buses && stop.buses.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
                      <span className="font-medium uppercase tracking-wider">
                        Next Approaching Buses:
                      </span>
                      <span className="font-mono text-emerald-600 font-medium">
                        Live Sync
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {stop.buses.slice(0, 3).map((bus) => (
                        <div
                          key={bus.serviceNo}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-xs"
                        >
                          {/* Differentiated Bus Service Number: Emerald Green transit badge */}
                          <span className="font-extrabold text-white font-mono bg-emerald-600 px-2 py-0.5 rounded-md text-[11px] shadow-2xs border border-emerald-700">
                            {bus.serviceNo}
                          </span>
                          <span className="text-zinc-400">•</span>
                          <span
                            className={`font-mono font-medium ${
                              bus.etaMinutes <= 1
                                ? 'text-emerald-600 font-bold'
                                : 'text-zinc-700'
                            }`}
                          >
                            {bus.etaMinutes <= 0
                              ? 'Arr'
                              : `${bus.etaMinutes}m`}
                          </span>
                        </div>
                      ))}
                      {stop.buses.length > 3 && (
                        <span className="text-[11px] text-zinc-400 self-center">
                          +{stop.buses.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  {stop?.buses?.length || 0} active routes
                </span>

                <button
                  type="button"
                  onClick={() => handleViewLiveArrivals(bm.stopCode)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors shadow-2xs"
                >
                  <span>View Live Arrivals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBookmarks.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">
            No Bookmarks in this Category
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            {searchQuery
              ? `No saved stops matched your search "${searchQuery}".`
              : 'Save frequent bus stops like Home, School, or Work for fast one-tap live arrival times.'}
          </p>
          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Favorite Stop</span>
          </button>
        </div>
      )}

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-zinc-900" />
                <h3 className="text-base font-semibold text-zinc-900">
                  Save Favorite Stop
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBookmark} className="space-y-4">
              {/* Select Bus Stop */}
              <div>
                <label
                  htmlFor="bm-select-stop"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Choose Bus Stop*
                </label>
                <select
                  id="bm-select-stop"
                  value={formStopCode}
                  onChange={(e) => setFormStopCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                >
                  {busStops.map((stop) => (
                    <option key={stop.code} value={stop.code}>
                      #{stop.code} — {stop.name} ({stop.road})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag / Category Picker */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Category Tag*
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BOOKMARK_TAGS.map((t) => {
                    const isSelected = formTag === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormTag(t.id)}
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

              {/* Custom Nickname / Label */}
              <div>
                <label
                  htmlFor="bm-input-label"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Custom Nickname (Optional)
                </label>
                <input
                  id="bm-input-label"
                  type="text"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. My Home Stop, Office Lobby, Campus Gate..."
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="bm-input-notes"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Commuter Notes (Optional)
                </label>
                <textarea
                  id="bm-input-notes"
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Take bus 14 to MRT, 3 mins walk from block..."
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-600 font-medium">{formError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Save to Bookmarks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Heuristic #3: User Control & Freedom - Undo Deleted Bookmark Toast */}
      {recentlyDeleted && (
        <div
          id="undo-deleted-bookmark-toast"
          className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>
              Deleted bookmark &ldquo;{recentlyDeleted.label}&rdquo; (Stop #{recentlyDeleted.stopCode})
            </span>
          </div>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={() => setRecentlyDeleted(null)}
            className="p-1 text-zinc-400 hover:text-white"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}
