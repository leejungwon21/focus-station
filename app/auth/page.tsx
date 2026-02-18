import Link from "next/link";

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  open: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80",
  focus: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  premium: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
  meeting: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800&q=80",
};

const ZONES = [
  { id: "open", name: "오픈석", icon: "○", price: 1500, desc: "자유로운 분위기의 개방형 좌석" },
  { id: "focus", name: "집중석", icon: "◎", price: 2000, desc: "파티션 1인 집중 좌석" },
  { id: "premium", name: "프리미엄", icon: "◈", price: 3000, desc: "넓은 책상 + 모니터 제공" },
  { id: "meeting", name: "미팅룸", icon: "▣", price: 5000, desc: "4인 그룹 스터디룸" },
];

export default function HomePage() {
  return (
    <div className="-mt-[106px]">
      <section className="relative w-full h-[92vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${PHOTOS.hero})`, filter: "brightness(0.4)" }} />
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
          <div className="text-center px-4">
            <div className="text-[11px] font-normal text-white/40 tracking-[0.3em] mb-5">STUDY CAFE & WORKSPACE</div>
            <h1 className="text-[36px] md:text-[56px] font-extralight text-white tracking-[0.18em] leading-tight">FOCUS STATION</h1>
            <p className="text-[14px] md:text-[15px] font-light text-white/50 mt-4 tracking-[0.1em]">당신의 집중을 위한 공간</p>
            <div className="flex gap-4 justify-center mt-11">
              <Link href="/seats" className="px-8 md:px-10 py-3.5 border border-white/80 text-white text-[13px] font-medium tracking-[0.08em] no-underline hover:bg-white hover:text-[var(--text)] transition-all">좌석 예약</Link>
              <Link href="/timer" className="px-8 md:px-10 py-3.5 border border-white/30 text-white/60 text-[13px] font-normal tracking-[0.08em] no-underline hover:border-white/70 hover:text-white transition-all">공부 타이머</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1000px] mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="text-[11px] font-medium text-[var(--text-tertiary)] tracking-[0.2em] mb-4">ABOUT THE SPACE</div>
        <h2 className="text-[22px] md:text-[28px] font-light text-[var(--text)] mb-5 leading-relaxed">조용하고 쾌적한 환경에서<br />온전히 나에게 집중하는 시간</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-8 max-w-[520px] mx-auto">Focus Station은 개인의 집중력과 생산성을 극대화할 수 있도록 설계된 프리미엄 스터디 공간입니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mt-16 mb-0.5">
          {[
            { photo: PHOTOS.open, zone: "오픈석", desc: "넓은 통유리창 앞 자유로운 좌석", tag: "OPEN SEATS" },
            { photo: PHOTOS.focus, zone: "집중석", desc: "파티션으로 분리된 1인 집중 공간", tag: "FOCUS ZONE" },
          ].map((item, i) => (
            <Link href="/seats" key={i} className="relative overflow-hidden aspect-[4/3] group block">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${item.photo})` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              <div className="absolute bottom-6 left-7 z-10">
                <div className="text-[10px] font-medium text-white/50 tracking-[0.15em] mb-1.5">{item.tag}</div>
                <div className="text-[18px] font-semibold text-white mb-1">{item.zone}</div>
                <div className="text-xs font-light text-white/65">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {[
            { photo: PHOTOS.premium, zone: "프리미엄석", desc: "넓은 책상과 모니터가 제공되는 프리미엄 좌석", tag: "PREMIUM" },
            { photo: PHOTOS.meeting, zone: "미팅룸", desc: "4인 그룹 스터디를 위한 독립 공간", tag: "MEETING ROOM" },
          ].map((item, i) => (
            <Link href="/seats" key={i} className="relative overflow-hidden aspect-[4/3] group block">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${item.photo})` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              <div className="absolute bottom-6 left-7 z-10">
                <div className="text-[10px] font-medium text-white/50 tracking-[0.15em] mb-1.5">{item.tag}</div>
                <div className="text-[18px] font-semibold text-white mb-1">{item.zone}</div>
                <div className="text-xs font-light text-white/65">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 bg-[var(--border)] border border-[var(--border)]">
          {[
            { num: "01", title: "자연광 설계", desc: "넓은 통유리창으로 자연광이 가득한 쾌적한 환경" },
            { num: "02", title: "프리미엄 가구", desc: "인체공학적 의자와 높낮이 조절 가능한 전동 데스크" },
            { num: "03", title: "완벽한 방음", desc: "집중석과 미팅룸의 독립적인 방음 시스템" },
            { num: "04", title: "무제한 음료", desc: "원두커피, 차, 음료를 자유롭게 이용 가능" },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 md:p-8 text-left">
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] mb-3.5">{f.num}</div>
              <div className="text-[13px] font-semibold text-[var(--text)] mb-1.5">{f.title}</div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[960px] mx-auto px-4 md:px-8 pb-20">
        <div className="text-center mb-12">
          <div className="text-[11px] font-medium text-[var(--text-tertiary)] tracking-[0.2em] mb-4">PRICING</div>
          <h2 className="text-[26px] font-light text-[var(--text)]">이용 요금</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)]">
          {ZONES.map((z) => (
            <div key={z.id} className="bg-white p-6 md:p-9 flex flex-col">
              <div className="font-mono text-base text-[var(--text-tertiary)] mb-5">{z.icon}</div>
              <div className="text-sm font-semibold text-[var(--text)] mb-1">{z.name}</div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">{z.desc}</div>
              <div>
                <span className="font-mono text-lg md:text-xl font-bold text-[var(--text)]">₩{z.price.toLocaleString()}</span>
                <span className="text-[11px] text-[var(--text-tertiary)] ml-1">/시간</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
