import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Legend
} from "recharts";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, ChevronRight } from "lucide-react";
import pronunciationIcon from "./assets/canva-icons/pronunciation.png";
import vocabularyIcon from "./assets/canva-icons/vocabulary.png";
import grammarIcon from "./assets/canva-icons/grammar.png";
import listeningIcon from "./assets/canva-icons/listening.png";
import speakingIcon from "./assets/canva-icons/speaking.png";
import calendarBlueIcon from "./assets/canva-icons/calendar-blue.png";
import targetBlueIcon from "./assets/canva-icons/target-blue.png";
import starBadgeIcon from "./assets/canva-icons/star-badge-blue.png";
import arinLogo from "./assets/arin-logo.png";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const initialStudents = [
  "신고","켄토","이노우에","레나","아스카","유미","시오리","에리","유유",
  "모리야","주애 메구미","쿠마","노조미","미사키","줌바 메구미","노부코"
];

const colorPalette = [
  { stroke: "#3b82f6", fill: "#3b82f6", bg: "from-blue-50 to-sky-100",        badge: "bg-blue-100 text-blue-700" },
  { stroke: "#10b981", fill: "#10b981", bg: "from-emerald-50 to-teal-100",    badge: "bg-emerald-100 text-emerald-700" },
  { stroke: "#f59e0b", fill: "#f59e0b", bg: "from-amber-50 to-yellow-100",    badge: "bg-amber-100 text-amber-700" },
  { stroke: "#ec4899", fill: "#ec4899", bg: "from-pink-50 to-rose-100",       badge: "bg-pink-100 text-pink-700" },
  { stroke: "#8b5cf6", fill: "#8b5cf6", bg: "from-violet-50 to-purple-100",   badge: "bg-violet-100 text-violet-700" },
  { stroke: "#ef4444", fill: "#ef4444", bg: "from-red-50 to-orange-100",      badge: "bg-red-100 text-red-700" },
  { stroke: "#06b6d4", fill: "#06b6d4", bg: "from-cyan-50 to-sky-100",        badge: "bg-cyan-100 text-cyan-700" },
  { stroke: "#f97316", fill: "#f97316", bg: "from-orange-50 to-amber-100",    badge: "bg-orange-100 text-orange-700" },
  { stroke: "#84cc16", fill: "#84cc16", bg: "from-lime-50 to-green-100",      badge: "bg-lime-100 text-lime-700" },
  { stroke: "#6366f1", fill: "#6366f1", bg: "from-indigo-50 to-blue-100",     badge: "bg-indigo-100 text-indigo-700" },
  { stroke: "#d946ef", fill: "#d946ef", bg: "from-fuchsia-50 to-pink-100",    badge: "bg-fuchsia-100 text-fuchsia-700" },
  { stroke: "#0ea5e9", fill: "#0ea5e9", bg: "from-sky-50 to-blue-100",        badge: "bg-sky-100 text-sky-700" },
  { stroke: "#14b8a6", fill: "#14b8a6", bg: "from-teal-50 to-emerald-100",    badge: "bg-teal-100 text-teal-700" },
  { stroke: "#e879f9", fill: "#e879f9", bg: "from-pink-50 to-fuchsia-100",    badge: "bg-pink-100 text-pink-700" },
  { stroke: "#fb7185", fill: "#fb7185", bg: "from-rose-50 to-pink-100",       badge: "bg-rose-100 text-rose-700" },
  { stroke: "#a78bfa", fill: "#a78bfa", bg: "from-purple-50 to-violet-100",   badge: "bg-purple-100 text-purple-700" },
];

const categories = [
  { key: "pronunciation", label: "발음",           iconImg: pronunciationIcon, color: "#3b82f6" },
  { key: "vocabulary",    label: "어휘",           iconImg: vocabularyIcon,    color: "#10b981" },
  { key: "grammar",       label: "문법",           iconImg: grammarIcon,       color: "#f59e0b" },
  { key: "listening",     label: "듣기",           iconImg: listeningIcon,     color: "#8b5cf6" },
  { key: "speaking",      label: "말하기(母国語X)", iconImg: speakingIcon,      color: "#ec4899" },
];

const jaMap = {
  "발음": "発音", "말하기(母国語X)": "スピーキング",
  "듣기": "リスニング", "문법": "文法", "어휘": "語彙"
};
const catColors = ["#3b82f6","#10b981","#f59e0b","#ec4899","#8b5cf6"];

const nowMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
};
const todayStr = () => new Date().toISOString().slice(0,10);
const prevMonthStr = (m) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(y, mo - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
};

const Logo = ({ width = 220 }) => (
  <img src={arinLogo} alt="Arin Korean Lab" className="mx-auto" style={{ width, height: "auto" }} />
);

const StarRating = ({ value, onChange, color }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} onClick={() => onChange(n)}
        className="text-2xl transition-transform hover:scale-110 focus:outline-none"
        style={{ color: n <= value ? color : "#d1d5db" }}>★</button>
    ))}
  </div>
);

const StarDisplay = ({ value, color = "#f59e0b", size = "text-sm" }) => (
  <div className={`inline-flex ${size}`}>
    {[0,1,2,3,4].map(i => {
      const fill = Math.max(0, Math.min(1, value - i)) * 100;
      return (
        <span key={i} className="relative inline-block leading-none" style={{ color: "#d1d5db" }}>
          ★
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%`, color }}>★</span>
        </span>
      );
    })}
  </div>
);

export default function App() {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [month, setMonth] = useState(nowMonth());
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newName, setNewName] = useState("");
  const [lessonForm, setLessonForm] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [reportMonth, setReportMonth] = useState(nowMonth());

  // ── Load ──
  const loadAll = async () => {
    setLoading(true); setError(null);
    try {
      const [{ data: s }, { data: l }, { data: m }] = await Promise.all([
        supabase.from("students").select("*").order("id"),
        supabase.from("lesson_logs").select("*").order("date"),
        supabase.from("monthly_records").select("*").order("month"),
      ]);
      if (!s.length) {
        for (const name of initialStudents) await supabase.from("students").insert({ name });
        const { data: s2 } = await supabase.from("students").select("*").order("id");
        setStudents(s2);
      } else setStudents(s);
      setLessons(l || []);
      setMonthlyRecords(m || []);
    } catch(e) { setError("DB 연결 오류: " + e.message); }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const getColor = (name) => colorPalette[students.findIndex(s => s.name === name) % colorPalette.length] || colorPalette[0];
  const color = selected ? getColor(selected) : null;

  // ── Student ──
  const addStudent = async () => {
    const t = newName.trim();
    if (!t || students.find(s => s.name === t)) return;
    setSaving(true);
    const { data } = await supabase.from("students").insert({ name: t }).select();
    setStudents(p => [...p, data[0]]);
    setNewName("");
    setSaving(false);
  };

  const saveEdit = async (id, oldName) => {
    const t = editingName.trim();
    if (!t || (t !== oldName && students.find(s => s.name === t))) return;
    setSaving(true);
    await supabase.from("students").update({ name: t }).eq("id", id);
    setStudents(p => p.map(s => s.id === id ? { ...s, name: t } : s));
    setLessons(p => p.map(l => l.student_name === oldName ? { ...l, student_name: t } : l));
    setMonthlyRecords(p => p.map(r => r.student_name === oldName ? { ...r, student_name: t } : r));
    setEditingIdx(null);
    setSaving(false);
  };

  const deleteStudent = async (id, name) => {
    setSaving(true);
    await supabase.from("students").delete().eq("id", id);
    await supabase.from("lesson_logs").delete().eq("student_name", name);
    await supabase.from("monthly_records").delete().eq("student_name", name);
    setStudents(p => p.filter(s => s.id !== id));
    setLessons(p => p.filter(l => l.student_name !== name));
    setMonthlyRecords(p => p.filter(r => r.student_name !== name));
    setSaving(false);
  };

  // ── Lessons ──
  const getLessons = (name) => lessons.filter(l => l.student_name === name);

  const saveLesson = async () => {
    if (!lessonForm || categories.some(c => lessonForm.scores[c.key] === 0)) return;
    setSaving(true);
    const body = {
      student_name: selected, date: lessonForm.date,
      pronunciation: lessonForm.scores.pronunciation,
      speaking: lessonForm.scores.speaking,
      listening: lessonForm.scores.listening,
      grammar: lessonForm.scores.grammar,
      vocabulary: lessonForm.scores.vocabulary,
    };
    if (editingLessonId) {
      await supabase.from("lesson_logs").update(body).eq("id", editingLessonId);
      setLessons(p => p.map(l => l.id === editingLessonId ? { ...l, ...body } : l));
    } else {
      const { data } = await supabase.from("lesson_logs").insert(body).select();
      setLessons(p => [...p, data[0]]);
    }
    setLessonForm(null); setEditingLessonId(null); setView("lessons");
    setSaving(false);
  };

  const deleteLesson = async (id) => {
    setSaving(true);
    await supabase.from("lesson_logs").delete().eq("id", id);
    setLessons(p => p.filter(l => l.id !== id));
    setSaving(false);
  };

  // ── Monthly ──
  const getMonthlyRecord = (name, m) => monthlyRecords.find(r => r.student_name === name && r.month === m);
  const isMonthFilled = (name, m) => { const r = getMonthlyRecord(name, m); return r && categories.every(c => (r[c.key] || 0) > 0); };

  const updateMonthlyRating = async (cat, val) => {
    const existing = getMonthlyRecord(selected, month);
    if (existing) {
      await supabase.from("monthly_records").update({ [cat]: val }).eq("id", existing.id);
      setMonthlyRecords(p => p.map(r => r.id === existing.id ? { ...r, [cat]: val } : r));
    } else {
      const full = { student_name: selected, month, pronunciation:0, speaking:0, listening:0, grammar:0, vocabulary:0, [cat]: val };
      const { data } = await supabase.from("monthly_records").insert(full).select();
      setMonthlyRecords(p => [...p, data[0]]);
    }
  };

  const radarDataMonthly = (name, m) => {
    const r = getMonthlyRecord(name, m);
    return categories.map(c => ({ subject: c.label, 점수: r?.[c.key] || 0, fullMark: 5 }));
  };
  const avgScoreMonthly = (name, m) => {
    const r = getMonthlyRecord(name, m);
    if (!r) return "0.0";
    return (categories.reduce((a, c) => a + (r[c.key] || 0), 0) / categories.length).toFixed(1);
  };
  const recordedMonths = (name) => [...new Set(monthlyRecords.filter(r => r.student_name === name).map(r => r.month))].sort().reverse();
  const lessonMonths = (name) => [...new Set(getLessons(name).map(l => l.date.slice(0,7)))].sort().reverse();

  const lessonReportData = (name, m) => {
    const arr = getLessons(name).filter(l => l.date.startsWith(m));
    if (!arr.length) return null;
    const avg = {};
    categories.forEach(c => { avg[c.key] = parseFloat((arr.reduce((a, l) => a + (l[c.key] || 0), 0) / arr.length).toFixed(2)); });
    return { avg, count: arr.length, lessons: arr };
  };

  const historyData = (name) => recordedMonths(name).slice().reverse().map(m => {
    const r = getMonthlyRecord(name, m);
    const row = { month: m.replace("-", "/") };
    categories.forEach(c => { row[c.label] = r?.[c.key] || 0; });
    return row;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
        <Logo width={180} />
      </div>
      <p className="text-gray-400 text-sm animate-pulse">데이터 불러오는 중...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6">
      <p className="text-red-400 text-lg font-bold">⚠️ 오류 발생</p>
      <p className="text-red-400 text-sm">{error}</p>
      <button onClick={() => { setError(null); loadAll(); }} className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm">다시 시도</button>
    </div>
  );

  // ── LIST ──
  if (view === "list") return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-sky-50 p-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5"><Logo /></div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-hidden">
          <label className="text-sm font-medium text-gray-600 block mb-1">수업 월 선택</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full max-w-full box-border text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 pr-3" />
        </div>
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-sm text-gray-500">학생 {students.length}명</span>
          <button onClick={() => setView("manage")} className="text-sm text-rose-500 font-semibold hover:text-rose-700">✏️ 학생 관리</button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {students.map((s, i) => {
            const c = getColor(s.name);
            const lCount = getLessons(s.name).length;
            const filled = isMonthFilled(s.name, month);
            return (
              <button key={s.id} onClick={() => { setSelected(s.name); setView("form"); }}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition border-b last:border-0 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-5">{i+1}</span>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.stroke }} />
                  <div>
                    <span className="font-medium text-gray-800 block">{s.name}</span>
                    <span className="text-xs text-gray-400">
                      {lCount > 0 ? `수업 ${lCount}회 기록` : "수업 기록 없음"}
                      {recordedMonths(s.name).length > 0 && ` · 월말 ${recordedMonths(s.name).length}개월`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {filled && <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>✓ 완료</span>}
                  <span className="text-gray-400">›</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-center mt-4">
          <button onClick={() => setView("promo")} className="text-xs text-gray-400 hover:text-gray-600">📢 프로모션 카드 보기</button>
        </div>
      </div>
    </div>
  );

  // ── PROMO (Canva 9페이지 복제) ──
  if (view === "promo") return (
    <div className="min-h-screen p-6" style={{ background: "#FFFDC6" }}>
      <div className="max-w-lg mx-auto">
        <button onClick={() => setView("list")} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 목록으로</button>

        <p className="text-center text-gray-800 mb-6">@reallygreatsite</p>

        <h1 className="text-center text-black leading-tight mb-10 text-5xl" style={{ fontFamily: "'Black Han Sans', sans-serif" }}>
          "로고는 만들었는데…<br />왜 부족해 보일까?"
        </h1>

        <div className="relative mx-auto mb-6" style={{ width: "72%" }}>
          <div className="absolute left-1/2 -top-3 w-24 h-7 bg-amber-200/60 -translate-x-[65%] rotate-[-8deg] rounded-sm" />
          <div className="absolute left-1/2 -bottom-3 w-24 h-7 bg-amber-200/50 -translate-x-[35%] rotate-[6deg] rounded-sm" />
          <div className="relative bg-white shadow-xl px-6 py-10 rotate-[-3.9155deg]">
            <p className="text-2xl mb-6" style={{ fontFamily: "'Poor Story', cursive" }}>브랜드 느낌이 안 산다</p>
            <p className="text-2xl mb-6" style={{ fontFamily: "'Poor Story', cursive" }}>너무 평범하다</p>
            <p className="text-2xl" style={{ fontFamily: "'Poor Story', cursive" }}>기억에 안 남는다</p>
          </div>
        </div>

        <div className="flex justify-end -mt-10 mb-2 pr-4">
          <svg viewBox="0 0 120 170" width="88" height="125" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M60 8c-24 0-40 18-40 40 0 16 8 26 16 34 6 6 10 12 11 20h26c1-8 5-14 11-20 8-8 16-18 16-34 0-22-16-40-40-40z" />
            <path d="M52 60c-2-6 2-10 6-8 1-4 6-6 9-2 2-3 7-2 8 2 4-1 7 3 5 7-2 4-8 6-14 6-6 6-10 14-10 22" />
            <path d="M52 60c-3 2-2 6 1 8" />
            <rect x="46" y="102" width="28" height="8" rx="2" />
            <line x1="46" y1="112" x2="74" y2="112" />
            <line x1="46" y1="118" x2="74" y2="118" />
            <line x1="46" y1="124" x2="74" y2="124" />
            <path d="M50 130h20v6a10 6 0 01-20 0z" fill="black" />
          </svg>
        </div>

        <p className="text-xl font-extrabold text-black leading-snug text-center mb-6 px-1">
          <span className="text-2xl align-middle">✓</span>디자인은 감각이 아니라<br />전략 + 해석이 들어가야 합니다!
        </p>

        <div className="w-[72%] mx-auto rounded-full py-4 px-5 flex items-center gap-2 mb-3 shadow-md" style={{ background: "#f8cd34" }}>
          <span className="flex-1 text-black font-extrabold text-base leading-snug text-center">DM으로 "로고 점검" 보내면<br />무료 피드백 드려요</span>
          <span className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ml-3" style={{ background: "radial-gradient(circle at 35% 30%, #FDEFA3, #F0B90B)" }}>
            <ChevronRight size={26} color="black" strokeWidth={3} />
          </span>
        </div>

        <p className="text-center text-base text-gray-800 font-medium">2035년 5월 25일까지</p>
      </div>
    </div>
  );

  // ── MANAGE ──
  if (view === "manage") return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-sky-50 p-6">
      <div className="max-w-lg mx-auto">
        <button onClick={() => { setEditingIdx(null); setView("list"); }} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 학생 목록</button>
        <div className="text-center mb-5"><div className="text-3xl mb-1">✏️</div><h2 className="text-xl font-bold text-gray-800">학생 관리</h2></div>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">새 학생 추가</h3>
          <div className="flex gap-2">
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addStudent()}
              placeholder="이름 입력" className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <button onClick={addStudent} disabled={saving} className="px-4 py-2 bg-rose-500 text-white text-sm rounded-lg font-semibold hover:bg-rose-600 disabled:opacity-50">추가</button>
          </div>
          {newName.trim() && students.find(s => s.name === newName.trim()) && <p className="text-xs text-red-400 mt-1">이미 존재하는 이름이에요</p>}
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {students.map((s, i) => {
            const c = getColor(s.name);
            return (
              <div key={s.id} className="flex items-center gap-2 px-4 py-3 border-b last:border-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.stroke }} />
                {editingIdx === i ? (
                  <>
                    <input value={editingName} onChange={e => setEditingName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit(s.id, s.name)}
                      autoFocus className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    <button onClick={() => saveEdit(s.id, s.name)} disabled={saving} className="text-xs px-3 py-1 bg-rose-500 text-white rounded-lg disabled:opacity-50">저장</button>
                    <button onClick={() => setEditingIdx(null)} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg">취소</button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-gray-800">{s.name}</span>
                    <button onClick={() => { setEditingIdx(i); setEditingName(s.name); }} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">수정</button>
                    <button onClick={() => deleteStudent(s.id, s.name)} disabled={saving} className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 disabled:opacity-50">삭제</button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── LESSONS LIST ──
  if (view === "lessons") {
    const arr = getLessons(selected);
    const lm = lessonMonths(selected);
    return (
      <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView("form")} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 돌아가기</button>
          <div className="text-center mb-4">
            <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
              <Logo width={160} />
            </div>
            <div className="text-2xl my-1">📓</div>
            <h2 className="text-xl font-bold text-gray-800">{selected}</h2>
            <p className="text-gray-400 text-sm">수업별 점수 기록</p>
          </div>
          <button onClick={() => { setLessonForm({ date: todayStr(), scores: Object.fromEntries(categories.map(c => [c.key, 0])) }); setEditingLessonId(null); setView("lesson_form"); }}
            className="w-full mb-4 py-3 rounded-xl text-white font-semibold text-sm shadow" style={{ background: color.stroke }}>
            + 새 수업 점수 추가
          </button>
          {lm.length > 0 && (
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">📊 월별 통계 리포트</h3>
              <div className="flex flex-wrap gap-2">
                {lm.map(m => (
                  <button key={m} onClick={() => { setReportMonth(m); setView("lesson_report"); }}
                    className="text-xs px-3 py-1.5 rounded-full border font-semibold transition hover:opacity-80"
                    style={{ borderColor: color.stroke, color: color.stroke }}>
                    {m.replace("-", "년 ")}월
                  </button>
                ))}
              </div>
            </div>
          )}
          {arr.length === 0 ? (
            <div className="text-center text-gray-400 py-10">아직 수업 기록이 없어요</div>
          ) : (
            <div className="space-y-3">
              {[...arr].reverse().map(lesson => {
                const avg = (categories.reduce((a, c) => a + (lesson[c.key] || 0), 0) / categories.length).toFixed(1);
                return (
                  <div key={lesson.id} className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700">{lesson.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: color.stroke }}>{avg}/5</span>
                        <button onClick={() => { setLessonForm({ date: lesson.date, scores: Object.fromEntries(categories.map(c => [c.key, lesson[c.key] || 0])) }); setEditingLessonId(lesson.id); setView("lesson_form"); }}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">수정</button>
                        <button onClick={() => deleteLesson(lesson.id)} disabled={saving}
                          className="text-xs px-2 py-1 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 disabled:opacity-50">삭제</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {categories.map(c => (
                        <div key={c.key} className="text-center">
                          <div className="text-xs text-gray-400 mb-0.5 truncate">{c.label.replace("말하기(母国語X)", "말하기")}</div>
                          <div className="font-bold text-sm" style={{ color: color.stroke }}>{lesson[c.key]}</div>
                        </div>
                      ))}
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

  // ── LESSON FORM ──
  if (view === "lesson_form") {
    const lf = lessonForm || { date: todayStr(), scores: Object.fromEntries(categories.map(c => [c.key, 0])) };
    const allFilled = categories.every(c => lf.scores[c.key] > 0);
    return (
      <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => { setLessonForm(null); setEditingLessonId(null); setView("lessons"); }} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 기록 목록</button>
          <div className="text-center mb-4">
            <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
              <Logo width={160} />
            </div>
            <div className="text-2xl my-1">📝</div>
            <h2 className="text-xl font-bold text-gray-800">{selected}</h2>
            <p className="text-gray-400 text-sm">{editingLessonId ? "수업 기록 수정" : "새 수업 점수 입력"}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">📅 수업 날짜</label>
            <input type="date" value={lf.date} onChange={e => setLessonForm(p => ({ ...p, date: e.target.value }))}
              className="border rounded-lg px-3 py-2 w-full box-border text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div className="space-y-3 mb-4">
            {categories.map(c => (
              <div key={c.key} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">{c.label}</h3>
                  <span className="text-sm font-bold" style={{ color: lf.scores[c.key] > 0 ? color.stroke : "#d1d5db" }}>
                    {lf.scores[c.key] > 0 ? `${lf.scores[c.key]} / 5` : "미입력"}
                  </span>
                </div>
                <StarRating value={lf.scores[c.key]} color={color.stroke}
                  onChange={v => setLessonForm(p => ({ ...p, scores: { ...p.scores, [c.key]: v } }))} />
              </div>
            ))}
          </div>
          <button onClick={saveLesson} disabled={!allFilled || saving}
            className="w-full py-3 rounded-xl font-semibold text-white transition"
            style={{ background: allFilled && !saving ? color.stroke : "#d1d5db", cursor: allFilled && !saving ? "pointer" : "not-allowed" }}>
            {saving ? "저장 중..." : "💾 저장하기"}
          </button>
          {!allFilled && <p className="text-center text-xs text-gray-400 mt-2">모든 항목 점수를 입력해야 저장할 수 있어요</p>}
        </div>
      </div>
    );
  }

  // ── LESSON REPORT ──
  if (view === "lesson_report") {
    const rpt = lessonReportData(selected, reportMonth);
    const [, rm] = reportMonth.split("-");
    if (!rpt) return (
      <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView("lessons")} className="text-sm text-gray-500 mb-4">‹ 기록 목록</button>
          <div className="text-center text-gray-400 py-20">해당 월의 수업 기록이 없어요</div>
        </div>
      </div>
    );
    const rData = categories.map(c => ({ subject: c.key === "speaking" ? "말하기" : c.label, 평균: rpt.avg[c.key], fullMark: 5 }));
    const totalAvg = (categories.reduce((a, c) => a + rpt.avg[c.key], 0) / categories.length).toFixed(1);
    const prevMonth = prevMonthStr(reportMonth);
    const prevRpt = lessonReportData(selected, prevMonth);
    const [, prevRm] = prevMonth.split("-");
    return (
      <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView("lessons")} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 기록 목록</button>
          <div className="flex justify-center mb-5">
            <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
              <Logo width={160} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
            <div className="mb-4">
              <h2 className="text-3xl font-bold" style={{ color: color.stroke }}>{rm}월</h2>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex flex-col gap-2 flex-shrink-0">
                <div className="text-center bg-gray-50 rounded-xl px-3 py-2">
                  <div className="font-bold text-gray-700">{selected}</div>
                </div>
                <div className="text-center bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5">
                    <img src={calendarBlueIcon} alt="" className="w-3 h-3" /> 수업 횟수
                  </div>
                  <div className="font-bold text-gray-700">{rpt.count}회</div>
                </div>
                <div className="text-center rounded-xl px-3 py-2" style={{ background: color.fill + "14" }}>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-0.5">
                    <img src={targetBlueIcon} alt="" className="w-3 h-3" /> 종합 평균
                  </div>
                  <div className="font-bold" style={{ color: color.stroke }}>{totalAvg}/5.0</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={rData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 600, fill: "#374151" }} />
                    <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Radar dataKey="평균" stroke={color.stroke} fill={color.fill} fillOpacity={0.25} strokeWidth={2} dot={{ r: 4, fill: color.fill }} />
                    <Tooltip formatter={v => [`${v}점`, "평균"]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {prevRpt && (
            <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <img src={starBadgeIcon} alt="" className="w-7 h-7" />
                영역별 점수 비교
              </h3>
              <div className="grid grid-cols-[1.8fr_1fr_1fr_0.7fr] gap-1 items-center text-gray-400 text-[11px] font-medium pb-2">
                <span />
                <span className="text-center whitespace-nowrap" style={{ color: color.stroke }}>
                  <span className="inline-flex items-center justify-center gap-1">{Number(prevRm)}월 <ArrowRight size={11} strokeWidth={2} /></span>
                </span>
                <span className="text-center whitespace-nowrap" style={{ color: color.stroke }}>{Number(rm)}월</span>
                <span className="text-center">변화</span>
              </div>
              {categories.map(c => {
                const prev = prevRpt.avg[c.key];
                const cur = rpt.avg[c.key];
                const diff = +(cur - prev).toFixed(2);
                return (
                  <div key={c.key} className="grid grid-cols-[1.8fr_1fr_1fr_0.7fr] gap-1 items-center py-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={c.iconImg} alt={c.label} className="flex-shrink-0 w-7 h-7 rounded-full" />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-700 text-xs whitespace-nowrap">{c.label}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <StarDisplay value={prev} color="#f59e0b" />
                      <div className="text-[10px] text-gray-400 mt-0.5">{prev.toFixed(2)}/5</div>
                    </div>
                    <div className="text-center">
                      <StarDisplay value={cur} color="#f59e0b" />
                      <div className="text-[10px] text-gray-400 mt-0.5">{cur.toFixed(2)}/5</div>
                    </div>
                    <div className="text-center font-semibold text-xs whitespace-nowrap" style={{ color: diff > 0 ? "#16a34a" : diff < 0 ? "#dc2626" : "#9ca3af" }}>
                      {diff > 0 ? "▲" : diff < 0 ? "▼" : "-"}{diff !== 0 ? ` ${Math.abs(diff).toFixed(2)}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-xs text-gray-400">🏆 꾸준한 학습이 가장 큰 성과입니다. 앞으로도 함께 화이팅해요! 💙</p>
        </div>
      </div>
    );
  }

  // ── FORM (월말 평가) ──
  if (view === "form") {
    const rec = getMonthlyRecord(selected, month);
    return (
      <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView("list")} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 학생 목록</button>
          <div className="text-center mb-4">
            <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
              <Logo width={160} />
            </div>
            <div className="text-3xl my-1">🇰🇷</div>
            <h2 className="text-xl font-bold text-gray-800">{selected}</h2>
            <p className="text-gray-400 text-sm">{month.replace("-", "년 ")}월</p>
          </div>
          <button onClick={() => setView("lessons")}
            className="w-full mb-3 py-3 rounded-xl border-2 font-semibold text-sm shadow bg-white flex items-center justify-center gap-2"
            style={{ borderColor: color.stroke, color: color.stroke }}>
            📓 수업별 점수 기록 ({getLessons(selected).length}회)
          </button>
          {recordedMonths(selected).length > 0 && (
            <button onClick={() => setView("history")}
              className="w-full mb-4 py-2.5 rounded-xl border font-semibold text-sm bg-white shadow hover:bg-gray-50 text-gray-600">
              📈 월별 성장 기록 ({recordedMonths(selected).length}개월)
            </button>
          )}
          <div className="bg-white rounded-xl p-3 mb-4 shadow">
            <p className="text-xs text-center text-gray-500 font-semibold">── 월말 종합 평가 ──</p>
          </div>
          {isMonthFilled(selected, month) && (
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <p className="text-xs text-center text-gray-400 mb-1">평가 미리보기</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarDataMonthly(selected, month)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#555" }} />
                  <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 9, fill: "#aaa" }} />
                  <Radar dataKey="점수" stroke={color.stroke} fill={color.fill} fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.key} className="bg-white rounded-xl shadow p-4">
                <h3 className="font-semibold text-gray-700 mb-3">{cat.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => updateMonthlyRating(cat.key, r)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${(rec?.[cat.key] || 0) === r ? "text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}
                      style={(rec?.[cat.key] || 0) === r ? { background: color.stroke } : {}}>
                      {["1 - 노력 필요", "2 - 보통", "3 - 좋음", "4 - 훌륭함", "5 - 최우수"][r - 1]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => setView("result")} disabled={!isMonthFilled(selected, month)}
              className="w-full py-3 rounded-xl font-semibold text-white transition"
              style={{ background: isMonthFilled(selected, month) ? color.stroke : "#d1d5db", cursor: isMonthFilled(selected, month) ? "pointer" : "not-allowed" }}>
              📊 월말 그래프 생성하기
            </button>
            {!isMonthFilled(selected, month) && <p className="text-center text-xs text-gray-400">모든 항목의 점수를 선택해야 생성할 수 있어요</p>}
          </div>
        </div>
      </div>
    );
  }

  // ── HISTORY ──
  if (view === "history") {
    const hData = historyData(selected);
    return (
      <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView("form")} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 평가 입력</button>
          <div className="text-center mb-5">
            <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
              <Logo width={160} />
            </div>
            <div className="text-3xl my-1">🇰🇷</div>
            <h2 className="text-xl font-bold text-gray-800">{selected}</h2>
            <p className="text-gray-400 text-sm">월별 성장 기록</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
            <h3 className="font-bold text-gray-700 mb-4">📈 항목별 월별 추이</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={hData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 11 }} />
                <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                {categories.map((c, i) => (
                  <Line key={c.key} type="monotone" dataKey={c.label} stroke={catColors[i]} strokeWidth={2} dot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {recordedMonths(selected).map(m => {
              const [y, mo] = m.split("-");
              const r = getMonthlyRecord(selected, m);
              const maxS = Math.max(...categories.map(c => r?.[c.key] || 0));
              const tops = categories.filter(c => (r?.[c.key] || 0) === maxS).map(c => jaMap[c.label]).join("、");
              return (
                <div key={m} className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">{y}년 {mo}월</span>
                    <span className="font-bold text-sm" style={{ color: color.stroke }}>{avgScoreMonthly(selected, m)} / 5.0</span>
                  </div>
                  <div className="rounded-lg px-3 py-2 mb-3 text-xs" style={{ background: color.fill + "18", borderLeft: `3px solid ${color.stroke}` }}>
                    {mo}月は<strong>{tops}</strong>が特に輝いていました。😊
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <RadarChart data={radarDataMonthly(selected, m)}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#374151" }} />
                      <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                      <Radar dataKey="점수" stroke={color.stroke} fill={color.fill} fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: color.fill }} />
                      <Tooltip formatter={v => [`${v}점`, "점수"]} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="mt-1 space-y-1">
                    {categories.map(c => {
                      const v = r?.[c.key] || 0;
                      return (
                        <div key={c.key} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24 flex-shrink-0">{c.label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${v / 5 * 100}%`, background: color.fill }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-8 text-right">{v}/5</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  const [year, mon] = month.split("-");
  const rec = getMonthlyRecord(selected, month);
  const maxScore = Math.max(...categories.map(c => rec?.[c.key] || 0));
  const topCats = categories.filter(c => (rec?.[c.key] || 0) === maxScore);
  const topNamesJa = topCats.map(c => jaMap[c.label]).join("、");

  return (
    <div className={`min-h-screen bg-gradient-to-br ${color.bg} p-6`}>
      <div className="max-w-lg mx-auto">
        <button onClick={() => setView("form")} className="text-sm text-gray-500 mb-4 hover:text-gray-700">‹ 평가 수정</button>
        <div className="text-center mb-5">
          <div className="inline-block bg-white rounded-full shadow-sm px-8 py-5">
            <Logo width={160} />
          </div>
          <div className="text-3xl my-1">🇰🇷</div>
          <h2 className="text-xl font-bold text-gray-800">{selected}</h2>
          <p className="text-gray-400 text-sm">{year}년 {mon}월 월말 피드백</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-700 text-base">📊 이번 달 실력 분포</h3>
            <span className="font-bold text-lg" style={{ color: color.stroke }}>{avgScoreMonthly(selected, month)} / 5.0</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">5점 만점 레이더 차트</p>
          <div className="rounded-xl px-4 py-3 mb-3 text-sm" style={{ background: color.fill + "18", borderLeft: `4px solid ${color.stroke}` }}>
            <p className="text-gray-700 leading-relaxed">{mon}月は<strong>{topNamesJa}</strong>が特に輝いていました。😊ありがとうございます！</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarDataMonthly(selected, month)}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fontWeight: 600, fill: "#374151" }} />
              <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Radar dataKey="점수" stroke={color.stroke} fill={color.fill} fillOpacity={0.25} strokeWidth={2} dot={{ r: 4, fill: color.fill }} />
              <Tooltip formatter={v => [`${v}점`, "점수"]} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {categories.map(c => {
              const v = rec?.[c.key] || 0;
              return (
                <div key={c.key} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-24 flex-shrink-0">{c.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${v / 5 * 100}%`, background: color.fill }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">{v}/5</span>
                </div>
              );
            })}
          </div>
        </div>
        {recordedMonths(selected).length > 1 && (
          <button onClick={() => setView("history")}
            className="w-full mb-3 py-2.5 rounded-xl border text-sm font-semibold text-gray-600 bg-white shadow hover:bg-gray-50"
            style={{ borderColor: color.stroke }}>
            📈 월별 성장 기록 보기
          </button>
        )}
        <div className="flex gap-3">
          <button onClick={() => setView("form")} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 text-sm">‹ 평가 수정</button>
          <button onClick={() => setView("list")} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: color.stroke }}>다른 학생</button>
        </div>
      </div>
    </div>
  );
}
