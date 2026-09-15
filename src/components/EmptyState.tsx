import React from 'react';
import { BellPlus, CheckCircle2, ListFilter, Calendar } from 'lucide-react';
import { FilterView } from '../types';

interface EmptyStateProps {
  currentView: FilterView;
  searchQuery: string;
  onNewReminder: () => void;
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentView,
  searchQuery,
  onNewReminder,
  onClearFilters,
}) => {
  if (searchQuery) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
          <ListFilter className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900">
          Rezultatų nerasta
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-4">
          Nerasta jokių priminimų, atitinkančių užklausą „{searchQuery}“.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
        >
          Išvalyti paiešką
        </button>
      </div>
    );
  }

  if (currentView === 'completed') {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900">
          Nėra atliktų priminimų
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1">
          Kai pažymėsite priminimą kaip atliktą, jis atsiras čia.
        </p>
      </div>
    );
  }

  if (currentView === 'overdue') {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900">
          Puiku! Nėra vėluojančių priminimų
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1">
          Visi jūsų suplanuoti darbai ir priminimai yra laiku.
        </p>
      </div>
    );
  }

  if (currentView === 'today') {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900">
          Šiandienai priminimų nėra
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-5">
          Norite ką nors suplanuoti šiai dienai?
        </p>
        <button
          type="button"
          onClick={onNewReminder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <BellPlus className="w-4 h-4" />
          Pridėti priminimą šiandienai
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
      <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        <BellPlus className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-stone-900">
        Nėra aktyvių priminimų
      </h3>
      <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-5">
        Pridėkite naują priminimą su terminu, prioritetu ir kategorija, kad nieko nepamirštumėte.
      </p>
      <button
        type="button"
        onClick={onNewReminder}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      >
        <BellPlus className="w-4 h-4" />
        Sukurti naują priminimą
      </button>
    </div>
  );
};
