import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  reminderCountsByCategory: Record<string, number>;
}

const COLOR_OPTIONS = [
  {
    name: 'Mėlyna',
    color: '#2563eb',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  {
    name: 'Violetinė',
    color: '#7c3aed',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
  },
  {
    name: 'Žalia',
    color: '#059669',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  {
    name: 'Gintarinė',
    color: '#d97706',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  {
    name: 'Rausva',
    color: '#e11d48',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
  {
    name: 'Pilka',
    color: '#64748b',
    bgLight: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
  },
  {
    name: 'Indigo',
    color: '#4f46e5',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
  },
  {
    name: 'Teal',
    color: '#0d9488',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
  },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
  reminderCountsByCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setError('Įveskite kategorijos pavadinimą');
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Kategorija tokiu pavadinimu jau egzistuoja');
      return;
    }

    const chosenColor = COLOR_OPTIONS[selectedColorIdx];
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      color: chosenColor.color,
      bgLight: chosenColor.bgLight,
      textColor: chosenColor.textColor,
      borderColor: chosenColor.borderColor,
    };

    onAddCategory(newCat);
    setNewCategoryName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            Kategorijų valdymas
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Create new category form */}
          <form onSubmit={handleCreate} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Pridėti naują kategoriją
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Pvz.: Finansai, Hobiai, Studijos..."
                className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Pridėti
              </button>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}

            {/* Color selection */}
            <div>
              <span className="text-[11px] text-stone-500 block mb-1.5 font-medium">
                Pasirinkite spalvą:
              </span>
              <div className="flex items-center gap-2">
                {COLOR_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: opt.color }}
                    title={opt.name}
                  />
                ))}
              </div>
            </div>
          </form>

          <div className="border-t border-stone-100 pt-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              Esamos kategorijos ({categories.length})
            </span>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = reminderCountsByCategory[cat.id] || 0;
                const canDelete = categories.length > 1;

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-stone-800">
                        {cat.name}
                      </span>
                      <span className="text-xs text-stone-400">
                        ({count} {count === 1 ? 'priminimas' : 'priminimai'})
                      </span>
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Ištrinti kategoriją"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer"
          >
            Uždaryti
          </button>
        </div>
      </div>
    </div>
  );
};
