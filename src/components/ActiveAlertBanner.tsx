import React from 'react';
import { BellRing, Check, Clock, X } from 'lucide-react';
import { Reminder } from '../types';

interface ActiveAlertBannerProps {
  alertReminder: Reminder | null;
  onDismiss: () => void;
  onComplete: (id: string) => void;
  onSnooze: (id: string, minutes: number) => void;
}

export const ActiveAlertBanner: React.FC<ActiveAlertBannerProps> = ({
  alertReminder,
  onDismiss,
  onComplete,
  onSnooze,
}) => {
  if (!alertReminder) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-stone-900 text-white p-4 rounded-xl shadow-2xl border border-stone-700 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 animate-bounce">
          <BellRing className="w-5 h-5 text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Priminimas atėjo!
            </span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-semibold text-white mt-0.5 line-clamp-2">
            {alertReminder.title}
          </p>
          {alertReminder.notes && (
            <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">
              {alertReminder.notes}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 pt-1">
            <button
              type="button"
              onClick={() => onComplete(alertReminder.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Atlikta
            </button>
            <button
              type="button"
              onClick={() => onSnooze(alertReminder.id, 15)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Atidėti 15 min.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
