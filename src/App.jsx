import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';
import { Target, Calendar, CheckCircle2, Zap, Trash2, Plus, RefreshCcw, TrendingUp, Filter, MapPin, AlertCircle, Clock, Image as ImageIcon } from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFpJSz2k6w6tiA9QGuoat4gEYlhYNSc7-9VIjel3lSdg7b1jlVV2eP5malCKYnp7Ttag/exec'; 
const VAULT_URL = 'https://neet-pg-rud6.vercel.app/';

const SUBJECTS = ['All Subjects', 'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Medicine', 'Surgery', 'OBG', 'Pediatrics', 'Orthopedics', 'ENT', 'Ophthalmology', 'Psychiatry', 'Dermatology', 'Radiology', 'Anesthesia'];
const COLORS = ['#10B981', '#EF4444', '#94A3B8']; 

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
  { date: '2026-08-30', subject: 'NEET PG', tasks: ['NEET PG EXAM DAY'] }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tests, setTests] = useState([]);
  const [taskProgress, setTaskProgress] = useState({});
  const [showAddTest, setShowAddTest] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState('All Subjects');
  const [newTest, setNewTest] = useState({ type: 'Grand Test', subject: 'All Subjects', correct: '', incorrect: '', left: '', date: new Date().toISOString().split('T')[0] });
  
  const [today, setToday] = useState(new Date());
  const todayRef = useRef(null);

  useEffect(() => {
    const handleFocus = () => setToday(new Date());
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(() => setToday(new Date()), 3600000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const loadDataFromSheet = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsFetching(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (data) {
        const normalizedTests = (data.tests || []).map(t => ({...t, id: t.id.toString()}));
        setTests(normalizedTests);
        setTaskProgress(data.taskProgress || {});
      }
    } catch (e) { console.error("Load Error:", e); }
    finally { setIsFetching(false); }
  };

  useEffect(() => { loadDataFromSheet(); }, []);

  useEffect(() => {
    if (activeTab === 'schedule' && todayRef.current) {
        todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTab]);

  // OPTIMIZED SYNC: Shows spinner in header during any background save/delete
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
      console.error("Sync Error:", e);
      alert("Network Error: Could not sync with Google Sheets. Please refresh.");
    } finally {
      // Small delay ensures Google Script has finished row processing
      setTimeout(() => setIsFetching(false), 1000);
    }
  };

  const activeTests = useMemo(() => tests.filter(t => t.status !== 'deleted'), [tests]);
  
  const subjectAnalysis = useMemo(() => {
    const filteredSubjects = SUBJECTS.filter(s => s !== 'All Subjects');
    const stats = filteredSubjects.map(sub => {
      const subTests = activeTests.filter(t => t.subject === sub);
      if (subTests.length === 0) return { name: sub, accuracy: null, tests: 0, c: 0, w: 0, l: 0 };
      const avgAccuracy = subTests.reduce((acc, curr) => acc + parseFloat(curr.accuracy), 0) / subTests.length;
      const c = subTests.reduce((acc, curr) => acc + parseInt(curr.correct || 0), 0);
      const w = subTests.reduce((acc, curr) => acc + parseInt(curr.incorrect || 0), 0);
      const l = subTests.reduce((acc, curr) => acc + parseInt(curr.left || 0), 0);
      return { name: sub, accuracy: avgAccuracy, tests: subTests.length, c, w, l };
    });
    return stats.sort((a, b) => {
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
    const subset = analyticsFilter === 'All Subjects' 
      ? activeTests 
      : activeTests.filter(t => {
          if (analyticsFilter === "Grand Test") return t.type === "Grand Test";
          return t.subject === analyticsFilter;
        });
    const totals = { correct: 0, incorrect: 0, left: 0 };
    subset.forEach(t => {
      totals.correct += parseInt(t.correct || 0);
      totals.incorrect += parseInt(t.incorrect || 0);
      totals.left += parseInt(t.left || 0);
    });
    if (totals.correct === 0 && totals.incorrect === 0 && totals.left === 0) return [];
    return [{ name: 'Correct', value: totals.correct }, { name: 'Wrong', value: totals.incorrect }, { name: 'Left', value: totals.left }];
  }, [activeTests, analyticsFilter]);

  const todayStr = today.toISOString().split('T')[0];
  const exactMatch = DAILY_SCHEDULE.find(d => d.date === todayStr);
  const scrollTargetDate = useMemo(() => {
    const upcoming = DAILY_SCHEDULE.find(d => d.date >= todayStr);
    return upcoming ? upcoming.date : null;
  }, [todayStr]);

  const currentSubjectData = useMemo(() => {
    if (exactMatch) return exactMatch;
    const lastSubject = [...DAILY_SCHEDULE].reverse().find(d => d.date < todayStr);
    return {
      subject: "Buffer & Revision",
      isBuffer: true,
      tasks: [
        `Revise ${lastSubject?.subject || 'Previous'} High-Yield`,
        "Clear Pending Backlogs",
        "Daily Custom QBank Module"
      ]
    };
  }, [todayStr, exactMatch]);

  const daysToExam = Math.ceil((new Date('2026-08-30') - today) / (1000 * 60 * 60 * 24));

  const addTest = () => {
    if (!newTest.correct || newTest.correct.trim() === "") {
        alert("Enter 'Correct' count to save.");
        return;
    }
    const c = parseInt(newTest.correct || 0);
    const w = parseInt(newTest.incorrect || 0);
    const l = parseInt(newTest.left || 0);
    const dynamicMaxMarks = (c + w + l) * 4;
    const score = (c * 4) - w;
    const accuracy = dynamicMaxMarks > 0 ? ((score / dynamicMaxMarks) * 100).toFixed(1) : 0;
    
    const updatedTests = [...tests, { 
      ...newTest, 
      score, 
      accuracy, 
      maxMarks: dynamicMaxMarks,
      id: Date.now().toString() 
    }];
    
    setTests(updatedTests);
    syncData({ type: 'test_update', tests: updatedTests });
    setShowAddTest(false);
    setNewTest({ type: 'Grand Test', subject: 'All Subjects', correct: '', incorrect: '', left: '', date: todayStr });
  };

  const toggleTask = (date, task) => {
    const key = `${date}-${task}`;
    const newProgress = { ...taskProgress, [key]: !taskProgress[key] };
    setTaskProgress(newProgress);
    syncData({ type: 'task_update', taskProgress: newProgress });
  };

  const combinedTimelineData = useMemo(() => {
    const sortedTests = [...activeTests]
      .filter(t => t.type === 'Grand Test')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedTests.length < 2) return sortedTests;

    const first = sortedTests[0];
    const last = sortedTests[sortedTests.length - 1];
    const firstDate = new Date(first.date).getTime();
    const lastDate = new Date(last.date).getTime();
    const examDate = new Date('2026-08-30').getTime();
    
    const ratePerMs = (last.score - first.score) / (lastDate - firstDate);
    const projectedFinalScore = Math.min(800, Math.round(last.score + (ratePerMs * (examDate - lastDate))));

    const projectionPoints = [
      { date: last.date, projection: last.score },
      { date: '2026-08-30', projection: projectedFinalScore }
    ];

    return [...sortedTests, ...projectionPoints];
  }, [activeTests]);

  // FIX: Immediate UI update for smooth deletion
  const handleDelete = (id) => {
    const updated = tests.filter(t => t.id.toString() !== id.toString());
    setTests(updated);
    syncData({ type: 'test_update', tests: updated });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8 font-sans relative">
      
      {activeTab === 'dashboard' && (
        <button 
          onClick={() => window.location.href = VAULT_URL}
          style={{ zIndex: 9999 }}
          className="fixed bottom-8 right-8 flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all border-4 border-white"
        >
          <ImageIcon size={24} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase mt-0.5 tracking-tighter">Vault</span>
        </button>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-5 md:p-8 mb-6 text-white overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2 text-white">
              <Target className="shrink-0 text-white" size={32} />
              <span className="tracking-tight uppercase text-white">NEET PG 2026</span>
            </h1>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-3 bg-white/20 px-3 py-1.5 rounded-2xl backdrop-blur-md flex-1 sm:flex-initial justify-between text-white">
                <button onClick={loadDataFromSheet} className={`p-1 hover:bg-white/20 rounded-full transition-transform text-white ${isFetching ? 'animate-spin' : ''}`}>
                  <RefreshCcw size={18} />
                </button>
                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white">30 AUG 2026</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm text-white">
              <p className="text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><Calendar size={12} /> Countdown</p>
              <p className="text-2xl font-black text-white">{daysToExam} Days</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm min-w-0 text-white">
              <p className="text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><MapPin size={12} /> Current Subject</p>
              <p className="text-2xl font-black truncate uppercase text-white">{currentSubjectData.subject}</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm text-white">
              <p className="text-[10px] font-bold uppercase opacity-70 mb-1 flex items-center gap-1 text-white"><TrendingUp size={12} /> Accuracy</p>
              <p className="text-2xl font-black text-white">
                {activeTests.length > 0 ? (activeTests.reduce((a,b)=>a+parseFloat(b.accuracy),0)/activeTests.length).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg overflow-x-auto no-scrollbar">
          {['dashboard', 'tests', 'schedule'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2"><Zap className="text-purple-500" size={20}/> Focus</h2>
                <div className="space-y-3">
                  {currentSubjectData.tasks.map(t => {
                    const key = exactMatch ? `${todayStr}-${t}` : `buffer-${todayStr}-${t}`;
                    const isDone = taskProgress[key];
                    return (
                      <div 
                        key={t} 
                        onClick={() => toggleTask(exactMatch ? todayStr : `buffer-${todayStr}`, t)}
                        className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100 cursor-pointer active:scale-95 transition-all"
                      >
                        <span className={`font-bold text-xs uppercase tracking-tight ${isDone ? 'text-gray-400 line-through' : 'text-purple-900'}`}>{t}</span>
                        <CheckCircle2 className={isDone ? "text-green-500" : "text-gray-300"} size={20} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={20}/> Proficiency Radar
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {subjectAnalysis.map(sub => (
                    <div key={sub.name} className={`p-3 md:p-4 rounded-2xl border transition-all shadow-sm ${getSubjectColor(sub.accuracy)}`}>
                      <div className="flex justify-between items-start mb-2 gap-1">
                         <p className="text-[9px] md:text-[10px] font-black uppercase truncate max-w-[100px] leading-tight">{sub.name}</p>
                         <p className="text-xs md:text-sm font-black whitespace-nowrap">{sub.accuracy !== null ? `${sub.accuracy.toFixed(1)}%` : 'N/A'}</p>
                      </div>
                      <div className="flex justify-between items-center bg-white/40 rounded-lg px-2 py-1">
                        <div className="text-center flex-1">
                          <p className="text-[6px] md:text-[7px] font-bold uppercase opacity-60">C</p>
                          <p className="text-[10px] md:text-xs font-black text-green-700">{sub.c}</p>
                        </div>
                        <div className="text-center flex-1 border-x border-black/5 px-2">
                          <p className="text-[6px] md:text-[7px] font-bold uppercase opacity-60">W</p>
                          <p className="text-[10px] md:text-xs font-black text-red-700">{sub.w}</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-[6px] md:text-[7px] font-bold uppercase opacity-60">L</p>
                          <p className="text-[10px] md:text-xs font-black text-gray-500">{sub.l}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={20}/> Full Exam Timeline
                </h2>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-[10px] font-bold text-gray-400">ACTUAL</span></div>
                   <div className="flex items-center gap-1"><div className="w-3 h-0.5 border-t-2 border-dashed border-purple-300"></div><span className="text-[10px] font-bold text-gray-400">PROJECTED</span></div>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      type="category"
                      domain={['auto', '2026-08-30']}
                      tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      tick={{fontSize: 10, fontWeight: 'bold'}}
                    />
                    <YAxis domain={[0, 800]} hide />
                    <Tooltip 
                      labelFormatter={(l) => new Date(l).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                      formatter={(val, name) => [val, name === 'score' ? 'Score' : 'Projected']}
                    />
                    <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} dot={{fill: '#8B5CF6'}} strokeOpacity={1} connectNulls />
                    <Line type="monotone" dataKey="projection" stroke="#C084FC" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                    <ReferenceLine x="2026-08-30" stroke="red" label={{ position: 'top', value: 'NEET EXAM', fill: 'red', fontSize: 10, fontWeight: 'bold' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100 min-h-[250px] flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mistake Profile</h3>
                  <div className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">Live Filter</div>
                </div>
                {filteredPieData.length > 0 ? (
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={filteredPieData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value">
                          {filteredPieData.map((c, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" wrapperStyle={{fontSize: '10px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="text-center text-xs text-gray-300 italic">No metrics for this subject</div>}
              </div>

              <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                  {!showAddTest ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Add New Test</p>
                      <button onClick={()=>setShowAddTest(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-full shadow-lg hover:scale-105 transition-transform"><Plus size={32} strokeWidth={3} /></button>
                    </div>
                  ) : (
                    <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex justify-between items-center px-2">
                         <h3 className="font-bold text-gray-800 uppercase text-xs">New Analysis</h3>
                         <button onClick={()=>setShowAddTest(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">Cancel</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date Taken</span>
                          <input type="date" className="p-3 bg-gray-50 rounded-xl font-bold text-xs border-none outline-none" value={newTest.date} onChange={e => setNewTest({...newTest, date: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Test Type</span>
                          <select className="p-3 bg-gray-50 rounded-xl font-bold text-xs border-none outline-none" value={newTest.type} onChange={e => setNewTest({...newTest, type: e.target.value})}><option>Grand Test</option><option>Mini Test</option></select>
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Subject</span>
                          <select className="p-3 bg-gray-50 rounded-xl font-bold text-xs border-none outline-none" value={newTest.subject} onChange={e => setNewTest({...newTest, subject: e.target.value})}>{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <input type="number" placeholder="Correct" className="p-3 bg-green-50 rounded-xl font-bold text-green-700 text-xs border-none outline-none" value={newTest.correct} onChange={e => setNewTest({...newTest, correct: e.target.value})} />
                        <input type="number" placeholder="Wrong" className="p-3 bg-red-50 rounded-xl font-bold text-red-700 text-xs border-none outline-none" value={newTest.incorrect} onChange={e => setNewTest({...newTest, incorrect: e.target.value})} />
                        <input type="number" placeholder="Left" className="p-3 bg-gray-50 rounded-xl font-bold text-gray-400 text-xs border-none outline-none" value={newTest.left} onChange={e => setNewTest({...newTest, left: e.target.value})} />
                      </div>
                      <button onClick={addTest} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-sm uppercase shadow-lg active:scale-95 transition-transform">Save Log</button>
                    </div>
                  )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-lg border border-purple-50 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-2 text-purple-600">
                 <Filter size={18} />
                 <span className="font-bold text-sm uppercase tracking-tight">Review History</span>
               </div>
               <select value={analyticsFilter} onChange={(e)=>setAnalyticsFilter(e.target.value)} className="w-full sm:w-64 p-3 bg-purple-50 rounded-2xl font-bold text-xs text-purple-700 border-none outline-none text-center shadow-inner">
                 <option value="All Subjects">ALL SUBJECTS</option>
                 <option value="Grand Test">GRAND TESTS ONLY</option>
                 {SUBJECTS.filter(s => s !== 'All Subjects').map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>

            <div className="space-y-3">
              {activeTests
                .filter(t => analyticsFilter === "All Subjects" || (analyticsFilter === "Grand Test" ? t.type === "Grand Test" : t.subject === analyticsFilter))
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(test => (
                <div key={test.id} className={`bg-white p-5 rounded-2xl flex justify-between items-center shadow-md border-l-8 transition-all active:scale-[0.98] ${parseFloat(test.accuracy) < 50 ? 'border-red-500' : 'border-pink-400'}`}>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm uppercase truncate leading-tight">{test.type === 'Grand Test' ? (test.subject === 'All Subjects' ? 'Mega GT' : `GT: ${test.subject}`) : test.subject}</span>
                      <span className="text-[8px] font-black text-purple-400 flex items-center gap-1 mt-0.5"><Clock size={8}/> {new Date(test.date).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'2-digit'})}</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400">C: {test.correct} | W: {test.incorrect} | L: {test.left || 0}</div>
                    <div className={`text-center font-bold text-sm ${parseFloat(test.accuracy) < 50 ? 'text-red-600' : 'text-purple-600'}`}>{test.accuracy}%</div>
                    <div className="text-right font-black text-gray-700 text-lg">
                      {test.score} 
                      <span className="text-[10px] text-gray-300 font-normal ml-1">/ {test.maxMarks || 800}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(test.id)} 
                    className="ml-4 text-red-200 hover:text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-3 h-[60vh] overflow-y-auto pr-1 custom-scrollbar pb-10">
            {DAILY_SCHEDULE.map(day => {
              const isToday = day.date === todayStr;
              const isNextStudyDay = day.date === scrollTargetDate;

              return (
                <div 
                  key={day.date} 
                  ref={isNextStudyDay ? todayRef : null}
                  className={`bg-white p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-sm border-l-8 ${isToday ? 'border-purple-600 ring-2 ring-purple-100 shadow-lg scale-[1.01]' : 'border-purple-100 opacity-90'}`}
                >
                  <div className="w-full md:w-1/4 mb-3 md:mb-0">
                    <div className="font-bold text-gray-800 text-lg leading-none">{new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                    <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{day.subject}</div>
                    {isNextStudyDay && !isToday && (
                      <span className="text-[8px] text-purple-600 font-black uppercase mt-1 block">Next Study Day</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {day.tasks.map(task => {
                      const key = `${day.date}-${task}`;
                      const active = taskProgress[key];
                      return (
                        <button key={task} onClick={() => toggleTask(day.date, task)} className={`flex-1 md:flex-none px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all shadow-sm ${active ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-purple-50 text-purple-400 border border-purple-100'}`}>{task}</button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}