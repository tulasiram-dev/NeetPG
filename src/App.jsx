import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';
import { Target, Calendar, CheckCircle2, Zap, Trash2, Plus, RefreshCcw, TrendingUp, Filter, MapPin, Clock, Image as ImageIcon, BookOpen } from 'lucide-react';
import CustomModules from './CustomModules';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcsvfbz_oMi6DNaCEKbOx9ts853Fa--qx503oYz5TdipqthiEbAX_iop36FZFEwloC/exec';
const VAULT_URL = 'https://neet-pg-rud6.vercel.app/';

const SUBJECTS = ['All Subjects', 'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Medicine', 'Surgery', 'OBG', 'Pediatrics', 'Orthopedics', 'ENT', 'Ophthalmology', 'Psychiatry', 'Dermatology', 'Radiology', 'Anesthesia'];
const ALL_SUBJECTS = SUBJECTS.filter(s => s !== 'All Subjects');

const COLORS = ['#10B981', '#EF4444', '#94A3B8'];

const SUBJECT_COLORS = {
  'Anatomy':            { bg: 'bg-rose-100',    text: 'text-rose-700',    active: 'bg-rose-500' },
  'Physiology':         { bg: 'bg-orange-100',  text: 'text-orange-700',  active: 'bg-orange-500' },
  'Biochemistry':       { bg: 'bg-amber-100',   text: 'text-amber-700',   active: 'bg-amber-500' },
  'Pathology':          { bg: 'bg-yellow-100',  text: 'text-yellow-700',  active: 'bg-yellow-500' },
  'Pharmacology':       { bg: 'bg-lime-100',    text: 'text-lime-700',    active: 'bg-lime-500' },
  'Microbiology':       { bg: 'bg-green-100',   text: 'text-green-700',   active: 'bg-green-500' },
  'Forensic Medicine':  { bg: 'bg-teal-100',    text: 'text-teal-700',    active: 'bg-teal-500' },
  'Community Medicine': { bg: 'bg-cyan-100',    text: 'text-cyan-700',    active: 'bg-cyan-500' },
  'Medicine':           { bg: 'bg-sky-100',     text: 'text-sky-700',     active: 'bg-sky-500' },
  'Surgery':            { bg: 'bg-blue-100',    text: 'text-blue-700',    active: 'bg-blue-500' },
  'OBG':                { bg: 'bg-indigo-100',  text: 'text-indigo-700',  active: 'bg-indigo-500' },
  'Pediatrics':         { bg: 'bg-violet-100',  text: 'text-violet-700',  active: 'bg-violet-500' },
  'Orthopedics':        { bg: 'bg-purple-100',  text: 'text-purple-700',  active: 'bg-purple-500' },
  'ENT':                { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', active: 'bg-fuchsia-500' },
  'Ophthalmology':      { bg: 'bg-pink-100',    text: 'text-pink-700',    active: 'bg-pink-500' },
  'Psychiatry':         { bg: 'bg-rose-100',    text: 'text-rose-600',    active: 'bg-rose-400' },
  'Dermatology':        { bg: 'bg-orange-100',  text: 'text-orange-600',  active: 'bg-orange-400' },
  'Radiology':          { bg: 'bg-slate-100',   text: 'text-slate-700',   active: 'bg-slate-500' },
  'Anesthesia':         { bg: 'bg-gray-100',    text: 'text-gray-700',    active: 'bg-gray-500' },
};

const getTestSubjects = (test) => {
  if (Array.isArray(test.subjects) && test.subjects.length > 0) return test.subjects;
  if (test.subject && test.subject !== 'All Subjects') return [test.subject];
  return ['Grand Test'];
};

const testMatchesFilter = (test, filter) => {
  if (filter === 'All Subjects') return true;
  if (filter === 'Grand Test') return test.type === 'Grand Test';
  return getTestSubjects(test).includes(filter);
};

const DAILY_SCHEDULE = [
  { date: '2026-01-18', subject: 'Orientation', tasks: ['Orientation Session'] },
  { date: '2026-01-19', subject: 'OBG', tasks: ['OBG-1 Live', 'Workbook Annotation'] },
  { date: '2026-01-21', subject: 'OBG', tasks: ['OBG-2 Live', 'Workbook Annotation'] },
  { date: '2026-01-24', subject: 'OBG', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-01-26', subject: 'PSM', tasks: ['PSM-1 Live', 'Workbook Annotation'] },
  { date: '2026-01-28', subject: 'PSM', tasks: ['PSM-2 Live', 'Workbook Annotation'] },
  { date: '2026-01-31', subject: 'PSM', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-02-02', subject: 'Surgery', tasks: ['Surgery-1 Live', 'Workbook Annotation'] },
  { date: '2026-02-04', subject: 'Surgery', tasks: ['Surgery-2 Live', 'Workbook Annotation'] },
  { date: '2026-02-07', subject: 'Surgery', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-02-09', subject: 'Medicine', tasks: ['CVS Live', 'Workbook Annotation'] },
  { date: '2026-02-11', subject: 'Medicine', tasks: ['Hemat Live', 'Workbook Annotation'] },
  { date: '2026-02-14', subject: 'Medicine', tasks: ['Neuro Live', 'Active Recall'] },
  { date: '2026-02-16', subject: 'Physiology', tasks: ['Renal + Rheumat', 'Workbook Annotation'] },
  { date: '2026-02-18', subject: 'Physiology', tasks: ['Endocrine + GI', 'Workbook Annotation'] },
  { date: '2026-02-20', subject: 'Physiology', tasks: ['Respi + General Physio'] },
  { date: '2026-02-23', subject: 'Path/Pharma', tasks: ['General Path + Pharma', 'Integrated Systems'] },
  { date: '2026-02-25', subject: 'Path/Pharma', tasks: ['Integrated Systems Test-1'] },
  { date: '2026-02-28', subject: 'Path/Pharma', tasks: ['Integrated Systems Test-2'] },
  { date: '2026-03-02', subject: 'Microbiology', tasks: ['Microbiology Live', 'Workbook Annotation'] },
  { date: '2026-03-06', subject: 'Microbiology', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-03-08', subject: 'Anatomy', tasks: ['Anatomy Live', 'Workbook Annotation'] },
  { date: '2026-03-12', subject: 'Anatomy', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-03-14', subject: 'Biochemistry', tasks: ['Biochemistry Live', 'Workbook Annotation'] },
  { date: '2026-03-19', subject: 'Biochemistry', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-03-21', subject: 'Pediatrics', tasks: ['Pediatrics Live', 'Workbook Annotation'] },
  { date: '2026-03-25', subject: 'Pediatrics', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-03-27', subject: 'Radiology', tasks: ['Radiology Live', 'Workbook Annotation'] },
  { date: '2026-03-31', subject: 'Radiology', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-04-02', subject: 'ENT', tasks: ['ENT Live', 'Workbook Annotation'] },
  { date: '2026-04-06', subject: 'ENT', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-04-08', subject: 'Ophthalmology', tasks: ['Ophthalmology Live', 'Workbook'] },
  { date: '2026-04-12', subject: 'Ophthalmology', tasks: ['Test-discussion', 'Recall'] },
  { date: '2026-04-14', subject: 'FMT', tasks: ['FMT Live', 'Workbook Annotation'] },
  { date: '2026-04-17', subject: 'FMT', tasks: ['Test-discussion', 'Active Recall'] },
  { date: '2026-04-19', subject: 'Psychiatry', tasks: ['Psychiatry Live', 'Workbook'] },
  { date: '2026-04-21', subject: 'Dermatology', tasks: ['Dermatology Live', 'Workbook'] },
  { date: '2026-04-24', subject: 'Short Subjects', tasks: ['Psych-Derma Test-discussion'] },
  { date: '2026-04-25', subject: 'Anesthesia', tasks: ['Anesthesia Live', 'Workbook'] },
  { date: '2026-04-28', subject: 'Orthopedics', tasks: ['Orthopedics Live', 'Workbook'] },
  { date: '2026-05-01', subject: 'Short Subjects', tasks: ['Anesthesia-Ortho Test-discussion'] },
  { date: '2026-05-07', subject: 'Mocks', tasks: ['Mock-GT-1 Analysis'] },
  { date: '2026-05-09', subject: 'Mocks', tasks: ['Mock-GT-2 Analysis'] },
  { date: '2026-05-11', subject: 'Revision', tasks: ['INICET Mock GT', 'Volatile Review'] },
  { date: '2026-05-17', subject: 'INICET', tasks: ['INICET EXAM DAY 🎯'] },
  { date: '2026-08-30', subject: 'NEET PG', tasks: ['NEET PG EXAM DAY 🏆'] }
];

const EMPTY_TEST = {
  type: 'Grand Test',
  subjects: [],
  correct: '',
  incorrect: '',
  left: '',
  date: new Date().toISOString().split('T')[0]
};

// FIX: Reusable subject chip picker — max-height scrollable container so it never 
// pushes score inputs off screen on mobile
function SubjectPicker({ selected, onToggle, onClear }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">
          Subjects <span className="text-purple-500">({selected.length} selected)</span>
        </span>
        {selected.length > 0 && (
          <button onClick={onClear} className="text-[10px] font-bold text-red-400 hover:text-red-600">
            Clear all
          </button>
        )}
      </div>
      {/* FIX: max-h + overflow-y-auto so chips never overflow the form panel on mobile */}
      <div className="max-h-36 overflow-y-auto rounded-xl bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1.5">
          {ALL_SUBJECTS.map(sub => {
            const isSelected = selected.includes(sub);
            const c = SUBJECT_COLORS[sub] || { bg: 'bg-gray-100', text: 'text-gray-600', active: 'bg-gray-500' };
            return (
              <button
                key={sub}
                onClick={() => onToggle(sub)}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all touch-manipulation
                  ${isSelected ? `${c.active} text-white shadow-md` : `${c.bg} ${c.text}`}`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>
      {/* FIX: show selected chips as summary below the picker for quick reference */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map(sub => {
            const c = SUBJECT_COLORS[sub] || { bg: 'bg-gray-100', text: 'text-gray-600' };
            return (
              <span key={sub} className={`${c.bg} ${c.text} text-[9px] font-black uppercase px-2 py-0.5 rounded-full`}>
                {sub}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('main');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tests, setTests] = useState([]);
  const [taskProgress, setTaskProgress] = useState({});
  const [showAddTest, setShowAddTest] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState('All Subjects');
  const [newTest, setNewTest] = useState(EMPTY_TEST);

  const [today, setToday] = useState(new Date());
  const todayRef = useRef(null);

  useEffect(() => {
    const handleFocus = () => setToday(new Date());
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(() => setToday(new Date()), 3600000);
    return () => { window.removeEventListener('focus', handleFocus); clearInterval(interval); };
  }, []);

  const loadDataFromSheet = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsFetching(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (data) {
        // FIX: null-safe id normalization
        setTests((data.tests || []).map((t, i) => ({ ...t, id: (t.id ?? i).toString() })));
        setTaskProgress(data.taskProgress || {});
      }
    } catch (e) { console.error('Load Error:', e); }
    finally { setIsFetching(false); }
  };

  useEffect(() => { loadDataFromSheet(); }, []);

  useEffect(() => {
    if (activeTab === 'schedule' && todayRef.current)
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeTab]);

  const syncData = async (payload) => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsFetching(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error('Sync Error:', e);
      alert('Network Error: Could not sync with Google Sheets. Please refresh.');
    } finally {
      setTimeout(() => setIsFetching(false), 1000);
    }
  };

  const activeTests = useMemo(() => tests.filter(t => t.status !== 'deleted'), [tests]);

  const subjectAnalysis = useMemo(() => {
    return ALL_SUBJECTS.map(sub => {
      const subTests = activeTests.filter(t => getTestSubjects(t).includes(sub));
      if (subTests.length === 0) return { name: sub, accuracy: null, tests: 0, c: 0, w: 0, l: 0 };
      const avgAccuracy = subTests.reduce((acc, t) => acc + parseFloat(t.accuracy), 0) / subTests.length;
      const c = subTests.reduce((acc, t) => acc + parseInt(t.correct || 0), 0);
      const w = subTests.reduce((acc, t) => acc + parseInt(t.incorrect || 0), 0);
      const l = subTests.reduce((acc, t) => acc + parseInt(t.left || 0), 0);
      return { name: sub, accuracy: avgAccuracy, tests: subTests.length, c, w, l };
    }).sort((a, b) => {
      if (a.accuracy === null) return 1;
      if (b.accuracy === null) return -1;
      return a.accuracy - b.accuracy;
    });
  }, [activeTests]);

  const getSubjectColor = (acc) => {
    if (acc === null) return 'bg-gray-50 text-gray-400 border-gray-200';
    if (acc < 50) return 'bg-red-50 text-red-600 border-red-200';
    if (acc < 70) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-green-50 text-green-600 border-green-200';
  };

  const filteredPieData = useMemo(() => {
    const subset = activeTests.filter(t => testMatchesFilter(t, analyticsFilter));
    const totals = { correct: 0, incorrect: 0, left: 0 };
    subset.forEach(t => {
      totals.correct += parseInt(t.correct || 0);
      totals.incorrect += parseInt(t.incorrect || 0);
      totals.left += parseInt(t.left || 0);
    });
    if (!totals.correct && !totals.incorrect && !totals.left) return [];
    return [
      { name: 'Correct', value: totals.correct },
      { name: 'Wrong', value: totals.incorrect },
      { name: 'Left', value: totals.left }
    ];
  }, [activeTests, analyticsFilter]);

  const todayStr = today.toISOString().split('T')[0];
  const exactMatch = DAILY_SCHEDULE.find(d => d.date === todayStr);
  const scrollTargetDate = useMemo(() => DAILY_SCHEDULE.find(d => d.date >= todayStr)?.date, [todayStr]);

  const currentSubjectData = useMemo(() => {
    if (exactMatch) return exactMatch;
    const lastSubject = [...DAILY_SCHEDULE].reverse().find(d => d.date < todayStr);
    return {
      subject: 'Buffer & Revision',
      isBuffer: true,
      tasks: [
        `Revise ${lastSubject?.subject || 'Previous'} High-Yield`,
        'Clear Pending Backlogs',
        'Daily Custom QBank Module'
      ]
    };
  }, [todayStr, exactMatch]);

  const daysToINICET = Math.ceil((new Date('2026-05-17') - today) / 86400000);
  const daysToExam   = Math.ceil((new Date('2026-08-30') - today) / 86400000);
  const inicetPassed = daysToINICET < 0;

  const combinedTimelineData = useMemo(() => {
    const sorted = [...activeTests]
      .filter(t => t.type === 'Grand Test')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length < 2) return sorted;
    const first = sorted[0], last = sorted[sorted.length - 1];
    const rate = (last.score - first.score) / (new Date(last.date) - new Date(first.date));
    const projected = Math.min(800, Math.round(last.score + rate * (new Date('2026-08-30') - new Date(last.date))));
    return [...sorted, { date: last.date, projection: last.score }, { date: '2026-08-30', projection: projected }];
  }, [activeTests]);

  const toggleNewTestSubject = (sub) => {
    setNewTest(prev => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter(s => s !== sub)
        : [...prev.subjects, sub]
    }));
  };

  const addTest = () => {
    if (newTest.subjects.length === 0) { alert('Select at least one subject.'); return; }
    if (newTest.correct === '') { alert("Enter 'Correct' count to save."); return; }
    const c = parseInt(newTest.correct || 0);
    const w = parseInt(newTest.incorrect || 0);
    const l = parseInt(newTest.left || 0);
    const maxMarks = (c + w + l) * 4;
    const score = (c * 4) - w;
    const accuracy = maxMarks > 0 ? ((score / maxMarks) * 100).toFixed(1) : '0.0';
    const updated = [...tests, { ...newTest, score, accuracy, maxMarks, id: Date.now().toString() }];
    setTests(updated);
    syncData({ type: 'test_update', tests: updated });
    setShowAddTest(false);
    setNewTest({ ...EMPTY_TEST, date: todayStr });
  };

  const toggleTask = (date, task) => {
    const key = `${date}-${task}`;
    const updated = { ...taskProgress, [key]: !taskProgress[key] };
    setTaskProgress(updated);
    syncData({ type: 'task_update', taskProgress: updated });
  };

  // FIX: null-safe delete
  const handleDelete = (id) => {
    const updated = tests.filter(t => (t.id ?? '').toString() !== id.toString());
    setTests(updated);
    syncData({ type: 'test_update', tests: updated });
  };

  const getTestLabel = (test) => {
    const subs = getTestSubjects(test);
    if (subs.length === 1 && subs[0] === 'Grand Test') return test.type === 'Grand Test' ? 'Mega GT' : 'Mini GT';
    if (subs.length === 1) return `${test.type === 'Grand Test' ? 'GT' : 'Mini'}: ${subs[0]}`;
    return `${test.type === 'Grand Test' ? 'GT' : 'Mini'}: ${subs.length} Subjects`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-3 md:p-8 font-sans relative">

      {page === 'modules' && <CustomModules onBack={() => setPage('main')} />}

      {page === 'main' && (<>

      {activeTab === 'dashboard' && (
        <button
          onClick={() => window.location.href = VAULT_URL}
          style={{ zIndex: 9999 }}
          className="fixed bottom-6 right-6 flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all border-4 border-white"
        >
          <ImageIcon size={22} strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Vault</span>
        </button>
      )}

      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-4 md:p-8 mb-4 md:mb-6 text-white overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
            {/* FIX: smaller title on mobile to prevent overflow */}
            <h1 className="text-xl md:text-4xl font-bold flex items-center gap-2 text-white">
              <Target className="shrink-0 text-white" size={28} />
              <span className="tracking-tight uppercase text-white">NEET PG 2026</span>
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl backdrop-blur-md ${inicetPassed ? 'bg-white/10' : 'bg-amber-400/30 border border-amber-300/40'}`}>
                <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-white">
                  {inicetPassed ? '✓ INICET DONE' : 'INICET · 17 MAY'}
                </span>
                {!inicetPassed && (
                  <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-xl text-white">{daysToINICET}d</span>
                )}
              </div>
              <div className="flex items-center gap-3 bg-white/20 px-3 py-1.5 rounded-2xl backdrop-blur-md flex-1 sm:flex-initial justify-between text-white">
                <button onClick={loadDataFromSheet} className={`p-1 hover:bg-white/20 rounded-full transition-transform text-white ${isFetching ? 'animate-spin' : ''}`}>
                  <RefreshCcw size={18} />
                </button>
                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white">30 AUG 2026</span>
              </div>
            </div>
          </div>

          {/* FIX: 2x2 on mobile, 4-col on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
            <div className={`rounded-2xl p-3 md:p-4 backdrop-blur-sm border text-white ${inicetPassed ? 'bg-white/10 border-white/20' : 'bg-amber-400/20 border-amber-300/30'}`}>
              <p className="text-[9px] md:text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><Calendar size={10} /> INICET</p>
              {inicetPassed
                ? <p className="text-base md:text-lg font-black text-white">Done ✓</p>
                : <>
                    {/* FIX: responsive font size so number doesn't overflow on 360px screens */}
                    <p className="text-xl md:text-2xl font-black text-white leading-none">{daysToINICET}<span className="text-sm ml-1">d</span></p>
                    <p className="text-[8px] md:text-[9px] font-bold opacity-60 mt-0.5 text-white">17 May 2026</p>
                  </>
              }
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 backdrop-blur-sm text-white">
              <p className="text-[9px] md:text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><Calendar size={10} /> NEET PG</p>
              <p className="text-xl md:text-2xl font-black text-white leading-none">{daysToExam}<span className="text-sm ml-1">d</span></p>
              <p className="text-[8px] md:text-[9px] font-bold opacity-60 mt-0.5 text-white">30 Aug 2026</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 backdrop-blur-sm min-w-0 text-white">
              <p className="text-[9px] md:text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><MapPin size={10} /> Subject</p>
              {/* FIX: truncate with smaller font on mobile */}
              <p className="text-sm md:text-xl font-black truncate uppercase text-white leading-tight">{currentSubjectData.subject}</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 backdrop-blur-sm text-white">
              <p className="text-[9px] md:text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><TrendingUp size={10} /> Accuracy</p>
              <p className="text-xl md:text-2xl font-black text-white leading-none">
                {activeTests.length > 0 ? (activeTests.reduce((a, b) => a + parseFloat(b.accuracy), 0) / activeTests.length).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-4 md:mb-6 bg-white rounded-2xl p-2 shadow-lg overflow-x-auto no-scrollbar">
          {['dashboard', 'tests', 'schedule'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Focus */}
              <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800 flex items-center gap-2">
                  <Zap className="text-purple-500" size={20} /> Focus
                </h2>
                <div className="space-y-2 md:space-y-3">
                  {currentSubjectData.tasks.map(t => {
                    const key = exactMatch ? `${todayStr}-${t}` : `buffer-${todayStr}-${t}`;
                    const isDone = taskProgress[key];
                    return (
                      <div key={t} onClick={() => toggleTask(exactMatch ? todayStr : `buffer-${todayStr}`, t)}
                        className="flex items-center justify-between p-3 md:p-4 bg-purple-50 rounded-2xl border border-purple-100 cursor-pointer active:scale-95 transition-all touch-manipulation">
                        <span className={`font-bold text-xs uppercase tracking-tight ${isDone ? 'text-gray-400 line-through' : 'text-purple-900'}`}>{t}</span>
                        <CheckCircle2 className={isDone ? 'text-green-500' : 'text-gray-300'} size={20} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proficiency Radar */}
              <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={20} /> Proficiency Radar
                </h2>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] md:max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                  {subjectAnalysis.map(sub => (
                    <div key={sub.name} className={`p-2.5 md:p-4 rounded-2xl border transition-all shadow-sm ${getSubjectColor(sub.accuracy)}`}>
                      <div className="flex justify-between items-start mb-1.5 gap-1">
                        <p className="text-[9px] font-black uppercase truncate leading-tight max-w-[80px]">{sub.name}</p>
                        <p className="text-[11px] md:text-sm font-black whitespace-nowrap">{sub.accuracy !== null ? `${sub.accuracy.toFixed(1)}%` : 'N/A'}</p>
                      </div>
                      <div className="flex justify-between items-center bg-white/40 rounded-lg px-1.5 py-1">
                        <div className="text-center flex-1"><p className="text-[6px] font-bold uppercase opacity-60">C</p><p className="text-[10px] font-black text-green-700">{sub.c}</p></div>
                        <div className="text-center flex-1 border-x border-black/5"><p className="text-[6px] font-bold uppercase opacity-60">W</p><p className="text-[10px] font-black text-red-700">{sub.w}</p></div>
                        <div className="text-center flex-1"><p className="text-[6px] font-bold uppercase opacity-60">L</p><p className="text-[10px] font-black text-gray-500">{sub.l}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
              <div className="flex justify-between items-center mb-3 md:mb-4 flex-wrap gap-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={20} /> Timeline
                </h2>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div><span className="text-[9px] font-bold text-gray-400">ACTUAL</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-0.5 border-t-2 border-dashed border-purple-300"></div><span className="text-[9px] font-bold text-gray-400">PROJECTED</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-0.5 border-t-2 border-dashed border-amber-400"></div><span className="text-[9px] font-bold text-gray-400">INICET</span></div>
                </div>
              </div>
              {/* FIX: taller chart on mobile so labels don't overlap the line */}
              <div className="h-48 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedTimelineData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      type="category"
                      domain={['auto', '2026-08-30']}
                      tickFormatter={str => new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      tick={{ fontSize: 9, fontWeight: 'bold' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis domain={[0, 800]} hide />
                    <Tooltip
                      labelFormatter={l => new Date(l).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                      formatter={(val, name) => [val, name === 'score' ? 'Score' : 'Projected']}
                    />
                    <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} connectNulls />
                    <Line type="monotone" dataKey="projection" stroke="#C084FC" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                    {/* FIX: offset labels vertically so they don't overlap on narrow screens */}
                    <ReferenceLine x="2026-05-17" stroke="#F59E0B" strokeDasharray="4 4"
                      label={{ position: 'insideTopRight', value: 'INICET', fill: '#F59E0B', fontSize: 8, fontWeight: 'bold', dy: -4 }} />
                    <ReferenceLine x="2026-08-30" stroke="#EF4444"
                      label={{ position: 'insideTopLeft', value: 'NEET PG', fill: '#EF4444', fontSize: 8, fontWeight: 'bold', dy: -4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Tests Tab ── */}
        {activeTab === 'tests' && (
          <div className="space-y-4 md:space-y-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Pie */}
              <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-purple-100 min-h-[220px] flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mistake Profile</h3>
                  <div className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">Live Filter</div>
                </div>
                {filteredPieData.length > 0 ? (
                  <div className="h-40 md:h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={filteredPieData} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                          {filteredPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="text-center text-xs text-gray-300 italic">No metrics for this filter</div>}
              </div>

              {/* Add Test Panel */}
              <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                {!showAddTest ? (
                  <div className="flex flex-col items-center gap-3 py-4 md:py-6">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Add New Test</p>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => setShowAddTest(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 md:p-5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform touch-manipulation">
                          <Plus size={28} strokeWidth={3} />
                        </button>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">BTR Test</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => setPage('modules')}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform touch-manipulation">
                          <BookOpen size={28} strokeWidth={2.5} />
                        </button>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Custom Module</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-3 md:space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-gray-800 uppercase text-xs tracking-wide">New BTR Test Log</h3>
                      <button onClick={() => { setShowAddTest(false); setNewTest({ ...EMPTY_TEST, date: todayStr }); }}
                        className="text-gray-400 hover:text-gray-600 font-bold text-sm">Cancel</button>
                    </div>

                    {/* Date + Type */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</span>
                        <input type="date" className="p-2.5 md:p-3 bg-gray-50 rounded-xl font-bold text-xs border-none outline-none"
                          value={newTest.date} onChange={e => setNewTest(p => ({ ...p, date: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Type</span>
                        <select className="p-2.5 md:p-3 bg-gray-50 rounded-xl font-bold text-xs border-none outline-none"
                          value={newTest.type} onChange={e => setNewTest(p => ({ ...p, type: e.target.value }))}>
                          <option>Grand Test</option>
                          <option>Mini Test</option>
                        </select>
                      </div>
                    </div>

                    {/* FIX: SubjectPicker component — scrollable, bounded height */}
                    <SubjectPicker
                      selected={newTest.subjects}
                      onToggle={toggleNewTestSubject}
                      onClear={() => setNewTest(p => ({ ...p, subjects: [] }))}
                    />

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      <input type="number" inputMode="numeric" placeholder="Correct"
                        className="p-2.5 md:p-3 bg-green-50 rounded-xl font-bold text-green-700 text-xs border-none outline-none"
                        value={newTest.correct} onChange={e => setNewTest(p => ({ ...p, correct: e.target.value }))} />
                      <input type="number" inputMode="numeric" placeholder="Wrong"
                        className="p-2.5 md:p-3 bg-red-50 rounded-xl font-bold text-red-700 text-xs border-none outline-none"
                        value={newTest.incorrect} onChange={e => setNewTest(p => ({ ...p, incorrect: e.target.value }))} />
                      <input type="number" inputMode="numeric" placeholder="Left"
                        className="p-2.5 md:p-3 bg-gray-50 rounded-xl font-bold text-gray-400 text-xs border-none outline-none"
                        value={newTest.left} onChange={e => setNewTest(p => ({ ...p, left: e.target.value }))} />
                    </div>

                    <button onClick={addTest}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 md:py-4 rounded-xl font-bold text-sm uppercase shadow-lg active:scale-95 transition-transform">
                      Save Log
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white p-3 md:p-4 rounded-3xl shadow-lg border border-purple-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-purple-600">
                <Filter size={16} />
                <span className="font-bold text-sm uppercase tracking-tight">Review History</span>
              </div>
              <select value={analyticsFilter} onChange={e => setAnalyticsFilter(e.target.value)}
                className="w-full sm:w-64 p-2.5 md:p-3 bg-purple-50 rounded-2xl font-bold text-xs text-purple-700 border-none outline-none text-center shadow-inner">
                <option value="All Subjects">ALL SUBJECTS</option>
                <option value="Grand Test">GRAND TESTS ONLY</option>
                {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Test cards */}
            <div className="space-y-3">
              {activeTests
                .filter(t => testMatchesFilter(t, analyticsFilter))
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(test => {
                  const subs = getTestSubjects(test);
                  const acc = parseFloat(test.accuracy);
                  return (
                    <div key={test.id} className={`bg-white p-4 md:p-5 rounded-2xl shadow-md border-l-8 transition-all active:scale-[0.99] ${acc < 50 ? 'border-red-500' : 'border-pink-400'}`}>
                      {/* FIX: stack vertically on mobile, row on sm+ */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Title + date */}
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="font-black text-gray-800 text-sm uppercase">{getTestLabel(test)}</span>
                            <span className="text-[8px] font-black text-purple-400 flex items-center gap-1">
                              <Clock size={8} /> {new Date(test.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                            </span>
                          </div>
                          {/* Subject chips */}
                          {subs[0] !== 'Grand Test' && (
                            <div className="flex flex-wrap gap-1 mb-1.5">
                              {subs.map(sub => {
                                const c = SUBJECT_COLORS[sub] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                                return <span key={sub} className={`${c.bg} ${c.text} text-[8px] font-black uppercase px-2 py-0.5 rounded-full`}>{sub}</span>;
                              })}
                            </div>
                          )}
                          {/* C/W/L */}
                          <div className="text-[10px] font-bold text-gray-400">
                            C: {test.correct} | W: {test.incorrect} | L: {test.left || 0}
                          </div>
                        </div>
                        {/* FIX: score col — tighter on mobile, won't squeeze title */}
                        <div className="flex flex-col items-end gap-0.5 shrink-0 min-w-[60px]">
                          <span className={`font-bold text-xs ${acc < 50 ? 'text-red-600' : 'text-purple-600'}`}>{test.accuracy}%</span>
                          <span className="font-black text-gray-700 text-base leading-none">
                            {test.score}
                          </span>
                          <span className="text-[9px] text-gray-300 font-normal">/ {test.maxMarks || 800}</span>
                          <button onClick={() => handleDelete(test.id)} className="text-red-200 hover:text-red-500 mt-1 p-1 touch-manipulation">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── Schedule Tab ── */}
        {activeTab === 'schedule' && (
          <div className="space-y-2.5 h-[65vh] overflow-y-auto pr-1 custom-scrollbar pb-10">
            {DAILY_SCHEDULE.map(day => {
              const isToday = day.date === todayStr;
              const isNextStudyDay = day.date === scrollTargetDate;
              const isINICET = day.date === '2026-05-17';
              const isNEETPG = day.date === '2026-08-30';
              return (
                <div key={day.date} ref={isNextStudyDay ? todayRef : null}
                  className={`bg-white p-3 md:p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm border-l-8 transition-all
                    ${isToday ? 'border-purple-600 ring-2 ring-purple-100 shadow-lg scale-[1.01]'
                      : isINICET ? 'border-amber-400 bg-amber-50/50'
                      : isNEETPG ? 'border-red-500 bg-red-50/50'
                      : 'border-purple-100 opacity-90'}`}>
                  <div className="w-full md:w-1/4 mb-2 md:mb-0">
                    <div className="font-bold text-gray-800 text-base md:text-lg leading-none flex items-center gap-2">
                      {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      {isINICET && <span className="text-[9px] font-black bg-amber-400 text-white px-2 py-0.5 rounded-full uppercase">INICET</span>}
                      {isNEETPG && <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">NEET PG</span>}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isINICET ? 'text-amber-500' : isNEETPG ? 'text-red-500' : 'text-purple-400'}`}>{day.subject}</div>
                    {isNextStudyDay && !isToday && <span className="text-[8px] text-purple-600 font-black uppercase mt-0.5 block">Next Study Day</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 w-full md:w-auto mt-1 md:mt-0">
                    {day.tasks.map(task => {
                      const key = `${day.date}-${task}`;
                      const active = taskProgress[key];
                      return (
                        <button key={task} onClick={() => toggleTask(day.date, task)}
                          className={`flex-1 md:flex-none px-3 md:px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all shadow-sm touch-manipulation
                            ${active ? 'bg-purple-600 text-white shadow-purple-200'
                              : isINICET ? 'bg-amber-100 text-amber-600 border border-amber-200'
                              : isNEETPG ? 'bg-red-100 text-red-600 border border-red-200'
                              : 'bg-purple-50 text-purple-400 border border-purple-100'}`}>
                          {task}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>)}
    </div>
  );
}