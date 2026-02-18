"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Zone = { id: string; name: string; description: string; price_per_hour: number; icon: string };
type Seat = { id: string; zone_id: string; label: string; row_num: number; col_num: number; status: string };

const TIME_OPTIONS = [
  { label: "1시간", hours: 1 },
  { label: "2시간", hours: 2 },
  { label: "3시간", hours: 3 },
  { label: "4시간", hours: 4 },
  { label: "종일권", hours: 10 },
];

export default function SeatsPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [timeIdx, setTimeIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    async function fetchData() {
      const [zonesRes, seatsRes] = await Promise.all([
        supabase.from("zones").select("*").order("sort_order"),
        supabase.from("seats").select("*").order("id"),
      ]);
      if (zonesRes.data) setZones(zonesRes.data);
      if (seatsRes.data) setSeats(seatsRes.data);
      setLoading(false);
    }
    fetchData();

    const channel = supabase
      .channel("seats-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "seats" }, (payload) => {
        setSeats((prev) => prev.map((s) => (s.id === (payload.new as Seat).id ? (payload.new as Seat) : s)));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSelect = (seat: Seat) => {
    if (seat.status !== "available") return;
    setSelected(selected?.id === seat.id ? null : seat);
  };

  const handleConfirm = async () => {
    if (timeIdx === null || !selected) return;

    if (!user) {
      setToast("로그인이 필요합니다.");
      setShowModal(false);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const zone = zones.find((z) => z.id === selected.zone_id);
    const time = TIME_OPTIONS[timeIdx];
    const price = (zone?.price_per_hour || 0) * time.hours;
    const now = new Date();
    const endTime = new Date(now.getTime() + time.hours * 60 * 60 * 1000);

    // 1. 예약 데이터 DB에 저장
    const { error: resError } = await supabase.from("reservations").insert({
      user_id: user.id,
      seat_id: selected.id,
      zone_id: selected.zone_id,
      started_at: now.toISOString(),
      ended_at: endTime.toISOString(),
      duration_hours: time.hours,
      amount: price,
      status: "active",
    });

    if (resError) {
      setToast("예약 실패: " + resError.message);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // 2. 좌석 상태 변경
    await supabase.from("seats").update({ status: "reserved" }).eq("id", selected.id);

    setSeats((prev) => prev.map((s) => (s.id === selected.id ? { ...s, status: "reserved" } : s)));
    setToast(`${selected.id} · ${time.label} · ₩${price.toLocaleString()} 예약 완료!`);
    setShowModal(false);
    setSelected(null);
    setTimeIdx(null);
    setTimeout(() => setToast(null), 3000);
  };

  const avail = seats.filter((s) => s.status === "available").length;
  const occ = seats.filter((s) => s.status === "occupied").length;
  const res = seats.filter((s) => s.status === "reserved").length;

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="text-sm text-[var(--text-secondary)]">좌석 정보를 불러오는 중...</div></div>;
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end pt-7 mb-6 gap-3">
        <div>
          <div className="text-[11px] font-medium text-[var(--text-tertiary)] tracking-[0.2em] mb-2.5">RESERVATION</div>
          <h2 className="text-2xl font-light text-[var(--text)]">좌석 예약</h2>
        </div>
        <div className="flex gap-5">
          {[
            { label: "이용가능", count: avail, color: "var(--green)" },
            { label: "이용중", count: occ, color: "var(--red)" },
            { label: "예약됨", count: res, color: "var(--amber)" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full" style={{ background: s.color }} />
              <span className="text-xs text-[var(--text-secondary)]">{s.label}</span>
              <span className="font-mono text-xs font-semibold text-[var(--text)]">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] mb-32">
        {zones.map((zone) => {
          const zoneSeats = seats.filter((s) => s.zone_id === zone.id);
          const zoneAvail = zoneSeats.filter((s) => s.status === "available").length;
          const cols = zone.id === "meeting" ? 3 : zone.id === "premium" ? 4 : zone.id === "focus" ? 5 : 6;
          return (
            <div key={zone.id} className="bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border-light)] flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm text-[var(--text-tertiary)]">{zone.icon}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--text)]">{zone.name}</div>
                    <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{zone.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-semibold text-[var(--text)]">₩{zone.price_per_hour.toLocaleString()}<span className="text-[10px] text-[var(--text-tertiary)]">/h</span></div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: zoneAvail > 0 ? "var(--green)" : "var(--red)" }}>{zoneAvail}석 가능</div>
                </div>
              </div>
              <div className="p-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {zoneSeats.map((seat) => {
                  const isSel = selected?.id === seat.id;
                  const isAvail = seat.status === "available";
                  const sc = seat.status === "occupied" ? "var(--red)" : seat.status === "reserved" ? "var(--amber)" : "var(--green)";
                  return (
                    <button key={seat.id} onClick={() => handleSelect(seat)} disabled={!isAvail}
                      className="flex flex-col items-center justify-center gap-0.5 transition-all"
                      style={{
                        aspectRatio: zone.id === "meeting" ? "1.4" : "1",
                        border: isSel ? "2px solid var(--text)" : "1px solid var(--border-light)",
                        background: isSel ? "var(--text)" : isAvail ? "white" : seat.status === "occupied" ? "var(--red-bg)" : "var(--amber-bg)",
                        cursor: isAvail ? "pointer" : "default",
                        opacity: !isAvail ? 0.5 : 1,
                      }}>
                      <span className="font-mono text-[10px] font-semibold" style={{ color: isSel ? "white" : isAvail ? "var(--text)" : sc }}>{seat.id}</span>
                      {isSel && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[var(--border)] px-4 md:px-8 py-3 z-50">
          <div className="max-w-[960px] mx-auto flex justify-between items-center">
            <div>
              <span className="text-[13px] font-semibold text-[var(--text)]">{selected.id}</span>
              <span className="text-xs text-[var(--text-secondary)] ml-2.5">{zones.find((z) => z.id === selected.zone_id)?.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelected(null)} className="px-4 md:px-5 py-2.5 border border-[var(--border)] bg-transparent text-xs text-[var(--text-secondary)] cursor-pointer">취소</button>
              <button onClick={() => setShowModal(true)} className="px-5 md:px-7 py-2.5 border-none bg-[var(--text)] text-white text-[13px] font-semibold cursor-pointer">예약하기</button>
            </div>
          </div>
        </div>
      )}

      {showModal && selected && (
        <div className="fixed inset-0 z-[200] bg-black/25 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[400px] max-h-[85vh] overflow-auto shadow-2xl border border-[var(--border)]">
            <div className="px-6 py-5 border-b border-[var(--border-light)] flex justify-between">
              <div>
                <div className="text-[10px] font-medium text-[var(--text-tertiary)] tracking-[0.08em]">RESERVATION</div>
                <div className="text-[17px] font-semibold text-[var(--text)] mt-1">{selected.id} · {zones.find((z) => z.id === selected.zone_id)?.name}</div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 border border-[var(--border)] bg-transparent cursor-pointer text-[var(--text-secondary)] flex items-center justify-center">×</button>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-[var(--text)] mb-3">이용 시간</div>
              <div className="flex flex-col gap-1.5 mb-5">
                {TIME_OPTIONS.map((opt, i) => {
                  const price = (zones.find((z) => z.id === selected.zone_id)?.price_per_hour || 0) * opt.hours;
                  return (
                    <button key={i} onClick={() => setTimeIdx(i)} className="px-4 py-3 flex justify-between cursor-pointer"
                      style={{ border: timeIdx === i ? "2px solid var(--text)" : "1px solid var(--border)", background: timeIdx === i ? "#F5F5F4" : "white" }}>
                      <span className="text-[13px]" style={{ fontWeight: timeIdx === i ? 600 : 400 }}>{opt.label}</span>
                      <span className="font-mono text-[13px] font-semibold" style={{ color: timeIdx === i ? "var(--text)" : "var(--text-secondary)" }}>₩{price.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={handleConfirm} disabled={timeIdx === null} className="w-full py-3.5 border-none text-sm font-semibold cursor-pointer"
                style={{ background: timeIdx !== null ? "var(--text)" : "var(--border-light)", color: timeIdx !== null ? "white" : "var(--text-tertiary)" }}>
                {timeIdx !== null ? `₩${((zones.find((z) => z.id === selected.zone_id)?.price_per_hour || 0) * TIME_OPTIONS[timeIdx].hours).toLocaleString()} 예약하기` : "시간을 선택하세요"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[var(--text)] text-white px-6 py-4 shadow-xl z-[300] flex items-center gap-3" style={{ animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#2D9F6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-[13px] font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}

