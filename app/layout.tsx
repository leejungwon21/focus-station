"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const MENU = [
  { href: "/", label: "공간소개" },
  { href: "/seats", label: "좌석예약" },
  { href: "/timer", label: "공부타이머" },
];

function Toolbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-[1080px] mx-auto px-8 h-[52px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-[6px] h-[6px] rounded-full bg-[var(--text)]" />
          <span className="text-[13px] font-bold text-[var(--text)] tracking-[0.14em]">FOCUS STATION</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {user.user_metadata?.name || user.email}
              </span>
              <button onClick={handleLogout} className="text-[11px] text-[var(--text-tertiary)] bg-transparent border-none cursor-pointer hover:text-[var(--text)]">
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/auth" className="text-[11px] text-[var(--text-secondary)] no-underline hover:text-[var(--text)]">
              로그인
            </Link>
          )}
        </div>
      </div>
      <div className="max-w-[1080px] mx-auto px-8 border-t border-[var(--border-light)] flex justify-center">
        {MENU.map((item) => (
          <Link key={item.href} href={item.href} className="text-[12.5px] font-normal text-[var(--text-secondary)] no-underline px-7 py-3.5 hover:text-[var(--text)] transition-colors">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-[960px] mx-auto px-8 py-11 flex justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[var(--text)] tracking-[0.12em] mb-3">FOCUS STATION</div>
          <div className="text-[11px] text-[var(--text-secondary)] leading-8">서울특별시 강남구 테헤란로 123, 2F<br />02-1234-5678 · hello@focusstation.kr</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-[var(--text-secondary)] leading-8">매일 06:00 – 24:00<br />연중무휴</div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-3">© 2026 FOCUS STATION</div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Toolbar />
        <main className="pt-[106px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
