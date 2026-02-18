"use client";

import { useState, useEffect, useRef } from "react";

const FAKE_RANKINGS = [
  { name: "김민준", hours: 11.5, subject: "수능 수학", streak: 45 },
  { name: "이서연", hours: 10.2, subject: "공무원 행정법", streak: 38 },
  { name: "박지훈", hours: 9.8, subject: "토익 900+", streak: 52 },
  { name: "최유진", hours: 9.3, subject: "CPA 회계학", streak: 30 },
  { name: "정도윤", hours: 8.7, subject: "코딩테스트", streak: 22 },
  { name: "한소율", hours: 8.1, subject: "의학 해부학", streak: 67 },
  { name: "윤하은", hours: 7.5, subject: "변리사 시험", streak: 18 },
  { name: "강시우", hours: 7.2, subject: "JLPT N1", streak: 41 },
  { name: "조예린", hours: 6.8, subject: "디자인 포트폴리오", streak: 15 },
  { name: "임준서", hours: 6.3, subject: "수능 국어", streak: 33 },
];

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function fmtHours(h: number) {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}시간 ${mins}분`;
}

type LogEntry = { subject: string; seconds: number; time: string };

export default function TimerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState("");
  const [todayLog, setTodayLog] = useState<LogEntry[]>([]);
  const [tab, setTab] = useState("timer");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const handleStop = () => {
    if (seconds > 0) {
      setTodayLog((prev) => [...prev, { subject: subject || "미분류", seconds, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setIsRunning(false);
    setSeconds(0);
  };

  const totalToday = todayLog.reduce((sum, l) => sum + l.seconds, 0);
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const maxSeconds = 12 * 3600;
  const progress = Math.min((totalToday + seconds) / maxSeconds, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8">
      <div className="text-center pt-10 mb-9">
        <div className="text-[11px] font-medium text-[var(--text-tertiary)] tracking-[0.2em] mb-3">STUDY TIMER</div>
        <h2 className="text-2xl font-light text-[var(--text)]">공부 타이머</h2>
      </div>

      <div className="flex justify-center border-b border-[var(--border)] mb-10">
        {[["timer", "타이머"], ["ranking", "오늘의 랭킹"], ["weekly", "주간 랭킹"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className="text-[13px] px-5 md:px-7 py-3 bg-transparent border-none cursor-pointer"
            style={{ fontWeight: tab === id ? 600 : 400, color: tab === id ? "var(--text)" : "var(--text-secondary)", borderBottom: tab === id ? "2px solid var(--text)" : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "timer" && (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
            <input placeholder="공부 과목을 입력하세요" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isRunning}
              className="w-full max-w-[280px] px-4 py-3 border border-[var(--border)] bg-[var(--bg)] text-[13px] text-center outline-none mb-8" />
            <div className="relative w-[260px] h-[260px] md:w-[290px] md:h-[290px] mb-8">
              <svg width="100%" height="100%" viewBox="0 0 290 290" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="145" cy="145" r={radius} fill="none" stroke="var(--border-light)" strokeWidth="3" />
                <circle cx="145" cy="145" r={radius} fill="none" stroke={isRunning ? "var(--green)" : "var(--text)"} strokeWidth="3"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-[36px] md:text-[42px] font-light text-[var(--text)] tracking-wide">{fmt(seconds)}</div>
                {isRunning && (
                  <div className="text-xs text-[var(--green)] mt-2 font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" style={{ animation: "timerPulse 1.5s ease-in-out infinite" }} />집중 중
                  </div>
                )}
                {!isRunning && seconds === 0 && <div className="text-xs text-[var(--text-tertiary)] mt-2">시작 버튼을 눌러주세요</div>}
              </div>
            </div>
            <div className="flex gap-3">
              {!isRunning ? (
                <button onClick={() => setIsRunning(true)} className="px-12 py-3.5 border-none bg-[var(--text)] text-white text-sm font-semibold cursor-pointer">
                  {seconds > 0 ? "이어하기" : "시작"}
                </button>
              ) : (
                <>
                  <button onClick={() => setIsRunning(false)} className="px-8 py-3.5 border border-[var(--border)] bg-transparent text-[13px] text-[var(--text-secondary)] cursor-pointer">일시정지</button>
                  <button onClick={handleStop} className="px-8 py-3.5 border-none bg-[var(--red)] text-white text-[13px] font-semibold cursor-pointer">종료</button>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white border border-[var(--border)] p-7 mb-4">
              <div className="text-xs text-[var(--text-tertiary)] mb-2">오늘 총 공부시간</div>
              <div className="font-mono text-[28px] md:text-[32px] font-bold text-[var(--text)]">{fmt(totalToday + (isRunning ? seconds : 0))}</div>
              <div className="mt-4 h-1 bg-[var(--border-light)]">
                <div className="h-full bg-[var(--green)] transition-all duration-1000" style={{ width: `${Math.min(((totalToday + seconds) / maxSeconds) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[11px] text-[var(--text-tertiary)]"><span>0h</span><span>12h 목표</span></div>
            </div>
            <div className="bg-white border border-[var(--border)]">
              <div className="px-5 py-4 border-b border-[var(--border-light)] text-[13px] font-semibold text-[var(--text)]">오늘의 기록</div>
              {todayLog.length === 0 ? (
                <div className="py-8 text-center text-[13px] text-[var(--text-tertiary)]">아직 기록이 없습니다</div>
              ) : (
                todayLog.map((log, i) => (
                  <div key={i} className="px-5 py-3 flex justify-between items-center" style={{ borderBottom: i < todayLog.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                    <div>
                      <div className="text-[13px] font-medium text-[var(--text)]">{log.subject}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{log.time}</div>
                    </div>
                    <div className="font-mono text-[13px] font-semibold text-[var(--text)]">{fmt(log.seconds)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {(tab === "ranking" || tab === "weekly") && (
        <div className="max-w-[600px] mx-auto">
          <div className="bg-white border border-[var(--border)]">
            <div className="px-7 py-8 border-b border-[var(--border-light)] flex justify-center items-end gap-5">
              {[1, 0, 2].map((idx) => {
                const r = FAKE_RANKINGS[idx];
                const heights = [140, 100, 80];
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="text-[13px] font-semibold text-[var(--text)]">{r.name}</div>
                    <div className="font-mono text-xs text-[var(--green)] font-semibold">{fmtHours(r.hours)}</div>
                    <div className="w-16 md:w-20 flex items-start justify-center pt-3" style={{ height: heights[idx], background: idx === 0 ? "var(--text)" : "var(--border-light)" }}>
                      <span className="text-xl">{medals[idx]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {FAKE_RANKINGS.slice(3).map((r, i) => (
              <div key={i} className="px-4 md:px-6 py-3.5 flex items-center gap-4" style={{ borderBottom: i < FAKE_RANKINGS.length - 4 ? "1px solid var(--border-light)" : "none" }}>
                <div className="font-mono text-xs text-[var(--text-tertiary)] w-7 text-center font-semibold">{i + 4}</div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[var(--text)]">{r.name}</div>
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{r.subject}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[13px] font-semibold text-[var(--text)]">{fmtHours(r.hours)}</div>
                  <div className="text-[10px] text-[var(--amber)]">🔥 {r.streak}일 연속</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

