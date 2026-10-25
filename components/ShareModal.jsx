"use client";

import { useState } from "react";
import Link from "next/link";
import { copyToClipboard, getSocialShareLinks } from "../lib/shareHelper";

export default function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  recipient,
  sender,
  onPreviewCard,
}) {
  const [copied, setCopied] = useState(false);
  const [nativeShareError, setNativeShareError] = useState("");

  if (!isOpen) return null;

  const links = getSocialShareLinks(shareUrl, recipient, sender);

  async function handleCopy() {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(links.native);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Share failed:", err);
          handleCopy();
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      handleCopy();
    }
  }

  return (
    <div className="share-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="share-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="ပိတ်ရန်"
        >
          ✕
        </button>

        {/* Celebratory Header */}
        <div className="modal-header">
          <div className="modal-badge-icon">🪔</div>
          <p className="modal-eyebrow">✦ သီတင်းကျွတ် မင်္ဂလာ ✦</p>
          <h2 className="modal-title">ကန်တော့ကတ် အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ!</h2>
          <p className="modal-desc">
            ဖေဖေ၊ မေမေတို့ထံ ပေးပို့ရန် ကန်တော့လွှာ လင့်ခ် အသင့်ဖြစ်ပါပြီ။
            အောက်ပါ နည်းလမ်းများဖြင့် အလွယ်တကူ ပေးပို့နိုင်ပါသည်။
          </p>
        </div>

        {/* Recipient & Sender Preview Badge */}
        <div className="card-summary-strip">
          <div className="summary-item">
            <span className="summary-label">ကန်တော့ခံမည့်သူ:</span>
            <span className="summary-value highlight-gold">{recipient || "မိဘများ"}</span>
          </div>
          <div className="summary-divider">✦</div>
          <div className="summary-item">
            <span className="summary-label">ကန်တော့သူ:</span>
            <span className="summary-value">{sender || "သား/သမီး"}</span>
          </div>
        </div>

        {/* Share Link Box with One-Click Copy */}
        <div className="link-share-box">
          <label htmlFor="share-link-input" className="share-box-label">
            မိဘများထံ ပေးပို့ရမည့် လင့်ခ်:
          </label>
          <div className="link-input-group">
            <input
              id="share-link-input"
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => e.target.select()}
              className="share-link-input"
            />
            <button
              type="button"
              className={`copy-link-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              <span>{copied ? "✓" : "🔗"}</span>
              <span>{copied ? "ကူးပြီးပါပြီ!" : "လင့်ခ် ကူးမည်"}</span>
            </button>
          </div>
          {copied && (
            <p className="copied-toast-hint" role="status">
              ✓ လင့်ခ်ကို ကူးယူပြီးပါပြီ။ ဖေဖေ၊ မေမေတို့ထံ တိုက်ရိုက် Paste လုပ်၍ ပေးပို့နိုင်ပါပြီ။
            </p>
          )}
        </div>

        {/* Primary Action: Native Share Sheet (iOS / Android) */}
        <div className="primary-share-section">
          <button
            type="button"
            className="native-share-btn"
            onClick={handleNativeShare}
          >
            <span className="btn-icon">📲</span>
            <span className="btn-text">မိဘများထံ တိုက်ရိုက် ပေးပို့မည် (Share)</span>
            <span className="btn-tag">iOS • Android</span>
          </button>
          <p className="share-note-sub">
            ဖုန်း၏ Share Menu ပွင့်လာပြီး Viber, Messenger, Telegram, Messages တို့ဖြင့် တိုက်ရိုက် ပို့နိုင်ပါမည်
          </p>
        </div>

        {/* Direct Social / Messaging Quick Send Strip */}
        <div className="direct-apps-section">
          <p className="direct-apps-label">သို့မဟုတ် အက်ပ်များမှ တိုက်ရိုက် ရွေးချယ်ပို့ရန်:</p>
          <div className="app-buttons-grid">
            {/* Viber */}
            <a
              href={links.viber}
              className="app-pill viber-pill"
              target="_blank"
              rel="noopener noreferrer"
              title="Viber ဖြင့် ပို့မည်"
            >
              <span className="app-icon">💜</span>
              <span className="app-name">Viber</span>
            </a>

            {/* Telegram */}
            <a
              href={links.telegram}
              className="app-pill telegram-pill"
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram ဖြင့် ပို့မည်"
            >
              <span className="app-icon">💙</span>
              <span className="app-name">Telegram</span>
            </a>

            {/* WhatsApp */}
            <a
              href={links.whatsapp}
              className="app-pill whatsapp-pill"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp ဖြင့် ပို့မည်"
            >
              <span className="app-icon">💚</span>
              <span className="app-name">WhatsApp</span>
            </a>

            {/* SMS / Messages */}
            <a
              href={links.sms}
              className="app-pill sms-pill"
              title="SMS စာတိုဖြင့် ပို့မည်"
            >
              <span className="app-icon">💬</span>
              <span className="app-name">SMS စာတို</span>
            </a>
          </div>
        </div>

        {/* Parent Experience Preview Note */}
        <div className="experience-tip-box">
          <span className="tip-icon">🪷</span>
          <p>
            <strong>မိဘများ ဘာမြင်တွေ့ရမလဲ?</strong>
            <br />
            မိဘများ လင့်ခ်ကို နှိပ်လိုက်သည်နှင့် <strong>၃ ကြိမ် ဦးချကန်တော့ခြင်း အခမ်းအနား</strong>၊
            ဆီမီးရောင်စဉ်များနှင့် သင့်ကန်တော့စာကို စိတ်လှုပ်ရှားကြည်နူးဖွယ် ဖွင့်ဖတ်ရမည်ဖြစ်ပြီး
            မေတ္တာဆုလည်း ပြန်လည်ပေးနိုင်ပါမည်။
          </p>
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer-actions">
          {onPreviewCard && (
            <button
              type="button"
              className="preview-card-btn"
              onClick={onPreviewCard}
            >
              <span>👁️</span>
              <span>မိဘများ မြင်တွေ့ရမည့်အတိုင်း ကြည့်ရှုမည်</span>
              <span>→</span>
            </button>
          )}

          <button
            type="button"
            className="secondary-close-btn"
            onClick={onClose}
          >
            ပင်မစာမျက်နှာသို့ ပြန်သွားမည်
          </button>
        </div>
      </div>
    </div>
  );
}
