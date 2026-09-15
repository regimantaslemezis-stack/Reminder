import React from 'react';
import { Plus, Bell, BellOff, Volume2, VolumeX, Search } from 'lucide-react';
import { getFormattedCurrentDate } from '../utils/date';

interface HeaderProps {
  onNewReminder: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationsSupported: boolean;
  notificationPermission: NotificationPermission;
  onRequestNotificationPermission: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewReminder,
  searchQuery,
  onSearchChange,
  soundEnabled,
  onToggleSound,
  notificationsSupported,
  notificationPermission,
  onRequestNotificationPermission,
}) => {
  const { weekday, date } = getFormattedCurrentDate();

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Date */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                Priminimai
              </h1>
            </div>
            <p className="text-xs font-medium text-stone-500 mt-1 capitalize">
              {weekday} • {date}
            </p>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reminder-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ieškoti priminimų arba pastabų..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all placeholder:text-stone-400 text-stone-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1"
                >
                  Išvalyti
                </button>
              )}
            </div>
          </div>

          {/* Controls & CTA */}
          <div className="flex items-center gap-2.5 justify-end">
            {/* Sound toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Garsas įjungtas' : 'Garsas išjungtas'}
              className={`p-2 rounded-lg border text-sm transition-colors flex items-center gap-1.5 ${
                soundEnabled
                  ? 'border-stone-200 text-stone-700 bg-stone-50 hover:bg-stone-100'
                  : 'border-stone-200 text-stone-400 bg-white hover:bg-stone-50'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-stone-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
              <span className="hidden sm:inline text-xs font-medium">
                {soundEnabled ? 'Garsas' : 'Nutildyta'}
              </span>
            </button>

            {/* Notification permission button */}
            {notificationsSupported && notificationPermission !== 'granted' && (
              <button
                type="button"
                onClick={onRequestNotificationPermission}
                title="Įjungti naršyklės pranešimus"
                className="px-2.5 py-2 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <BellOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Įjungti pranešimus</span>
              </button>
            )}

            {/* New Reminder CTA */}
            <button
              id="new-reminder-button"
              type="button"
              onClick={onNewReminder}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Naujas priminimas</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
