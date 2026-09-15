import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Flag, Repeat, Sparkles } from 'lucide-react';
import { Category, Priority, Recurrence, Reminder } from '../types';
import {
  getTodayString,
  getTomorrowString,
  getOffsetDateString,
  getCurrentTimeString,
} from '../utils/date';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'notified'>) => void;
  editingReminder?: Reminder | null;
  categories: Category[];
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingReminder,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('12:00');
  const [hasTime, setHasTime] = useState(true);
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'bendra');
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingReminder) {
      setTitle(editingReminder.title);
      setNotes(editingReminder.notes || '');
      setDueDate(editingReminder.dueDate || getTodayString());
      setDueTime(editingReminder.dueTime || '12:00');
      setHasTime(Boolean(editingReminder.dueTime));
      setPriority(editingReminder.priority);
      setCategoryId(editingReminder.categoryId);
      setRecurrence(editingReminder.recurrence);
    } else {
      // Default for new reminder
      setTitle('');
      setNotes('');
      setDueDate(getTodayString());
      setDueTime('18:00');
      setHasTime(true);
      setPriority('medium');
      setCategoryId(categories[0]?.id || 'bendra');
      setRecurrence('none');
    }
    setError('');
  }, [editingReminder, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Prašome įvesti priminimo pavadinimą');
      return;
    }

    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: hasTime && dueTime ? dueTime : undefined,
      priority,
      categoryId,
      recurrence,
    });
    onClose();
  };

  // Quick date presets
  const applyQuickDate = (date: string, time?: string) => {
    setDueDate(date);
    if (time) {
      setDueTime(time);
      setHasTime(true);
    }
  };

  const setPlusOneHour = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = '00';
    setDueDate(getTodayString());
    setDueTime(`${hours}:${minutes}`);
    setHasTime(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            {editingReminder ? 'Redaguoti priminimą' : 'Naujas priminimas'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Pavadinimas *
            </label>
            <input
              id="reminder-title-input"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ką norite atlikti ar prisiminti?"
              className={`w-full px-3.5 py-2.5 text-sm bg-stone-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-stone-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Pastabos / Detalės
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Papildoma informacija, adresas ar instrukcijos..."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none text-stone-800"
            />
          </div>

          {/* Quick Date Shortcuts */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Greitas datos parinkimas
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => applyQuickDate(getTodayString(), '18:00')}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                Šiandien 18:00
              </button>
              <button
                type="button"
                onClick={() => applyQuickDate(getTomorrowString(), '09:00')}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                Rytoj 09:00
              </button>
              <button
                type="button"
                onClick={setPlusOneHour}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                Po 1 val.
              </button>
              <button
                type="button"
                onClick={() => applyQuickDate(getOffsetDateString(7), '10:00')}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                Kitą savaitę
              </button>
            </div>
          </div>

          {/* Date & Time selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                Terminas (Data)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  Laikas
                </label>
                <button
                  type="button"
                  onClick={() => setHasTime(!hasTime)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {hasTime ? 'Be laiko' : 'Pridėti laiką'}
                </button>
              </div>
              {hasTime ? (
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-stone-100 border border-dashed border-stone-300 rounded-lg text-stone-400 italic">
                  Visa diena (be konkretaus laiko)
                </div>
              )}
            </div>
          </div>

          {/* Category & Recurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                Kategorija
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                <Repeat className="w-3.5 h-3.5 text-stone-500" />
                Pasikartojimas
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              >
                <option value="none">Vienkartinis</option>
                <option value="daily">Kasdien</option>
                <option value="weekly">Kas savaitę</option>
                <option value="monthly">Kas mėnesį</option>
              </select>
            </div>
          </div>

          {/* Priority selector */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              <Flag className="w-3.5 h-3.5 text-stone-500" />
              Prioritetas
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'low'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Žemas
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Vidutinis
              </button>

              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'high'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Aukštas
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Atšaukti
            </button>
            <button
              id="save-reminder-button"
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {editingReminder ? 'Išsaugoti pakeitimus' : 'Sukurti priminimą'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
