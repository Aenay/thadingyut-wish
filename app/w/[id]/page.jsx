"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import PayingRespectCeremony from "../../../components/PayingRespectCeremony";

function WishContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;

  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadWish() {
      // 1. Check if recipient & sender are passed via search params (URL share fallback)
      const paramRecipient = searchParams.get("r");
      const paramSender = searchParams.get("s");
      const paramMessage = searchParams.get("m");

      if (paramRecipient && paramSender && paramMessage) {
        if (!active) return;
        setWish({
          id: id || "share",
          recipient: paramRecipient,
          sender: paramSender,
          message: paramMessage,
        });
        setLoading(false);
        return;
      }

      // 2. Otherwise load from Supabase database by ID
      if (!supabase || !id) {
        if (!active) return;
        setError("ဒီကတ်လေးကို ရှာမတွေ့ပါ။ လင့်ခ်မှန်မမှန် ပြန်လည်စစ်ဆေးပေးပါ။");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("wishes")
          .select("id, recipient, sender, message, created_at")
          .eq("id", id)
          .maybeSingle();

        if (!active) return;

        if (fetchError) {
          if (paramRecipient) {
            setWish({
              id,
              recipient: paramRecipient,
              sender: paramSender || "သား/သမီး",
              message: paramMessage || "",
            });
          } else {
            setError("ဒီကတ်လေးကို ဖွင့်မရသေးပါ။ လင့်ခ်မှန်မမှန် စစ်ဆေးပေးပါ။");
          }
        } else if (!data) {
          setError("ဒီကန်တော့ကတ်ကို ရှာမတွေ့ပါ။ ဖျက်သိမ်းပြီးဖြစ်နိုင်ပါတယ်။");
        } else {
          setWish(data);
        }
      } catch (err) {
        console.error(err);
        if (paramRecipient) {
          setWish({
            id,
            recipient: paramRecipient,
            sender: paramSender || "သား/သမီး",
            message: paramMessage || "",
          });
        } else {
          setError("ကတ်ကို ဆွဲယူရာတွင် အခက်အခဲရှိနေပါသည်။");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadWish();
    return () => {
      active = false;
    };
  }, [id, searchParams]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <div className="status-panel">
        <span className="loading-lamp">🪔</span>
        <h1>သီတင်းကျွတ် မေတ္တာကန်တော့ကတ် ဖွင့်နေပါတယ်...</h1>
        <p>ဆီမီးအလင်းရောင်များ ထွန်းညှိနေပါသည်</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-panel">
        <span className="error-icon">🪔</span>
        <h1>ကတ်ကို ဖွင့်မရပါ</h1>
        <p>{error}</p>
        <Link className="primary-button link-button" href="/">
          ပင်မစာမျက်နှာသို့ ပြန်သွားရန်
        </Link>
      </div>
    );
  }

  return (
    <section className="public-content">
      {/* Ceremony container with unopened gate -> 3-bow homage animation -> revealed card */}
      <PayingRespectCeremony
        recipient={wish.recipient}
        sender={wish.sender}
        message={wish.message}
        shareUrl={shareUrl}
        initialOpened={false}
      />

      <div className="public-footer-action">
        <Link className="create-another-btn" href="/">
          <span>✦</span>
          <span>သင်လည်း မိဘ၊ ဆရာများအတွက် ကန်တော့ကတ် ဖန်တီးမယ်</span>
          <span>✦</span>
        </Link>
      </div>
    </section>
  );
}

export default function PublicWishPage() {
  return (
    <main className="public-page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      {/* Top Bar Navigation */}
      <header className="topbar public-topbar">
        <Link className="brand" href="/" aria-label="ပင်မစာမျက်နှာ">
          <span className="brand-mark">✺</span>
          <span>သီတင်းကျွတ် မေတ္တာကတ်</span>
        </Link>
        <Link className="back-link" href="/">
          <span>✦ ကတ်အသစ် ဖန်တီးရန်</span>
        </Link>
      </header>

      <Suspense
        fallback={
          <div className="status-panel">
            <span className="loading-lamp">🪔</span>
            <h1>ကတ်လေး ဖွင့်နေပါတယ်...</h1>
          </div>
        }
      >
        <WishContent />
      </Suspense>

      <footer className="footer">
        <span className="footer-lamp">🪔</span>
        <p>
          သီတင်းကျွတ် အခါသမယတွင် မိဘဘိုးဘွား ဆရာသမားများအားလုံး စိတ်ချမ်းသာ
          ကိုယ်ကျန်းမာစွာဖြင့် အသက်ရာကျော် ရှည်ပါစေ။
        </p>
      </footer>
    </main>
  );
}
