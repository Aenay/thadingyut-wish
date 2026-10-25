"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import PayingRespectCeremony from "../components/PayingRespectCeremony";

const defaultWishTemplates = [
  {
    label: "မိဘကန်တော့စာ (ရိုးရာ)",
    text: "သီတင်းကျွတ် အခါသမယမှာ မွေးသမိခင်၊ မွေးသဖခင် ကျေးဇူးရှင် မိဘနှစ်ပါးတို့အား ကာယကံ၊ ဝစီကံ၊ မနောကံ သုံးပါးသော ကံတို့ဖြင့် ပြစ်မှားမိသည်များ ရှိခဲ့သော် ရိုသေလေးမြတ်စွာဖြင့် ကန်တော့အပ်ပါသည်ခင်ဗျာ/ရှင်။ ကိုယ်စိတ်နှစ်ဖြာ ဘေးရန်ကွာ၍ အသက်ရာကျော် ရှည်ပါစေ။",
  },
  {
    label: "ကျန်းမာချမ်းသာ ဆုတောင်း",
    text: "မင်္ဂလာရှိသော သီတင်းကျွတ် အခါသမယတွင် ချစ်ခင်လေးစားရပါသော မိဘနှစ်ပါး စိတ်ချမ်းသာ ကိုယ်ကျန်းမာစွာဖြင့် လိုအင်ဆန္ဒများ ပြည့်ဝပြီး သက်ရှည်ကျန်းမာ အေးချမ်းကြပါစေကြောင်း ရိုသေစွာ ဦးချကန်တော့အပ်ပါသည်။",
  },
  {
    label: "ဆီမီးအလင်း ဆုတောင်း",
    text: "သီတင်းကျွတ် ဆီမီးရောင်စဉ်များနှင့်အတူ မိဘနှစ်ပါး စိတ်၏ချမ်းသာခြင်း၊ ကိုယ်၏ကျန်းမာခြင်းတို့နှင့် အမြဲပြည့်စုံပါစေ။ သား/သမီးတို့ ပြစ်မှားမိခဲ့သမျှကို ခွင့်လွှတ်တော်မူပါရန် အစဉ်ရိုသေစွာ ဦးချကန်တော့အပ်ပါသည်။",
  },
];

const recipientPresets = [
  "မေမေ",
  "ဖေဖေ",
  "ဖေဖေနှင့် မေမေ",
  "ဆရာ / ဆရာမ",
  "အဘိုး / အဘွား",
];

