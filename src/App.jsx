import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Target, Calendar, CheckCircle2, Zap, Trash2, Plus, RefreshCcw, TrendingUp, Book, Activity, MapPin } from 'lucide-react';

// PASTE YOUR NEW DEPLOYMENT URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnOfTK9q4colGzSBVsgEhqY32eXjIVUmVRvZNoM1h6ZMkLyGTQMDhcYs_nGtQdfWgy7A/exec'; 

const SUBJECTS = ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Medicine', 'Surgery', 'OBG', 'Pediatrics', 'Orthopedics', 'ENT', 'Ophthalmology', 'Psychiatry', 'Dermatology', 'Radiology', 'Anesthesia'];
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
  const [newTest, setNewTest] = useState({ type: 'Grand Test', subject: 'Anatomy', correct: '', incorrect: '', left: '', date: new Date().toISOString().split('T')[0] });

  const loadDataFromSheet = async () => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_NEW_DEPLOYMENT')) return;
    setIsFetching(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (data) {
        if (data.tests) setTests(data.tests);
        if (data.taskProgress) setTaskProgress(data.taskProgress);
      }
    } catch (e) { console.error("Load Error:", e); }
    finally { setIsFetching(false); }
  };

  useEffect(() => { loadDataFromSheet(); }, []);

  // FIXED SYNC FUNCTION
  const syncData = async (payload) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_NEW_DEPLOYMENT')) return;
    try {
      // We use 'no-cors' for POST to Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) { console.error("Sync Error:", e); }
  };

  const activeTests = useMemo(() => tests.filter(t => t.status !== 'deleted'), [tests]);
  
  const filteredPieData = useMemo(() => {
    const subset = analyticsFilter === 'All Subjects' 
      ? activeTests 
      : activeTests.filter(t => t.subject === analyticsFilter || (analyticsFilter === 'GT' && t.type === 'Grand Test'));
    
    const totals = { correct: 0, incorrect: 0, left: 0 };
    subset.forEach(t => {
      totals.correct += parseInt(t.correct || 0);
      totals.incorrect += parseInt(t.incorrect || 0);
      totals.left += parseInt(t.left || 0);
    });

    if (totals.correct === 0 && totals.incorrect === 0 && totals.left === 0) return [];
    return [{ name: 'Correct', value: totals.correct }, { name: 'Wrong', value: totals.incorrect }, { name: 'Left', value: totals.left }];
  }, [activeTests, analyticsFilter]);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentSubjectData = DAILY_SCHEDULE.find(d => d.date === todayStr) || 
                             DAILY_SCHEDULE.slice().reverse().find(d => d.date < todayStr) || 
                             { subject: 'Planning', tasks: [] };

  const daysToExam = Math.ceil((new Date('2026-08-30') - new Date()) / (1000 * 60 * 60 * 24));

  const addTest = () => {
    const c = parseInt(newTest.correct || 0);
    const w = parseInt(newTest.incorrect || 0);
    const score = (c * 4) - w;
    const accuracy = ((score / 800) * 100).toFixed(1);
    const updatedTests = [...tests, { ...newTest, score, accuracy, id: Date.now() }];
    setTests(updatedTests);
    syncData({ type: 'test_update', tests: updatedTests });
    setShowAddTest(false);
  };

  const toggleTask = (date, task) => {
    const key = `${date}-${task}`;
    const newProgress = { ...taskProgress, [key]: !taskProgress[key] };
    setTaskProgress(newProgress);
    // This now saves your schedule progress to the excel too
    syncData({ type: 'task_update', taskProgress: newProgress });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-6 text-white relative">
          <div className="flex justify-between items-center mb-4 text-white">
            <h1 className="text-4xl font-bold flex items-center gap-3"><Target className="w-10 h-10" /> NEET PG 2026</h1>
            <div className="flex items-center gap-4">
               <button onClick={loadDataFromSheet} className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all ${isFetching ? 'animate-spin' : ''}`}>
                 <RefreshCcw size={20} />
               </button>
               <div className="text-2xl font-bold text-white uppercase tracking-tight">30 Aug 2026</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm text-white">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest opacity-80"><Calendar size={14}/> Countdown</div>
              <div className="text-3xl font-bold">{daysToExam} Days</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm text-white">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest opacity-80"><MapPin size={14}/> Current Subject</div>
              <div className="text-2xl font-bold truncate text-white uppercase tracking-tighter">{currentSubjectData.subject}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm text-white">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest opacity-80"><TrendingUp size={14}/> Accuracy</div>
              <div className="text-3xl font-bold text-white">{activeTests.length > 0 ? (activeTests.reduce((a,b)=>a+parseFloat(b.accuracy),0)/activeTests.length).toFixed(1) : 0}%</div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg">
          {['dashboard', 'tests', 'schedule'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2"><Zap className="text-purple-500" /> Today's Focus</h2>
              <div className="space-y-3">
                {currentSubjectData.tasks.map(t => (
                  <div key={t} className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <span className="font-bold text-purple-900 text-xs uppercase tracking-tight">{t}</span>
                    <CheckCircle2 className={taskProgress[`${todayStr}-${t}`] ? "text-green-500" : "text-gray-300"} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Growth Score</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeTests}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="date" hide /><YAxis domain={[0, 800]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} dot={{fill: '#8B5CF6'}} /></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100 min-h-[250px] flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mistake Profile</h3>
                  <select value={analyticsFilter} onChange={(e)=>setAnalyticsFilter(e.target.value)} className="text-[10px] font-bold bg-purple-50 text-purple-600 rounded-lg p-1 outline-none">
                    <option>All Subjects</option>{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {filteredPieData.length > 0 ? (
                  <div className="h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={filteredPieData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value">{filteredPieData.map((c, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend verticalAlign="bottom" wrapperStyle={{fontSize: '10px'}} /></PieChart></ResponsiveContainer></div>
                ) : <div className="text-center text-xs text-gray-300 italic">No tests found for filter</div>}
              </div>
              <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-purple-100 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 uppercase text-sm tracking-tight">Post-Test Analysis</h3>
                    <button onClick={()=>setShowAddTest(!showAddTest)} className="bg-purple-600 text-white p-2 rounded-full shadow-lg"><Plus size={24}/></button>
                  </div>
                  {showAddTest && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in duration-300">
                      <select className="p-3 bg-gray-50 rounded-xl font-bold text-xs" value={newTest.type} onChange={e => setNewTest({...newTest, type: e.target.value})}><option>Grand Test</option><option>Mini Test</option></select>
                      {newTest.type === 'Mini Test' && <select className="p-3 bg-gray-50 rounded-xl font-bold text-xs" value={newTest.subject} onChange={e => setNewTest({...newTest, subject: e.target.value})}>{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select>}
                      <input type="number" placeholder="Correct" className="p-3 bg-green-50 rounded-xl font-bold text-green-700 text-xs" value={newTest.correct} onChange={e => setNewTest({...newTest, correct: e.target.value})} />
                      <input type="number" placeholder="Wrong" className="p-3 bg-red-50 rounded-xl font-bold text-red-700 text-xs" value={newTest.incorrect} onChange={e => setNewTest({...newTest, incorrect: e.target.value})} />
                      <input type="number" placeholder="Left" className="p-3 bg-gray-50 rounded-xl font-bold text-gray-400 text-xs" value={newTest.left} onChange={e => setNewTest({...newTest, left: e.target.value})} />
                      <button onClick={addTest} className="col-span-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold text-sm uppercase">Log Results</button>
                    </div>
                  )}
              </div>
            </div>
            <div className="space-y-3">
              {activeTests.slice().reverse().map(test => (
                <div key={test.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-md border-l-8 border-pink-400">
                  <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                    <div className="font-bold text-gray-800 text-sm tracking-tighter">{test.type === 'Grand Test' ? 'GT' : test.subject}</div>
                    <div className="text-[10px] font-bold text-gray-400">C: {test.correct} | W: {test.incorrect} | L: {test.left || 0}</div>
                    <div className="text-center font-bold text-purple-600 text-sm">{test.accuracy}%</div>
                    <div className="text-right font-black text-gray-700 text-lg">{test.score} <span className="text-[10px] text-gray-300 font-normal">/ 800</span></div>
                  </div>
                  <button onClick={() => {
                    const updated = tests.filter(t => t.id !== test.id);
                    setTests(updated);
                    syncData({ type: 'test_update', tests: updated });
                  }} className="ml-6 text-red-200 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar text-white">
            {DAILY_SCHEDULE.map(day => (
              <div key={day.date} className={`bg-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-sm border-l-8 ${day.date === todayStr ? 'border-purple-600 scale-[1.01] shadow-lg' : 'border-purple-100 opacity-90'}`}>
                <div className="w-full md:w-1/4 text-white"><div className="font-bold text-gray-800 text-lg">{new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div><div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none">{day.subject}</div></div>
                <div className="flex flex-wrap gap-2 mt-3 md:mt-0 text-white">{day.tasks.map(task => {
                  const key = `${day.date}-${task}`;
                  const active = taskProgress[key];
                  return (
                    <button key={task} onClick={() => toggleTask(day.date, task)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${active ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-400 border border-purple-100'}`}>{task}</button>
                  );
                })}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}