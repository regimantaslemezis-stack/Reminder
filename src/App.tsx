/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Category,
  FilterView,
  Priority,
  Reminder,
  SortOption,
} from './types';
import { DEFAULT_CATEGORIES, getInitialReminders } from './data/defaultData';
import {
  getTodayString,
  getTomorrowString,
  getCurrentTimeString,
  isDateToday,
  isReminderOverdue,
} from './utils/date';
import { notificationSound } from './utils/audio';
import { Header } from './components/Header';
import { FilterTabs } from './components/FilterTabs';
import { ReminderCard } from './components/ReminderCard';
import { ReminderModal } from './components/ReminderModal';
import { CategoryModal } from './components/CategoryModal';
import { ActiveAlertBanner } from './components/ActiveAlertBanner';
import { EmptyState } from './components/EmptyState';
import { Plus, CheckSquare, Calendar, Sparkles } from 'lucide-react';

const STORAGE_REMINDERS_KEY = 'priminimai_app_reminders_v1';
const STORAGE_CATEGORIES_KEY = 'priminimai_app_categories_v1';
const STORAGE_SOUND_KEY = 'priminimai_app_sound_v1';

export default function App() {
  // --- Persistent State ---
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REMINDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return getInitialReminders();
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CATEGORIES;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOUND_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // --- Filtering & Sorting State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<FilterView>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');

  // --- Modals State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // --- Quick Add Inline State ---
  const [quickTitle, setQuickTitle] = useState('');

  // --- Alert / Notification State ---
  const [activeAlertReminder, setActiveAlertReminder] = useState<Reminder | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // Sync sound settings to audio synthesizer
  useEffect(() => {
    notificationSound.setSoundEnabled(soundEnabled);
    localStorage.setItem(STORAGE_SOUND_KEY, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Save reminders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REMINDERS_KEY, JSON.stringify(reminders));
    } catch {
      // storage quota or private browsing
    }
  }, [reminders]);

  // Save categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      // storage quota
    }
  }, [categories]);

  // Request browser notifications
  const handleRequestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      } catch {
        // ignore
      }
    }
  }, []);

  // Periodic reminder checking for due times (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayString();
      const currentTime = getCurrentTimeString();

      const dueItem = reminders.find((r) => {
        if (r.completed || r.notified) return false;
        if (!r.dueDate || !r.dueTime) return false;

        // Due today at this minute or slightly before
        if (r.dueDate === today && r.dueTime <= currentTime) {
          return true;
        }
        return false;
      });

      if (dueItem) {
        setActiveAlertReminder(dueItem);
        notificationSound.playChime();

        // Mark as notified in state so it doesn't chime continuously
        setReminders((prev) =>
          prev.map((rem) =>
            rem.id === dueItem.id ? { ...rem, notified: true } : rem
          )
        );

        // Native browser notification if granted
        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          try {
            new Notification('Priminimas: ' + dueItem.title, {
              body: dueItem.notes || 'Atėjo laikas suplanuotai užduočiai!',
              icon: '/favicon.ico',
            });
          } catch {
            // ignore
          }
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders]);

  // --- Handlers ---
  const handleToggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const nextCompleted = !r.completed;

        if (nextCompleted) {
          notificationSound.playCompleteSound();

          // Handle recurrence if configured
          if (r.recurrence && r.recurrence !== 'none') {
            const currentDate = r.dueDate ? new Date(r.dueDate) : new Date();
            if (r.recurrence === 'daily') {
              currentDate.setDate(currentDate.getDate() + 1);
            } else if (r.recurrence === 'weekly') {
              currentDate.setDate(currentDate.getDate() + 7);
            } else if (r.recurrence === 'monthly') {
              currentDate.setMonth(currentDate.getMonth() + 1);
            }

            const y = currentDate.getFullYear();
            const m = String(currentDate.getMonth() + 1).padStart(2, '0');
            const d = String(currentDate.getDate()).padStart(2, '0');
            const nextDueDate = `${y}-${m}-${d}`;

            return {
              ...r,
              dueDate: nextDueDate,
              completed: false,
              notified: false,
            };
          }

          return {
            ...r,
            completed: true,
            completedAt: new Date().toISOString(),
          };
        } else {
          return {
            ...r,
            completed: false,
            completedAt: undefined,
          };
        }
      })
    );
  };

  const handleSaveReminder = (
    data: Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'notified'>
  ) => {
    if (editingReminder) {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingReminder.id
            ? { ...r, ...data, notified: false }
            : r
        )
      );
      setEditingReminder(null);
    } else {
      const newReminder: Reminder = {
        id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        ...data,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setReminders((prev) => [newReminder, ...prev]);
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (activeAlertReminder?.id === id) {
      setActiveAlertReminder(null);
    }
  };

  const handleSnooze = (id: string, hoursOrMinutes: number) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const d = new Date();
        if (hoursOrMinutes >= 1) {
          d.setHours(d.getHours() + hoursOrMinutes);
        } else {
          d.setMinutes(d.getMinutes() + 15);
        }

        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');

        return {
          ...r,
          dueDate: `${y}-${m}-${day}`,
          dueTime: `${hrs}:${mins}`,
          notified: false,
        };
      })
    );
    if (activeAlertReminder?.id === id) {
      setActiveAlertReminder(null);
    }
  };

  // Quick inline entry submit
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      title: quickTitle.trim(),
      dueDate: getTodayString(),
      dueTime: '18:00',
      priority: 'medium',
      categoryId: selectedCategory || categories[0]?.id || 'bendra',
      completed: false,
      recurrence: 'none',
      createdAt: new Date().toISOString(),
    };

    setReminders((prev) => [newReminder, ...prev]);
    setQuickTitle('');
  };

  // Category management
  const handleAddCategory = (cat: Category) => {
    setCategories((prev) => [...prev, cat]);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    }
    // Reassign reminders of deleted category to first available
    const fallbackId = categories.find((c) => c.id !== catId)?.id || 'bendra';
    setReminders((prev) =>
      prev.map((r) => (r.categoryId === catId ? { ...r, categoryId: fallbackId } : r))
    );
  };

  // Category mapping
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  // Counts calculation
  const counts = useMemo(() => {
    let all = 0;
    let today = 0;
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;

    const todayStr = getTodayString();

    reminders.forEach((r) => {
      if (r.completed) {
        completed++;
      } else {
        all++;
        if (isReminderOverdue(r.dueDate, r.dueTime)) {
          overdue++;
        } else if (isDateToday(r.dueDate)) {
          today++;
        } else if (r.dueDate && r.dueDate > todayStr) {
          upcoming++;
        }
      }
    });

    return { all, today, upcoming, overdue, completed };
  }, [reminders]);

  const reminderCountsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    reminders.forEach((r) => {
      map[r.categoryId] = (map[r.categoryId] || 0) + 1;
    });
    return map;
  }, [reminders]);

  // Filter & Sort Reminders
  const filteredReminders = useMemo(() => {
    const todayStr = getTodayString();
    const query = searchQuery.trim().toLowerCase();

    return reminders
      .filter((r) => {
        // Search filter
        if (query) {
          const matchTitle = r.title.toLowerCase().includes(query);
          const matchNotes = r.notes ? r.notes.toLowerCase().includes(query) : false;
          if (!matchTitle && !matchNotes) return false;
        }

        // Category filter
        if (selectedCategory && r.categoryId !== selectedCategory) {
          return false;
        }

        // View filter
        if (currentView === 'completed') {
          return r.completed;
        }

        // For non-completed views
        if (r.completed) return false;

        if (currentView === 'today') {
          return isDateToday(r.dueDate);
        }
        if (currentView === 'upcoming') {
          return r.dueDate && r.dueDate > todayStr;
        }
        if (currentView === 'overdue') {
          return isReminderOverdue(r.dueDate, r.dueTime);
        }

        return true; // 'all' view
      })
      .sort((a, b) => {
        // Sorting
        if (sortOption === 'title') {
          return a.title.localeCompare(b.title, 'lt');
        }
        if (sortOption === 'created') {
          return b.createdAt.localeCompare(a.createdAt);
        }
        if (sortOption === 'priority') {
          const weight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortOption === 'date-desc') {
          const dateA = (a.dueDate || '') + (a.dueTime || '');
          const dateB = (b.dueDate || '') + (b.dueTime || '');
          return dateB.localeCompare(dateA);
        }
        // default: 'date-asc' (closest due date first)
        const dateA = (a.dueDate || '9999-99-99') + (a.dueTime || '99:99');
        const dateB = (b.dueDate || '9999-99-99') + (b.dueTime || '99:99');
        return dateA.localeCompare(dateB);
      });
  }, [reminders, searchQuery, selectedCategory, currentView, sortOption]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Header */}
      <Header
        onNewReminder={() => {
          setEditingReminder(null);
          setIsModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        notificationsSupported={typeof window !== 'undefined' && 'Notification' in window}
        notificationPermission={notificationPermission}
        onRequestNotificationPermission={handleRequestNotificationPermission}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Filter Tabs & Category Bar */}
        <FilterTabs
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categories={categories}
          counts={counts}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
        />

        {/* Quick inline creation bar */}
        <div className="mb-6">
          <form
            onSubmit={handleQuickAdd}
            className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-2 shadow-xs hover:border-stone-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          >
            <div className="pl-2 text-stone-400">
              <Plus className="w-5 h-5" />
            </div>
            <input
              id="quick-reminder-input"
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Greitas priminimas: įveskite užduotį ir spauskite Enter..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-stone-800 placeholder:text-stone-400"
            />
            {quickTitle.trim() && (
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Pridėti
              </button>
            )}
          </form>
        </div>

        {/* Section title & counter info */}
        <div className="flex items-center justify-between mb-3 text-xs text-stone-500 font-medium px-1">
          <div className="flex items-center gap-2">
            <span>
              {currentView === 'all' && 'Visi aktyvūs priminimai'}
              {currentView === 'today' && 'Šiandienos priminimai'}
              {currentView === 'upcoming' && 'Suplanuoti ateičiai'}
              {currentView === 'overdue' && 'Vėluojantys priminimai'}
              {currentView === 'completed' && 'Atlikti darbai ir priminimai'}
            </span>
            {selectedCategory && (
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                • {categoryMap.get(selectedCategory)?.name}
              </span>
            )}
          </div>
          <span>
            Rasta: {filteredReminders.length}
          </span>
        </div>

        {/* Reminders List or Empty State */}
        {filteredReminders.length === 0 ? (
          <EmptyState
            currentView={currentView}
            searchQuery={searchQuery}
            onNewReminder={() => {
              setEditingReminder(null);
              setIsModalOpen(true);
            }}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setCurrentView('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                category={categoryMap.get(reminder.categoryId)}
                onToggleComplete={handleToggleComplete}
                onEdit={(rem) => {
                  setEditingReminder(rem);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteReminder}
                onSnooze={handleSnooze}
              />
            ))}
          </div>
        )}
      </main>

      {/* Reminder Add / Edit Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReminder(null);
        }}
        onSave={handleSaveReminder}
        editingReminder={editingReminder}
        categories={categories}
      />

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        reminderCountsByCategory={reminderCountsByCategory}
      />

      {/* Active Time Alarm / Notification Banner */}
      <ActiveAlertBanner
        alertReminder={activeAlertReminder}
        onDismiss={() => setActiveAlertReminder(null)}
        onComplete={(id) => {
          handleToggleComplete(id);
          setActiveAlertReminder(null);
        }}
        onSnooze={(id, minutes) => {
          handleSnooze(id, minutes / 60);
          setActiveAlertReminder(null);
        }}
      />
    </div>
  );
}