export default function HomePage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("ဖေဖေနှင့် မေမေ");
  const [sender, setSender] = useState("သား မောင်မောင်");
  const [wish, setWish] = useState(defaultWishTemplates[0].text);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState("card"); // "card" or "ceremony"

  async function createWish(event) {
    event.preventDefault();
    setError("");

    if (!recipient.trim() || !sender.trim() || !wish.trim()) {
      setError("အမည်နှစ်ခုနှင့် ဆုတောင်းစာကို ပြည့်စုံစွာ ဖြည့်ပေးပါ။");
      return;
    }
    if (
      recipient.trim().length > 80 ||
      sender.trim().length > 80 ||
      wish.trim().length > 1200
    ) {
      setError("အမည်ကို စာလုံး ၈၀ အောက်၊ ဆုတောင်းစာကို စာလုံး ၁၂၀၀ အောက်ထားပေးပါ။");
      return;
    }

    setBusy(true);

    let createdId = null;

    // Try saving to Supabase if available
    if (supabase) {
      try {
        const { data, error: insertError } = await supabase
          .from("wishes")
          .insert({
            recipient: recipient.trim(),
            sender: sender.trim(),
            message: wish.trim(),
          })
          .select("id")
          .single();

        if (!insertError && data?.id) {
          createdId = data.id;
        } else if (insertError) {
          console.warn(
            "Supabase insert notice (fallback to share URL):",
            insertError.message
          );
        }
      } catch (err) {
        console.warn("Supabase connection fallback:", err);
      }
    }

    setBusy(false);

    if (createdId) {
      router.push(`/w/${createdId}`);
    } else {
      // Robust instant fallback: encodes into share link directly so it ALWAYS works
      const params = new URLSearchParams({
        r: recipient.trim(),
        s: sender.trim(),
        m: wish.trim(),
      });
      router.push(`/w/share?${params.toString()}`);
    }
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      {/* Top Header */}
      <header className="topbar">
        <a className="brand" href="/" aria-label="ပင်မစာမျက်နှာ">
          <span className="brand-mark">✺</span>
          <span>သီတင်းကျွတ် မေတ္တာကတ်</span>
        </a>
        <span className="top-note">မိဘဘိုးဘွား • ဆရာသမား • ရိုသေကန်တော့လွှာ</span>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> မင်္ဂလာရှိသော သီတင်းကျွတ် အခါသမယ
          </p>
          <h1>
            မိဘများထံသို့<br />
            <em>ရိုသေစွာ ကန်တော့ကြမယ်</em>
          </h1>
          <p className="hero-description">
            ဖေဖေ၊ မေမေနှင့် ကျေးဇူးရှင်များထံ မေတ္တာကန်တော့လွှာလေး ရေးသားပြီး ပေးပို့လိုက်ပါ။
            မိဘများ လင့်ခ်ကို နှိပ်ဖွင့်လိုက်သည်နှင့်
            <strong> ၃ ကြိမ် ဦးချကန်တော့ခြင်း အခမ်းအနား</strong>၊
            ဆီမီးအလင်းရောင်များနှင့် ကန်တော့စာကို စိတ်လှုပ်ရှားကြည်နူးဖွယ် မြင်တွေ့ရပါမည်။
          </p>

          <div className="hero-tags">
            <span>🙏 ၃ ကြိမ် ဦးချကန်တော့မှု</span>
            <span>🪔 ဆီမီးအလင်းရောင်စဉ်</span>
            <span>🏮 မီးပုံးပျံ အလှဆင်</span>
            <span>🌸 မိဘများ ဆုပြန်ပေးနိုင်မှု</span>
          </div>
        </div>

        {/* Card Creation Form */}
        <div className="form-panel">
          <div className="panel-heading">
            <span className="panel-icon">🪔</span>
            <div>
              <h2>ကန်တော့ကတ် ဖန်တီးရန်</h2>
              <p>မိဘများထံ ပေးပို့မည့် အချက်အလက်များ ဖြည့်ပါ</p>
            </div>
          </div>

          <form onSubmit={createWish}>
            {/* Quick recipient chips */}
            <label htmlFor="recipient">ကန်တော့ခံမည့်သူ၏ အမည်</label>
            <div className="quick-chip-row">
              {recipientPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`chip-btn ${recipient === preset ? "active" : ""}`}
                  onClick={() => setRecipient(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="ဥပမာ - မေမေ၊ ဖေဖေ၊ ဖေဖေနှင့် မေမေ"
              maxLength={80}
              required
            />

            {/* Sender name */}
            <label htmlFor="sender">ကန်တော့သူ၏ အမည် (သား/သမီး အမည်)</label>
            <input
              id="sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="ဥပမာ - သား မောင်မောင် (သို့) သမီး မဝင်း"
              maxLength={80}
              required
            />

            {/* Wish Templates */}
            <label htmlFor="wish">ကန်တော့ဆုတောင်းစာ</label>
            <div className="quick-chip-row templates-row">
              {defaultWishTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`chip-btn ${wish === template.text ? "active" : ""}`}
                  onClick={() => setWish(template.text)}
                >
                  {template.label}
                </button>
              ))}
            </div>

            <textarea
              id="wish"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              rows={5}
              maxLength={1200}
              required
            />
            <div className="character-count">{wish.length} / ၁၂၀၀ စာလုံး</div>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            <button className="primary-button submit-btn" type="submit" disabled={busy}>
              {busy ? "ကန်တော့ကတ် ဖန်တီးနေသည်..." : "ကန်တော့ကတ် ဖန်တီးပြီး လင့်ခ်ယူမယ်"}
              <span>✦</span>
            </button>

            <p className="privacy-note">
              ✦ ဖန်တီးပြီးပါက ဖေဖေ၊ မေမေတို့ထံ Viber, Telegram, Messenger မှ တိုက်ရိုက် ပေးပို့နိုင်သော လင့်ခ် ရရှိပါမည် ✦
            </p>
          </form>
        </div>
      </section>

      {/* Interactive Live Preview Section */}
      <section className="preview-section">
        <div className="section-title">
          <span className="eyebrow">ကတ်ဒီဇိုင်းနှင့် ကန်တော့မှု အခမ်းအနား</span>
          <h2>မိဘများ မြင်တွေ့ရမည့် ပုံစံကြိုတင်ကြည့်ရှုရန်</h2>
          <p>
            မိဘများ လင့်ခ်ကို နှိပ်ဖွင့်ချိန်တွင် မြင်တွေ့ရမည့် ကန်တော့ခြင်း အခမ်းအနားနှင့် ကတ်ကို စမ်းသပ်ကြည့်နိုင်ပါသည်။
          </p>

          <div className="preview-toggle-row">
            <button
              type="button"
              className={`toggle-btn ${previewMode === "ceremony" ? "active" : ""}`}
              onClick={() => setPreviewMode("ceremony")}
            >
              <span>🪔</span>
              <span>ကန်တော့ခြင်း အခမ်းအနား (အဖွင့်ကြည့်ရှုရန်)</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${previewMode === "card" ? "active" : ""}`}
              onClick={() => setPreviewMode("card")}
            >
              <span>📜</span>
              <span>ကတ်ဒီဇိုင်း အပြည့်အစုံ</span>
            </button>
          </div>
        </div>

        <div className="preview-ceremony-wrap">
          <PayingRespectCeremony
            recipient={recipient || "ချစ်ခင်လေးစားရပါသော မိဘများ"}
            sender={sender || "သား/သမီး"}
            message={wish}
            initialOpened={previewMode === "card"}
            key={`${recipient}-${sender}-${previewMode}`}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-lamp">🪔</span>
        <p>သီတင်းကျွတ် အခါသမယတွင် မိဘဘိုးဘွားများ အားလုံး စိတ်ချမ်းသာ ကိုယ်ကျန်းမာပါစေ။</p>
      </footer>
    </main>
  );
}
