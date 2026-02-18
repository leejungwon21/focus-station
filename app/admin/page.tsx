"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Reservation = {
  id: string;
  user_id: string;
  seat_id: string;
  zone_id: string;
  started_at: string;
  ended_at: string;
  duration_hours: number;
  amount: number;
  status: string;
  created_at: string;
};

const ADMIN_EMAIL = "nicolewon721@ajou.ac.kr";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("reservations");

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        const { data } = await supabase
          .from("reservations")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setReservations(data);
      }
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="text-sm text-[var(--text-secondary)]">로딩 중...</div></div>;
  }

  if (!user) {
    return (
      <div className="max-w-[500px] mx-auto px-6 pt-20 text-center">
        <div className="text-2xl font-light text-[var(--text)] mb-4">관리자 로그인 필요</div>
        <p className="text-sm text-[var(--text-secondary)]">관리자 계정으로 로그인 해주세요.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-[500px] mx-auto px-6 pt-20 text-center">
        <div className="text-2xl font-light text-[var(--text)] mb-4">접근 권한 없음</div>
        <p className="text-sm text-[var(--text-secondary)]">관리자만 접근할 수 있습니다.</p>
      </div>
    );
  }

  const totalRevenue = reservations.reduce((sum, r) => sum + r.amount, 0);
  const activeCount = reservations.filter((r) => r.status === "active").length;

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8">
      <div className="pt-7 mb-6">
        <div className="text-[11px] font-medium text-[var(--text-tertiary)] tracking-[0.2em] mb-2.5">ADMIN</div>
        <h2 className="text-2xl font-light text-[var(--text)]">관리자 대시보드</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] mb-8">
        <div className="bg-white p-6">
          <div className="text-xs text-[var(--text-tertiary)] mb-2">총 예약 건수</div>
          <div className="font-mono text-[28px] font-bold text-[var(--text)]">{reservations.length}</div>
        </div>
        <div className="bg-white p-6">
          <div className="text-xs text-[var(--text-tertiary)] mb-2">현재 이용중</div>
          <div className="font-mono text-[28px] font-bold text-[var(--green)]">{activeCount}</div>
        </div>
        <div className="bg-white p-6">
          <div className="text-xs text-[var(--text-tertiary)] mb-2">총 매출</div>
          <div className="font-mono text-[28px] font-bold text-[var(--text)]">₩{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex border-b border-[var(--border)] mb-6">
        {[["reservations", "예약 내역"], ["seats", "좌석 현황"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className="text-[13px] px-5 md:px-7 py-3 bg-transparent border-none cursor-pointer"
            style={{ fontWeight: tab === id ? 600 : 400, color: tab === id ? "var(--text)" : "var(--text-secondary)", borderBottom: tab === id ? "2px solid var(--text)" : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "reservations" && (
        <div className="bg-white border border-[var(--border)] overflow-auto">
          <table className="w-full text-left" style={{ minWidth: 600 }}>
            <thead>
              <tr className="border-b border-[var(--border-light)]">
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">좌석</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">구역</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">시작</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">종료</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">시간</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">금액</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--text-tertiary)]">상태</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[var(--text-tertiary)]">예약 내역이 없습니다</td></tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--border-light)]">
                    <td className="px-5 py-3 font-mono text-[13px] font-semibold text-[var(--text)]">{r.seat_id}</td>
                    <td className="px-5 py-3 text-[13px] text-[var(--text-secondary)]">{r.zone_id}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--text-secondary)]">{fmtDate(r.started_at)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--text-secondary)]">{fmtDate(r.ended_at)}</td>
                    <td className="px-5 py-3 text-[13px] text-[var(--text)]">{r.duration_hours}h</td>
                    <td className="px-5 py-3 font-mono text-[13px] font-semibold text-[var(--text)]">₩{r.amount.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-medium px-2 py-1" style={{
                        background: r.status === "active" ? "var(--green-bg)" : r.status === "completed" ? "var(--border-light)" : "var(--red-bg)",
                        color: r.status === "active" ? "var(--green)" : r.status === "completed" ? "var(--text-secondary)" : "var(--red)",
                      }}>{r.status === "active" ? "이용중" : r.status === "completed" ? "완료" : "취소"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "seats" && (
        <SeatStatus />
      )}
    </div>
  );
}

function SeatStatus() {
  const [seats, setSeats] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const [z, s] = await Promise.all([
        supabase.from("zones").select("*").order("sort_order"),
        supabase.from("seats").select("*").order("id"),
      ]);
      if (z.data) setZones(z.data);
      if (s.data) setSeats(s.data);
    }
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {zones.map((zone) => {
        const zoneSeats = seats.filter((s) => s.zone_id === zone.id);
        const avail = zoneSeats.filter((s) => s.status === "available").length;
        const reserved = zoneSeats.filter((s) => s.status === "reserved").length;
        const occupied = zoneSeats.filter((s) => s.status === "occupied").length;
        return (
          <div key={zone.id} className="bg-white border border-[var(--border)] p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[13px] font-semibold text-[var(--text)]">{zone.name}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">{zoneSeats.length}석</div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-[var(--green)]">{avail}</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">이용가능</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-[var(--amber)]">{reserved}</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">예약됨</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-[var(--red)]">{occupied}</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">이용중</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {zoneSeats.map((seat) => (
                <div key={seat.id} className="w-9 h-9 flex items-center justify-center text-[9px] font-mono font-semibold"
                  style={{
                    background: seat.status === "available" ? "white" : seat.status === "reserved" ? "var(--amber-bg)" : "var(--red-bg)",
                    border: `1px solid ${seat.status === "available" ? "var(--border-light)" : seat.status === "reserved" ? "var(--amber)" : "var(--red)"}`,
                    color: seat.status === "available" ? "var(--text)" : seat.status === "reserved" ? "var(--amber)" : "var(--red)",
                  }}>{seat.id}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

