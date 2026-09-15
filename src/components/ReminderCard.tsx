import React, { useState } from 'react';
import {
  Check,
  Clock,
  AlertCircle,
  Calendar,
  Repeat,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FastForward,
} from 'lucide-react';
import { Category, Priority, Reminder } from '../types';
import {
  formatLithuanianDate,
  isDateToday,
  isReminderOverdue,
} from '../utils/date';

interface ReminderCardProps {
  reminder: Reminder;
  category?: Category;
  onToggleComplete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onSnooze: (id: string, hours: number) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  category,
  onToggleComplete,
  onEdit,
  onDelete,
  onSnooze,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isOverdue = !reminder.completed && isReminderOverdue(reminder.dueDate, reminder.dueTime);
  const isToday = !reminder.completed && isDateToday(reminder.dueDate);

  const priorityLabels: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
    high: {
      label: 'Aukštas',
      bg: 'bg-rose-50 border-rose-200',
      text: 'text-rose-700 font-semibold',
      dot: 'bg-rose-500',
    },
    medium: {
      label: 'Vidutinis',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800 font-medium',
      dot: 'bg-amber-500',
    },
    low: {
      label: 'Žemas',
      bg: 'bg-slate-50 border-slate-200',
      text: 'text-slate-600',
      dot: 'bg-slate-400',
    },
  };

  const recurrenceLabels: Record<string, string> = {
    daily: 'Kasdien',
    weekly: 'Kas savaitę',
    monthly: 'Kas mėnesį',
  };

  const priorityInfo = priorityLabels[reminder.priority];

  return (
    <div
      id={`reminder-card-${reminder.id}`}
      className={`group relative rounded-xl border transition-all duration-150 ${
        reminder.completed
          ? 'bg-stone-50/70 border-stone-200 opacity-60'
          : isOverdue
          ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300 shadow-xs'
          : isToday
          ? 'bg-amber-50/20 border-amber-200 hover:border-amber-300 shadow-xs'
          : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="p-4 flex items-start gap-3.5">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(reminder.id)}
          aria-label={reminder.completed ? 'Pažymėti kaip neatliktą' : 'Pažymėti kaip atliktą'}
          className={`shrink-0 w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
            reminder.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-stone-300 bg-white hover:border-blue-500 hover:bg-blue-50/30 text-transparent'
          }`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] ${reminder.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-semibold leading-snug break-words ${
                reminder.completed
                  ? 'line-through text-stone-500'
                  : isOverdue
                  ? 'text-rose-950'
                  : 'text-stone-900'
              }`}
            >
              {reminder.title}
            </h3>

            {/* Quick action menu trigger */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                title="Daugiau veiksmų"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-20 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(reminder);
                      }}
                      className="w-full px-3 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                      Redaguoti
                    </button>

                    {!reminder.completed && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMenu(false);
                            onSnooze(reminder.id, 1);
                          }}
                          className="w-full px-3 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                        >
                          <FastForward className="w-3.5 h-3.5 text-amber-500" />
                          Atidėti 1 val.
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMenu(false);
                            onSnooze(reminder.id, 24);
                          }}
                          className="w-full px-3 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                        >
                          <FastForward className="w-3.5 h-3.5 text-blue-500" />
                          Atidėti rytojui
                        </button>
                      </>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(reminder.id);
                      }}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Ištrinti
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes description */}
          {reminder.notes && (
            <div className="mt-1">
              <p
                className={`text-xs text-stone-600 leading-relaxed ${
                  !isExpanded ? 'line-clamp-2' : ''
                }`}
              >
                {reminder.notes}
              </p>
              {reminder.notes.length > 80 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 mt-0.5"
                >
                  {isExpanded ? (
                    <>
                      Suskleisti <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Rodyti daugiau <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Metadata badges: Date/Time, Category, Priority, Recurrence */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            {/* Due Date/Time Badge */}
            {reminder.dueDate ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium ${
                  reminder.completed
                    ? 'bg-stone-100 border-stone-200 text-stone-500'
                    : isOverdue
                    ? 'bg-rose-100/80 border-rose-300 text-rose-800 font-semibold'
                    : isToday
                    ? 'bg-amber-100/70 border-amber-300 text-amber-800'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                ) : isToday ? (
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                )}
                <span>
                  {formatLithuanianDate(reminder.dueDate, reminder.dueTime)}
                </span>
                {isOverdue && !reminder.completed && (
                  <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                    VĖLUOJA
                  </span>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-stone-400 text-xs italic">
                <Calendar className="w-3 h-3" /> Be datos
              </span>
            )}

            {/* Category badge */}
            {category && (
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium ${category.bgLight} ${category.textColor} ${category.borderColor}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            )}

            {/* Priority badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] ${priorityInfo.bg} ${priorityInfo.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dot}`} />
              {priorityInfo.label}
            </span>

            {/* Recurrence badge */}
            {reminder.recurrence && reminder.recurrence !== 'none' && (
              <span
                title={`Pasikartoja: ${recurrenceLabels[reminder.recurrence]}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[11px]"
              >
                <Repeat className="w-3 h-3 text-stone-500" />
                {recurrenceLabels[reminder.recurrence]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
