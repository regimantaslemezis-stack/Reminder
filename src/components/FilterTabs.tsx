import React from 'react';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListFilter,
  ArrowUpDown,
  Tag,
  Settings2,
} from 'lucide-react';
import { Category, FilterView, SortOption } from '../types';

interface FilterTabsProps {
  currentView: FilterView;
  onViewChange: (view: FilterView) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  categories: Category[];
  counts: {
    all: number;
    today: number;
    upcoming: number;
    overdue: number;
    completed: number;
  };
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenCategoryManager: () => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  currentView,
  onViewChange,
  selectedCategory,
  onCategorySelect,
  categories,
  counts,
  sortOption,
  onSortChange,
  onOpenCategoryManager,
}) => {
  const tabs: { id: FilterView; label: string; icon: React.ReactNode; count: number; countColor?: string }[] = [
    {
      id: 'all',
      label: 'Visi',
      icon: <ListFilter className="w-4 h-4" />,
      count: counts.all,
    },
    {
      id: 'today',
      label: 'Šiandien',
      icon: <Clock className="w-4 h-4" />,
      count: counts.today,
      countColor: counts.today > 0 ? 'bg-amber-100 text-amber-800 font-semibold' : undefined,
    },
    {
      id: 'upcoming',
      label: 'Suplanuoti',
      icon: <Calendar className="w-4 h-4" />,
      count: counts.upcoming,
    },
    {
      id: 'overdue',
      label: 'Vėluojantys',
      icon: <AlertCircle className="w-4 h-4" />,
      count: counts.overdue,
      countColor: counts.overdue > 0 ? 'bg-rose-100 text-rose-800 font-bold animate-pulse' : undefined,
    },
    {
      id: 'completed',
      label: 'Atlikti',
      icon: <CheckCircle2 className="w-4 h-4" />,
      count: counts.completed,
    },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Primary view tabs & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        {/* Horizontal tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                type="button"
                onClick={() => onViewChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-stone-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tab.countColor
                      ? tab.countColor
                      : isActive
                      ? 'bg-blue-200/70 text-blue-900'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs bg-white border border-stone-200 hover:border-stone-300 text-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="date-asc">Pagal terminą (artimiausi pirma)</option>
            <option value="date-desc">Pagal terminą (vėliausi pirma)</option>
            <option value="priority">Pagal prioritetą (aukščiausias)</option>
            <option value="title">Pagal pavadinimą (A-Z)</option>
            <option value="created">Pagal sukūrimo datą</option>
          </select>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-stone-400 mr-1 flex items-center gap-1 shrink-0 font-medium">
            <Tag className="w-3 h-3" /> Kategorija:
          </span>
          <button
            type="button"
            onClick={() => onCategorySelect(null)}
            className={`px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === null
                ? 'bg-stone-800 text-white border-stone-800 font-medium'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Visos
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategorySelect(isSelected ? null : cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
                    : `${cat.bgLight} ${cat.textColor} ${cat.borderColor} hover:opacity-90`
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCategoryManager}
          title="Tvarkyti kategorijas"
          className="text-stone-500 hover:text-stone-800 hover:bg-stone-100 p-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Kategorijos</span>
        </button>
      </div>
    </div>
  );
};
