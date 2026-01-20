"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function CheckinPage() {
  const params = useParams<{ siteId: string }>();
  const siteId = useMemo(() => String(params.siteId || ""), [params]);

  // ★ここだけ自分の物件名に合わせて編集（001～005）
  const siteNames: Record<string, string> = {
    "001": "スクエアタワー",
    "002": "宝町ビル",
    "003": "元麻布ヒルズビル",
    "004": "大森駅ビル",
    "005": "芝2丁目大門ビル",
  };

  const displayName = siteNames[siteId] ?? `物件 ${siteId}`;

  const [status, setStatus] = useState<"OK" | "NG">("OK");
  const [memo, setMemo] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("送信中...");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteId,
          status,
          memo: status === "NG" ? memo : "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(`エラー: ${data?.error ?? `HTTP ${res.status}`}`);
        return;
      }

      setMsg(
        `送信完了：${data.status === "NG" ? "異常あり" : "異常なし"}（${data.created_at}）`
      );
      setMemo("");
    } catch (e: any) {
      setMsg(`エラー: ${e?.message ?? "network error"}`);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h1>現場報告（{displayName}）</h1>

      <label style={{ display: "block", marginTop: 8 }}>
        <input
          type="radio"
          checked={status === "OK"}
          onChange={() => setStatus("OK")}
        />
        異常なし
      </label>

      <label style={{ display: "block", marginTop: 8 }}>
        <input
          type="radio"
          checked={status === "NG"}
          onChange={() => setStatus("NG")}
        />
        異常あり
      </label>

      {status === "NG" && (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="異常内容を入力"
            rows={4}
            style={{ width: "100%" }}
          />
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={submit}>送信</button>
      </div>

      <p style={{ marginTop: 12 }}>{msg}</p>
    </main>
  );
}
