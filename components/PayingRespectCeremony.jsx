"use client";

import { useState, useEffect, useRef } from "react";
import GreetingCard from "./GreetingCard";

// Synthesize serene temple bell chime using Web Audio API (0 dependencies)
function playCeremonySound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const frequencies = [528, 792, 1056, 1584]; // Harmonious 528Hz Solfeggio "Love/Peace" tone
    const now = ctx.currentTime;
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq + idx * 0.7, now);

      const decay = 3.2 + idx * 0.4;
      gain.gain.setValueAtTime(0.08 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (e) {
    // Audio policies might block on some browsers
  }
}

export default function PayingRespectCeremony({
  recipient,
  sender,
  message,
  shareUrl = "",
  initialOpened = false,
  videoSrc = "/video/gemini_generated_video_7accb807.mp4",
}) {
  const [opened, setOpened] = useState(initialOpened);
  const [showBlessing, setShowBlessing] = useState(false);
  const [blessingGiven, setBlessingGiven] = useState(false);
  const [petals, setPetals] = useState([]);
  const [lanterns, setLanterns] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef(null);

  // When opened, trigger video playback and atmosphere effects
  useEffect(() => {
    if (!opened) return;

    playCeremonySound();

    // Generate floating sky lanterns
    const newLanterns = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 29 + 11) % 94}%`,
      delay: `${(i % 5) * 0.8}s`,
      duration: `${6 + (i % 4) * 1.5}s`,
      scale: 0.7 + (i % 3) * 0.25,
    }));
    setLanterns(newLanterns);

    // Auto-play the paying respect animation video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // If browser blocks unmuted autoplay, mute and play
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  }, [opened]);

  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }

  function restartVideo() {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  }

  // Handle parent giving blessing back
  function handleGiveBlessing() {
    playCeremonySound();
    setBlessingGiven(true);
    setShowBlessing(true);

    // Shower of golden petals & hearts
    const newPetals = Array.from({ length: 32 }, (_, i) => ({
      id: Date.now() + i,
      left: `${(i * 19 + 7) % 96}%`,
      delay: `${(i % 7) * 0.15}s`,
      duration: `${3.5 + (i % 3)}s`,
      char: ["🌸", "🪷", "✨", "💛", "🏮"][i % 5],
    }));
    setPetals(newPetals);

    setTimeout(() => {
      setShowBlessing(false);
    }, 9000);
  }

  // Replay the homage animation
  function replayHomage() {
    setOpened(false);
    setBlessingGiven(false);
    setShowBlessing(false);
    setTimeout(() => {
      setOpened(true);
    }, 150);
  }

  return (
    <div className="ceremony-container">
      {/* Floating lanterns in the night sky */}
      {opened && (
        <div className="sky-lanterns-layer" aria-hidden="true">
          {lanterns.map((l) => (
            <div
              key={l.id}
              className="sky-lantern"
              style={{
                left: l.left,
                animationDelay: l.delay,
                animationDuration: l.duration,
                transform: `scale(${l.scale})`,
              }}
            >
              <div className="lantern-balloon">🏮</div>
              <div className="lantern-glow" />
            </div>
          ))}
        </div>
      )}

      {/* Falling blessing petals & sparks */}
      {petals.length > 0 && (
        <div className="blessing-shower" aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              className="falling-petal"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.char}
            </span>
          ))}
        </div>
      )}

      {!opened ? (
        /* The Ceremonial Unopened Envelope / Lantern Gate */
        <div className="ceremony-gate">
          <div className="gate-card">
            <div className="gate-glow" aria-hidden="true" />
            <div className="gate-lantern-icon">🏮</div>
            <div className="gate-lamp-flame">🪔</div>

            <p className="gate-eyebrow">✦ သီတင်းကျွတ် မေတ္တာမင်္ဂလာ ✦</p>

            <h2 className="gate-title">
              <span className="recipient-highlight">{recipient || "ချစ်ခင်လေးစားရပါသော မိဘများ"}</span> ထံသို့
            </h2>

            <p className="gate-subtitle">
              <strong>{sender || "သား/သမီး"}</strong> ထံမှ ရိုသေစွာ ပေးပို့သော
              <br />
              သီတင်းကျွတ် မေတ္တာကန်တော့လွှာလေး ရောက်ရှိလာပါပြီ
            </p>

            <div className="gate-ornament">❧ ❋ ❧</div>

            <button
              type="button"
              className="gate-open-button"
              onClick={() => setOpened(true)}
              autoFocus
            >
              <span className="button-icon">🪔</span>
              <span className="button-text">ကန်တော့လွှာ ဖွင့်ကြည့်ရန် နှိပ်ပါ</span>
              <span className="button-sparkle">✦</span>
            </button>

            <p className="gate-hint">နှိပ်လိုက်ပါက ဆီမီးရောင်စဉ်၊ ကန်တော့ခြင်း ရုပ်ရှင်ဗီဒီယိုနှင့် ဆုတောင်းစာကို မြင်တွေ့ရပါမည်</p>
          </div>
        </div>
      ) : (
        /* The Opened Homage Experience with User's Animation Video */
        <div className="opened-experience">
          {/* Custom Animation Video Section */}
          <div className="homage-video-card">
            <div className="homage-video-header">
              <span>🪔</span>
              <span>သီတင်းကျွတ် ဂါရဝပြု ရိုသေစွာ ကန်တော့ခြင်း အခမ်းအနား</span>
              <span>🪔</span>
            </div>

            <div className="homage-video-wrapper">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                playsInline
                loop
                className="homage-video"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="video-overlay-glow" aria-hidden="true" />
            </div>

            <div className="video-caption-bar">
              <p className="video-dedication">
                <span className="dedication-sparkle">✦</span>
                <strong>{recipient || "မိဘများ"}</strong> အား <strong>{sender || "သား/သမီး"}</strong> မှ ရိုသေစွာ ဦးချကန်တော့ပါသည်
              </p>

              <div className="video-control-buttons">
                <button
                  type="button"
                  className="vid-btn"
                  onClick={togglePlay}
                  title={isPlaying ? "ခေတ္တရပ်မည်" : "ပြန်ဖွင့်မည်"}
                >
                  <span>{isPlaying ? "⏸ ရပ်မည်" : "▶ ဖွင့်မည်"}</span>
                </button>
                <button
                  type="button"
                  className="vid-btn"
                  onClick={toggleMute}
                  title={isMuted ? "အသံဖွင့်မည်" : "အသံပိတ်မည်"}
                >
                  <span>{isMuted ? "🔇 အသံပိတ်ထားသည်" : "🔊 အသံဖွင့်ထားသည်"}</span>
                </button>
                <button
                  type="button"
                  className="vid-btn"
                  onClick={restartVideo}
                  title="အစမှ ပြန်ဖွင့်မည်"
                >
                  <span>🔄 အစမှပြန်ဖွင့်</span>
                </button>
              </div>
            </div>
          </div>

          {/* The Detailed Greeting Card */}
          <GreetingCard
            recipient={recipient}
            sender={sender}
            message={message}
            shareUrl={shareUrl}
          />

          {/* Parents' Blessing Interaction Section */}
          <div className="parents-blessing-section">
            <div className="blessing-card">
              <div className="blessing-header">
                <span className="blessing-lotus">🪷</span>
                <div>
                  <h4>မိဘများ / ကန်တော့ခံရသူများ မေတ္တာဆုပြန်ပေးရန်</h4>
                  <p>သားသမီးတို့အတွက် မေတ္တာဆုမွန်ကောင်း ပြန်လည်ပို့သပေးနိုင်ပါတယ်</p>
                </div>
              </div>

              <div className="blessing-actions">
                <button
                  type="button"
                  className="blessing-btn"
                  onClick={handleGiveBlessing}
                >
                  <span>🌸</span>
                  <span>ဆုမွန်ကောင်း ပေးမည်</span>
                  <span>✨</span>
                </button>

                <button
                  type="button"
                  className="replay-homage-btn"
                  onClick={replayHomage}
                  title="ကန်တော့ခြင်း အခမ်းအနားကို ပြန်လည်ကြည့်ရှုရန်"
                >
                  <span>🔄</span>
                  <span>အခမ်းအနား ပြန်ကြည့်မယ်</span>
                </button>
              </div>

              {/* Toast when blessing is given */}
              {showBlessing && (
                <div className="blessing-toast animate-blessing" role="alert">
                  <div className="toast-sparkle">✨ 🪷 ✨</div>
                  <h5>မေတ္တာဆုမွန် ရောက်ရှိပါပြီ</h5>
                  <p>
                    "ချစ်လှစွာသော သားသမီးတို့ ကိုယ်စိတ်နှစ်ဖြာ ဘေးရန်ကွာ၍
                    သက်ရှည်ကျန်းမာ အေးချမ်းကြပါစေ၊ လိုအင်ဆန္ဒ မှန်သမျှ ပြည့်ဝကြပါစေ... သာဓု သာဓု သာဓု 🙏"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
