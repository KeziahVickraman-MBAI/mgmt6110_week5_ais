import {
  AlertCircle,
  Bookmark,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="user-guide-title" className="text-base font-bold text-zinc-900 tracking-tight">
                SG Bus Arrival App Help & Documentation
              </h2>
              <p className="text-xs text-zinc-500">
                User Guide & Commuter Handbook for Singapore Transit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close user guide"
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-zinc-700 text-xs sm:text-sm">
          {/* Guide 1: Live Bus Arrivals & Auto-Update */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3>Live Arrival Times & Auto-Refresh</h3>
            </div>
            <p className="text-zinc-600 mb-2.5 text-xs leading-relaxed">
              Arrival times show how many minutes remain before the next and subsequent buses reach your stop. When a bus is less than 1 minute away, it displays <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">ARRIVING</span>.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 bg-white p-3 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-1.5 font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-refreshes every 25 seconds</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Manual update via "Update Arrival Times" button</span>
              </div>
            </div>
          </div>

          {/* Guide 2: Bus Capacity Indicators */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3>Bus Capacity & Crowding Levels</h3>
            </div>
            <p className="text-zinc-600 mb-3 text-xs leading-relaxed">
              Each bus service card includes real-time crowding indicators so you can plan whether to board or wait for the next bus:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Green</span>
                </div>
                <div className="text-[11px] font-bold">Seats Available</div>
                <div className="text-[10px] text-emerald-700 mt-1">Plenty of vacant seats on board.</div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-950">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span>Yellow</span>
                </div>
                <div className="text-[11px] font-bold">Standing space only and filling fast</div>
                <div className="text-[10px] text-yellow-800 mt-1">Limited seating remaining, standees only.</div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Red</span>
                </div>
                <div className="text-[11px] font-bold">Alert: No space</div>
                <div className="text-[10px] text-rose-800 mt-1">Bus is at near-full capacity.</div>
              </div>
            </div>
          </div>

          {/* Guide 3: Visual Differentiation */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3>Distinguishing Bus Stops vs Bus Services</h3>
            </div>
            <p className="text-zinc-600 mb-3 text-xs leading-relaxed">
              The application uses color-coded plates so bus stop locations and bus route lines are never confused:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-600 text-white font-mono text-xs font-bold rounded-lg border border-amber-700 shadow-2xs shrink-0">
                  🚏 #09048
                </span>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs">Bus Stop Code</div>
                  <div className="text-[11px] text-zinc-500">Amber roadside plate — 5 numeric digits printed on the bus shelter pole.</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center gap-3">
                <span className="w-12 h-10 rounded-xl bg-emerald-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs border border-emerald-700 shrink-0">
                  133
                </span>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs">Bus Route Number</div>
                  <div className="text-[11px] text-zinc-500">Transit green badge — 1 to 3 alphanumeric service line.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guide 4: Searching Bus Stops with LTA Autocomplete */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <h3>Searching with Official LTA Bus Stop Data</h3>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed mb-2.5">
              Start typing keywords like <span className="font-mono font-bold text-zinc-900 px-1 bg-zinc-200 rounded">orch</span> or any 5-digit number into the search bar. An official dropdown opens with matching Singapore LTA bus stops for instant selection.
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>If a bus stop is not found immediately:</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-normal">
                If the LTA dataset request or cache sync is delayed, it is not your fault — the bus stop may be legitimate. Please wait 10 or 20 seconds and try again. You can also refer to the physical bus stop pole board / panel for details or use &ldquo;Input Bus Stop Details&rdquo; to add it manually.
              </p>
            </div>
          </div>

          {/* Guide 5: Adding a Bus Stop & Error Prevention */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                5
              </span>
              <h3>Inputting Bus Stop Details</h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-600">
              <p>
                Click &ldquo;Input Bus Stop Details&rdquo; to register any bus stop. Note that Singapore bus stop numbers must be <strong>exactly 5 numeric digits</strong> (e.g. <span className="font-mono font-bold text-zinc-900">09048</span>).
              </p>
              <div className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px]">
                <span className="font-semibold text-zinc-900">Input validation:</span> If fewer than 5 digits are entered, the system prompts: <span className="font-mono text-zinc-900 bg-white px-1.5 py-0.5 rounded border border-zinc-300">"make sure to include numeric 5 digit code"</span>.
              </div>
            </div>
          </div>

          {/* Guide 6: Bookmarking & Undo Actions */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                6
              </span>
              <h3>Bookmarks & Restoring Accidental Deletions</h3>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed mb-2">
              Save stops you visit frequently with category tags (Home 🏠, Work 💼, School 🎓, Other ⭐). You can delete bookmarks at any time.
            </p>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
              <Undo2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span>
                <strong>Accidental deletion?</strong> Whenever you delete a bookmark, an Undo prompt appears at the bottom right allowing one-click restoration.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-end bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
