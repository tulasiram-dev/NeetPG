import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Plus, Trash2, RefreshCcw, BookOpen, Clock, TrendingUp, Filter } from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcsvfbz_oMi6DNaCEKbOx9ts853Fa--qx503oYz5TdipqthiEbAX_iop36FZFEwloC/exec';

const ALL_SUBJECTS = [
  'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
  'Microbiology', 'Forensic Medicine', 'Communigit push --forcety Medicine', 'Medicine',
  'Surgery', 'OBG', 'Pediatrics', 'Orthopedics', 'ENT', 'Ophthalmology',
  'Psychiatry', 'Dermatology', 'Radiology', 'Anesthesia'
];

const SUBJECT_COLORS = {
  'Anatomy':           { bg: 'bg-rose-100',    text: 'text-rose-700',    active: 'bg-rose-500' },
  'Physiology':        { bg: 'bg-orange-100',  text: 'text-orange-700',  active: 'bg-orange-500' },
  'Biochemistry':      { bg: 'bg-amber-100',   text: 'text-amber-700',   active: 'bg-amber-500' },
  'Pathology':         { bg: 'bg-yellow-100',  text: 'text-yellow-700',  active: 'bg-yellow-500' },
  'Pharmacology':      { bg: 'bg-lime-100',    text: 'text-lime-700',    active: 'bg-lime-500' },
  'Microbiology':      { bg: 'bg-green-100',   text: 'text-green-700',   active: 'bg-green-500' },
  'Forensic Medicine': { bg: 'bg-teal-100',    text: 'text-teal-700',    active: 'bg-teal-500' },
  'Community Medicine':{ bg: 'bg-cyan-100',    text: 'text-cyan-700',    active: 'bg-cyan-500' },
  'Medicine':          { bg: 'bg-sky-100',     text: 'text-sky-700',     active: 'bg-sky-500' },
  'Surgery':           { bg: 'bg-blue-100',    text: 'text-blue-700',    active: 'bg-blue-500' },
  'OBG':               { bg: 'bg-indigo-100',  text: 'text-indigo-700',  active: 'bg-indigo-500' },
  'Pediatrics':        { bg: 'bg-violet-100',  text: 'text-violet-700',  active: 'bg-violet-500' },
  'Orthopedics':       { bg: 'bg-purple-100',  text: 'text-purple-700',  active: 'bg-purple-500' },
  'ENT':               { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', active: 'bg-fuchsia-500' },
  'Ophthalmology':     { bg: 'bg-pink-100',    text: 'text-pink-700',    active: 'bg-pink-500' },
  'Psychiatry':        { bg: 'bg-rose-100',    text: 'text-rose-600',    active: 'bg-rose-400' },
  'Dermatology':       { bg: 'bg-orange-100',  text: 'text-orange-600',  active: 'bg-orange-400' },
  'Radiology':         { bg: 'bg-slate-100',   text: 'text-slate-700',   active: 'bg-slate-500' },
  'Anesthesia':        { bg: 'bg-gray-100',    text: 'text-gray-700',    active: 'bg-gray-500' },
};

const emptyForm = {
  name: '',
  subjects: [],
  correct: '',
  incorrect: '',
  left: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
};

export default function CustomModules({ onBack }) {
  const [modules, setModules] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterSubject, setFilterSubject] = useState('All');

  // ─── Load ──────────────────────────────────────────────────────────────────
  const loadData = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const data = await res.json();
      setModules((data.customModules || []).filter(m => m.status !== 'deleted'));
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Sync ──────────────────────────────────────────────────────────────────
  const syncData = async (updatedModules) => {
    setIsFetching(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'module_update', modules: updatedModules })
      });
    } catch (e) {
      console.error('Sync error:', e);
      alert('Network Error: Could not sync. Please try again.');
    } finally {
      setTimeout(() => setIsFetching(false), 1000);
    }
  };

  const toggleSubject = (sub) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(sub)
        ? f.subjects.filter(s => s !== sub)
        : [...f.subjects, sub]
    }));
  };

  const saveModule = () => {
    if (form.subjects.length === 0) { alert('Select at least one subject.'); return; }
    if (!form.correct && form.correct !== '0') { alert("Enter 'Correct' count."); return; }
    const c = parseInt(form.correct || 0);
    const w = parseInt(form.incorrect || 0);
    const l = parseInt(form.left || 0);
    const total = c + w + l;
    const maxMarks = total * 4;
    const score = (c * 4) - w;
    const accuracy = maxMarks > 0 ? ((score / maxMarks) * 100).toFixed(1) : '0.0';
    const newMod = { ...form, id: Date.now().toString(), score, accuracy, maxMarks, correct: c, incorrect: w, left: l, total };
    const updated = [...modules, newMod];
    setModules(updated);
    syncData(updated);
    setForm(emptyForm);
    setShowForm(false);
  };

  // FIX: null-safe delete
  const deleteModule = (id) => {
    const updated = modules.filter(m => (m.id ?? '').toString() !== id.toString());
    setModules(updated);
    syncData(updated);
  };

  const filtered = useMemo(() => {
    const list = filterSubject === 'All'
      ? [...modules]
      : modules.filter(m => m.subjects?.includes(filterSubject));
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [modules, filterSubject]);

  const avgAccuracy = modules.length > 0
    ? (modules.reduce((a, m) => a + parseFloat(m.accuracy), 0) / modules.length).toFixed(1)
    : '0.0';

  const totalQs = modules.reduce((a, m) => a + (m.total || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-4 md:p-8 text-white">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-2xl transition-all font-bold text-sm touch-manipulation"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={loadData}
              className={`p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all touch-manipulation ${isFetching ? 'animate-spin' : ''}`}
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight mb-1 flex items-center gap-2 md:gap-3">
            <BookOpen size={24} /> Custom Modules
          </h1>
          <p className="text-white/70 text-xs md:text-sm font-medium">Multi-subject test tracker</p>

          {/* FIX: stats grid — responsive text sizes so nothing overflows on 360px */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4">
              <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-70 mb-1 leading-tight">Logged</p>
              <p className="text-xl md:text-2xl font-black">{modules.length}</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4">
              <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-70 mb-1 leading-tight">Avg Acc.</p>
              <p className="text-xl md:text-2xl font-black">{avgAccuracy}%</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4">
              {/* FIX: "Qs Attempted" was overflowing — shortened label */}
              <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-70 mb-1 leading-tight">Total Qs</p>
              <p className="text-xl md:text-2xl font-black">{totalQs}</p>
            </div>
          </div>
        </div>

        {/* ── Log New Module ── */}
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
          {!showForm ? (
            <div className="flex flex-col items-center gap-3 py-3 md:py-4">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Log New Custom Module</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-4 md:p-5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform touch-manipulation"
              >
                <Plus size={28} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-gray-800 uppercase text-xs md:text-sm tracking-wide">New Module</h3>
                <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="text-gray-400 hover:text-gray-600 font-bold text-sm">Cancel</button>
              </div>

              {/* Module name + date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Module Name <span className="text-gray-300">(optional)</span></span>
                  <input
                    type="text"
                    placeholder="e.g. Weak Areas Mix, CVS Blitz..."
                    className="p-2.5 md:p-3 bg-gray-50 rounded-xl font-semibold text-sm border-none outline-none text-gray-700 placeholder-gray-300"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</span>
                  <input
                    type="date"
                    className="p-2.5 md:p-3 bg-gray-50 rounded-xl font-bold text-sm border-none outline-none"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
              </div>

              {/* FIX: Subject picker — bounded max-height, scrollable, so score inputs are always visible */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                    Subjects <span className="text-indigo-500">({form.subjects.length} selected)</span>
                  </span>
                  {form.subjects.length > 0 && (
                    <button onClick={() => setForm(f => ({ ...f, subjects: [] }))}
                      className="text-[10px] font-bold text-red-400 hover:text-red-600">
                      Clear all
                    </button>
                  )}
                </div>
                {/* Scrollable chip container */}
                <div className="max-h-36 overflow-y-auto rounded-xl bg-gray-50 p-2">
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SUBJECTS.map(sub => {
                      const isSelected = form.subjects.includes(sub);
                      const colors = SUBJECT_COLORS[sub] || { bg: 'bg-gray-100', text: 'text-gray-600', active: 'bg-gray-500' };
                      return (
                        <button
                          key={sub}
                          onClick={() => toggleSubject(sub)}
                          className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold uppercase transition-all touch-manipulation
                            ${isSelected
                              ? `${colors.active} text-white shadow-md`
                              : `${colors.bg} ${colors.text}`
                            }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* FIX: Selected chips summary visible below picker */}
                {form.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.subjects.map(sub => {
                      const colors = SUBJECT_COLORS[sub] || { bg: 'bg-gray-100', text: 'text-gray-500' };
                      return (
                        <span key={sub} className={`${colors.bg} ${colors.text} text-[9px] font-black uppercase px-2 py-0.5 rounded-full`}>
                          {sub}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Correct</span>
                  <input type="number" inputMode="numeric" placeholder="0"
                    className="p-2.5 md:p-3 bg-green-50 rounded-xl font-bold text-green-700 text-sm border-none outline-none"
                    value={form.correct} onChange={e => setForm(f => ({ ...f, correct: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Wrong</span>
                  <input type="number" inputMode="numeric" placeholder="0"
                    className="p-2.5 md:p-3 bg-red-50 rounded-xl font-bold text-red-600 text-sm border-none outline-none"
                    value={form.incorrect} onChange={e => setForm(f => ({ ...f, incorrect: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Left</span>
                  <input type="number" inputMode="numeric" placeholder="0"
                    className="p-2.5 md:p-3 bg-gray-50 rounded-xl font-bold text-gray-500 text-sm border-none outline-none"
                    value={form.left} onChange={e => setForm(f => ({ ...f, left: e.target.value }))} />
                </div>
              </div>

              {/* Notes — FIX: max-h so long notes don't push layout */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Notes <span className="text-gray-300">(optional)</span></span>
                <textarea
                  rows={2}
                  placeholder="Any observations, weak areas, things to revisit..."
                  className="p-2.5 md:p-3 bg-gray-50 rounded-xl text-sm border-none outline-none text-gray-600 placeholder-gray-300 resize-none font-medium max-h-24"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <button
                onClick={saveModule}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-3.5 md:py-4 rounded-xl font-black text-sm uppercase shadow-lg active:scale-95 transition-transform tracking-wide"
              >
                Save Module
              </button>
            </div>
          )}
        </div>

        {/* ── Filter + History ── */}
        {modules.length > 0 && (
          <>
            <div className="bg-white p-3 md:p-4 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Filter size={16} />
                <span className="font-bold text-sm uppercase tracking-tight">Module History</span>
              </div>
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="w-full sm:w-64 p-2.5 md:p-3 bg-indigo-50 rounded-2xl font-bold text-xs text-indigo-700 border-none outline-none text-center shadow-inner"
              >
                <option value="All">ALL SUBJECTS</option>
                {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-3 pb-10">
              {filtered.map(mod => {
                const acc = parseFloat(mod.accuracy);
                return (
                  <div
                    key={mod.id}
                    className={`bg-white p-4 md:p-5 rounded-2xl shadow-md border-l-8 transition-all
                      ${acc >= 70 ? 'border-green-400' : acc >= 50 ? 'border-amber-400' : 'border-red-500'}`}
                  >
                    {/* FIX: top row — prevent collision on narrow screens by capping score width */}
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        {/* FIX: truncate long module names */}
                        <p className="font-black text-gray-800 text-sm uppercase tracking-tight truncate">
                          {mod.name || 'Custom Module'}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5 flex-wrap">
                          <Clock size={9} />
                          {new Date(mod.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                          <span className="ml-1">{mod.total} Qs</span>
                          <span className="mx-0.5">·</span>
                          <span className={acc >= 70 ? 'text-green-600' : acc >= 50 ? 'text-amber-600' : 'text-red-600'}>
                            {mod.accuracy}%
                          </span>
                        </p>
                      </div>
                      {/* FIX: score column — fixed min-width so it never squeezes the title */}
                      <div className="flex flex-col items-end gap-0.5 shrink-0 min-w-[56px]">
                        <span className={`text-lg md:text-xl font-black leading-none ${acc >= 70 ? 'text-green-600' : acc >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {mod.score}
                        </span>
                        <span className="text-[9px] text-gray-300 font-normal">/ {mod.maxMarks}</span>
                        <button onClick={() => deleteModule(mod.id)}
                          className="text-red-200 hover:text-red-500 transition-colors mt-1 p-1 touch-manipulation">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subject chips */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(mod.subjects || []).map(sub => {
                        const colors = SUBJECT_COLORS[sub] || { bg: 'bg-gray-100', text: 'text-gray-500' };
                        return (
                          <span key={sub} className={`${colors.bg} ${colors.text} text-[9px] font-black uppercase px-2 py-0.5 rounded-full`}>
                            {sub}
                          </span>
                        );
                      })}
                    </div>

                    {/* C / W / L */}
                    <div className="flex gap-3 text-[10px] font-bold">
                      <span className="text-green-600">✓ {mod.correct}</span>
                      <span className="text-red-500">✗ {mod.incorrect}</span>
                      <span className="text-gray-400">— {mod.left}</span>
                    </div>

                    {/* Notes — FIX: line-clamp so very long notes don't take over the card */}
                    {mod.notes && (
                      <p className="mt-2 text-[11px] text-gray-400 italic border-t border-gray-100 pt-2 line-clamp-2">
                        {mod.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {modules.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-300">
            <BookOpen size={44} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold uppercase text-sm tracking-widest">No modules logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}