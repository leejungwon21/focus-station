"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      if (!name.trim()) {
        setError("이름을 입력해주세요.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[400px] mx-auto px-6 pt-16">
      <div className="text-center mb-10">
        <div className="text-[11px] font-medium text-[var(--text-tertiary)] tracking-[0.2em] mb-3">
          {isLogin ? "SIGN IN" : "SIGN UP"}
        </div>
        <h2 className="text-2xl font-light text-[var(--text)]">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
      </div>

      <div className="bg-white border border-[var(--border)] p-8">
        {!isLogin && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-[var(--text)] mb-2 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--bg)] text-[13px] outline-none"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs font-semibold text-[var(--text)] mb-2 block">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--bg)] text-[13px] outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-semibold text-[var(--text)] mb-2 block">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자리 이상"
            className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--bg)] text-[13px] outline-none"
          />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-[var(--red-bg)] text-[var(--red)] text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 border-none bg-[var(--text)] text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
        >
          {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
        </button>

        <div className="text-center mt-5">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-xs text-[var(--text-secondary)] bg-transparent border-none cursor-pointer hover:text-[var(--text)]"
          >
            {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}
