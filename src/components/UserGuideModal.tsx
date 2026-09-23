import {
  AlertCircle,
  Bookmark,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  MapPin,
  Search,
  ShieldAlert,
  Sparkles,
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
                SG Bus Arrival Commuter Guide
              </h2>
              <p className="text-xs text-zinc-500">
                Designed with Nielsen's 10 Usability Heuristics
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close user guide"
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-700 text-xs sm:text-sm">
          {/* Section 1: Bus Capacity Status */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                1
              </span>
              <h3>Real-World Bus Capacity (Heuristic #2)</h3>
            </div>
            <p className="text-zinc-600 mb-3 text-xs leading-relaxed">
              Capacity indicators match real-world physical boarding conditions at Singapore bus stops:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Green</span>
                </div>
                <div className="text-[11px] font-semibold">Seats Available</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Ample seating available.</div>
              </div>

              <div className="p-2.5 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-900">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span>Yellow</span>
                </div>
                <div className="text-[11px] font-semibold">Standing space only and filling fast</div>
                <div className="text-[10px] text-yellow-700 mt-0.5">Limited seats, standees only.</div>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Red</span>
                </div>
                <div className="text-[11px] font-bold">Alert: No space</div>
                <div className="text-[10px] text-rose-600 mt-0.5">Full bus, boarding restricted.</div>
              </div>
            </div>
          </div>

          {/* Section 2: Differentiating Bus Stop vs Bus Numbers */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                2
              </span>
              <h3>Visual Differentiation (Heuristic #4)</h3>
            </div>
            <p className="text-zinc-600 mb-3 text-xs leading-relaxed">
              Bus stop codes and bus line numbers have distinct visual styles so you never confuse them:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center gap-3">
                <span className="px-2.5 py-1 bg-amber-600 text-white font-mono text-xs font-bold rounded-lg border border-amber-700 shadow-2xs">
                  🚏 #09048
                </span>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs">Bus Stop Number</div>
                  <div className="text-[11px] text-zinc-500">Amber roadside plate (5 numeric digits)</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center gap-3">
                <span className="w-10 h-9 rounded-lg bg-emerald-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs border border-emerald-700">
                  133
                </span>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs">Bus Service Line</div>
                  <div className="text-[11px] text-zinc-500">Transit green badge (1-3 digit service)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Official LTA Dropdown Search */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                3
              </span>
              <h3>LTA Dropdown Search (Heuristic #6: Recognition over Recall)</h3>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed mb-2">
              Start typing location keywords such as <span className="font-mono font-semibold px-1.5 py-0.5 bg-zinc-100 rounded text-zinc-900">orch</span>. An official LTA dropdown opens instantly showing similar variations across Orchard Road and Singapore:
            </p>
            <ul className="text-xs text-zinc-600 space-y-1 list-disc pl-5">
              <li><span className="font-semibold text-zinc-900">09048</span>: Orchard Stn/Tang Plaza (Orchard Rd)</li>
              <li><span className="font-semibold text-zinc-900">09047</span>: Opp Orchard Stn (Orchard Blvd)</li>
              <li><span className="font-semibold text-zinc-900">09022</span>: Orchard Stn/Lucky Plaza (Orchard Rd)</li>
              <li><span className="font-semibold text-zinc-900">09059</span>: Delfi Orchard (Orchard Rd)</li>
            </ul>
          </div>

          {/* Section 4: Error Prevention & Helpful Guidance */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
                4
              </span>
              <h3>Error Prevention & Helpful Guidance (Heuristics #5 & #9)</h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-600">
              <p>
                <span className="font-semibold text-zinc-900">Strict 5-Digit Validation:</span> All Singapore bus stops are strictly 5 numeric digits. If you enter non-digits or fewer digits, you will receive the exact prompt:
                <span className="block mt-1 font-mono text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                  "make sure to include numeric 5 digit code"
                </span>
              </p>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <p>
                  <span className="font-bold">Helpful Tip:</span> Unsure of your bus stop number?
                  <span className="font-semibold text-amber-950"> Refer to bus stop pole board/ panel for bus stop details</span> before searching.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: User Control & Freedom */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                5
              </span>
              <h3>User Control & Freedom (Heuristic #3)</h3>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              Easily save your daily stops (Home 🏠, Work 💼, School 🎓, Other ⭐) and delete them whenever you wish. If you delete a bookmark accidentally, use the instant <span className="font-semibold text-zinc-900">Undo</span> feature to restore it right away.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-end bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Got it, return to App
          </button>
        </div>
      </div>
    </div>
  );
}
