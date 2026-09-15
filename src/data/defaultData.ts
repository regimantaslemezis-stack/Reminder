import { Category, Reminder } from '../types';
import { getTodayString, getTomorrowString, getOffsetDateString } from '../utils/date';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'bendra',
    name: 'Bendra',
    color: '#64748b', // Slate
    bgLight: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
  },
  {
    id: 'darbas',
    name: 'Darbas',
    color: '#2563eb', // Blue
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  {
    id: 'asmeniniai',
    name: 'Asmeniniai',
    color: '#7c3aed', // Purple/Violet
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
  },
  {
    id: 'sveikata',
    name: 'Sveikata',
    color: '#059669', // Emerald
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'pirkiniai',
    name: 'Pirkiniai',
    color: '#d97706', // Amber
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
];

export function getInitialReminders(): Reminder[] {
  const today = getTodayString();
  const tomorrow = getTomorrowString();
  const nextWeek = getOffsetDateString(4);
  const now = new Date().toISOString();

  return [
    {
      id: 'rem-1',
      title: 'Apmokėti komunalinių paslaugų sąskaitas',
      notes: 'Elektra, vanduo ir šildymas už praėjusį mėnesį.',
      dueDate: today,
      dueTime: '18:00',
      priority: 'high',
      categoryId: 'asmeniniai',
      completed: false,
      recurrence: 'monthly',
      createdAt: now,
    },
    {
      id: 'rem-2',
      title: 'Paruošti savaitės darbų ataskaitą',
      notes: 'Apžvelgti įgyvendintus tikslus ir pateikti komandai per susitikimą.',
      dueDate: today,
      dueTime: '15:30',
      priority: 'high',
      categoryId: 'darbas',
      completed: false,
      recurrence: 'weekly',
      createdAt: now,
    },
    {
      id: 'rem-3',
      title: 'Vizitas pas gydytoją profilaktinei apžiūrai',
      notes: 'Klinikos adresas: Vilniaus g. 24, 203 kabinetas.',
      dueDate: tomorrow,
      dueTime: '10:00',
      priority: 'medium',
      categoryId: 'sveikata',
      completed: false,
      recurrence: 'none',
      createdAt: now,
    },
    {
      id: 'rem-4',
      title: 'Nupirkti produktus vakarienei',
      notes: 'Daržovės, alyvuogių aliejus, šviežia duona, kava.',
      dueDate: today,
      dueTime: '19:00',
      priority: 'low',
      categoryId: 'pirkiniai',
      completed: false,
      recurrence: 'none',
      createdAt: now,
    },
    {
      id: 'rem-5',
      title: 'Automobilio techninė apžiūra ir draudimas',
      notes: 'Patikrinti padangų slėgį ir galiojimo terminus.',
      dueDate: nextWeek,
      dueTime: '11:00',
      priority: 'medium',
      categoryId: 'asmeniniai',
      completed: false,
      recurrence: 'none',
      createdAt: now,
    },
    {
      id: 'rem-6',
      title: 'Atnaujinti projekto dokumentaciją',
      notes: 'Surašyti naujai įdiegtus API modulius.',
      dueDate: getOffsetDateString(-1),
      dueTime: '16:00',
      priority: 'low',
      categoryId: 'darbas',
      completed: true,
      completedAt: now,
      recurrence: 'none',
      createdAt: now,
    },
  ];
}
