"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

const particles = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  delay: `${(i % 8) * -0.7}s`,
  duration: `${5 + (i % 6)}s`,
  size: `${3 + (i % 4)}px`,
}));

export default function GreetingCard({
  recipient,
  sender,
  message,
  shareUrl = "",
}) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function downloadCard() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#210d13",
      });
      const link = document.createElement("a");
      link.download = `thadingyut-kan-taw-${(recipient || "card")
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert("ပုံသိမ်းမရသေးပါ။ ထပ်မံကြိုးစားပေးပါ။");
    } finally {
      setDownloading(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      window.prompt("ဒီလင့်ခ်ကို ကူးယူပါ", shareUrl);
    }
  }

  async function shareLink() {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "သီတင်းကျွတ် မေတ္တာကန်တော့ကတ်",
          text: `${recipient || "မိဘများ"} သို့ ${sender || "သား/သမီး"} မှ ရိုသေစွာ ပို့သသော သီတင်းကျွတ် ကန်တော့လွှာလေးပါ။`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      await copyLink();
    }
  }

  const shareText = encodeURIComponent(
    `${recipient || "မိဘများ"} သို့ ${sender || "သား/သမီး"} မှ ပို့သသော သီတင်းကျွတ် ကန်တော့လွှာလေးပါ။\n${shareUrl}`
  );

  return (
    <div className="card-wrap">
      <div className="festival-card" ref={cardRef}>
        <div className="card-ornament ornament-top">❧ ✦ ❧</div>
        <div className="card-corner corner-tl">❋</div>
        <div className="card-corner corner-tr">❋</div>
        <div className="card-corner corner-bl">❋</div>
        <div className="card-corner corner-br">❋</div>

        <div className="particles" aria-hidden="true">
          {particles.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
              }}
            />
          ))}
        </div>

        <div className="balloon balloon-a" aria-hidden="true">
          🏮
        </div>
        <div className="balloon balloon-b" aria-hidden="true">
          🏮
        </div>
        <div className="lantern lantern-a" aria-hidden="true">
          🪔
        </div>
        <div className="lantern lantern-b" aria-hidden="true">
          🪔
        </div>

        <div className="candle-row" aria-hidden="true">
          <span className="candle candle-left">
            <i />
          </span>
          <span className="candle candle-right">
            <i />
          </span>
        </div>

        <div className="card-content">
          <div className="card-emblem">✺</div>
          <p className="card-kicker">မင်္ဂလာရှိသော သီတင်းကျွတ် အခါသမယ</p>
          <h2>
            ရိုသေမြတ်နိုး<br />
            <span>ဦးချကန်တော့လွှာ</span>
          </h2>

          <div className="gold-divider">
            <span>🪷</span>
          </div>

          <div className="homage-badge">
            <span className="homage-badge-icon">🙏</span>
            <span>ကာယကံ • ဝစီကံ • မနောကံ</span>
          </div>

          <p className="recipient-line">အစဉ်လေးစားချစ်ခင်ရပါသော</p>
          <h3 className="recipient-name">{recipient || "ချစ်ခင်လေးစားရပါသော မိဘများ"}</h3>

          <div className="card-message-box">
            <p className="card-message">{message}</p>
          </div>

          <div className="respect-symbol-row">
            <span className="respect-sparkle">✦</span>
            <div className="respect-symbol">🙏</div>
            <span className="respect-sparkle">✦</span>
          </div>

          <p className="sender-line">အစဉ်ရိုသေလေးစားစွာ ကန်တော့အပ်ပါသည်</p>
          <p className="sender-name">{sender || "သင်၏ သား/သမီး"}</p>

          <div className="card-ornament ornament-bottom">❧ ✦ ❧</div>
        </div>

        <div className="card-glow" aria-hidden="true" />
      </div>

      {/* Card Action Controls */}
      <div className="card-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={downloadCard}
          disabled={downloading}
        >
          <span>📸</span>
          <span>{downloading ? "ပုံထုတ်ယူနေသည်..." : "ပုံအဖြစ် သိမ်းမယ် ↓"}</span>
        </button>

        {shareUrl && (
          <>
            <button
              type="button"
              className="primary-button share-button"
              onClick={shareLink}
            >
              <span>↗</span>
              <span>{copied ? "လင့်ခ် ကူးပြီးပါပြီ ✓" : "ကတ်လင့်ခ် မျှဝေမယ်"}</span>
            </button>

            <button
              type="button"
              className="text-button copy-btn"
              onClick={copyLink}
            >
              <span>🔗</span>
              <span>{copied ? "ကူးပြီးပါပြီ ✓" : "လင့်ခ် ကူးယူရန်"}</span>
            </button>
          </>
        )}
      </div>

      {/* Quick Messaging Apps Share Bar when shareUrl exists */}
      {shareUrl && (
        <div className="social-share-strip">
          <span className="share-strip-label">တိုက်ရိုက် ပို့မည်:</span>
          <a
            href={`viber://forward?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-pill viber"
            title="Viber ဖြင့် ပို့မည်"
          >
            Viber
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(
              `${recipient || "မိဘများ"} သို့ သီတင်းကျွတ် ကန်တော့လွှာ`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-pill telegram"
            title="Telegram ဖြင့် ပို့မည်"
          >
            Telegram
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-pill whatsapp"
            title="WhatsApp ဖြင့် ပို့မည်"
          >
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
