/**
 * Cross-platform helper for Thadingyut Wish Card sharing.
 * Guaranteed to work smoothly across iOS (Safari, Chrome, WebViews),
 * Android (Chrome, Samsung Internet, WebViews), and Desktop browsers.
 */

/**
 * Encodes card data into a URL-safe compact base64 string.
 * Uses TextEncoder for 100% accurate Burmese Unicode & emoji handling.
 */
export function encodeCardPayload(payload) {
  try {
    const json = JSON.stringify({
      r: (payload.recipient || "").trim(),
      s: (payload.sender || "").trim(),
      m: (payload.message || "").trim(),
      t: Date.now(),
    });
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (err) {
    console.error("Payload encoding error:", err);
    return null;
  }
}

/**
 * Decodes compact URL-safe base64 string back into card data.
 * Safe for all Myanmar Unicode characters and emojis.
 */
export function decodeCardPayload(str) {
  if (!str) return null;
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder("utf-8").decode(bytes);
    const data = JSON.parse(json);
    if (!data.r && !data.m) return null;
    return {
      recipient: data.r || "",
      sender: data.s || "",
      message: data.m || "",
      createdAt: data.t || null,
    };
  } catch (err) {
    console.warn("Payload decoding failed:", err);
    return null;
  }
}

/**
 * Bulletproof clipboard copy function supporting iOS Safari, Android, and WebViews.
 */
export async function copyToClipboard(text) {
  if (!text) return false;

  // Try modern Clipboard API first
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback for iOS Safari, older Android & non-secure/in-app contexts
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    // If all else fails, prompt user
    try {
      window.prompt("ဒီလင့်ခ်ကို ကူးယူပါ -", text);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Build social messaging app share links.
 */
export function getSocialShareLinks(shareUrl, recipient = "မိဘများ", sender = "သား/သမီး") {
  const cleanUrl = shareUrl || "";
  const title = `သီတင်းကျွတ် မေတ္တာကန်တော့လွှာ`;
  const shareMessage = `✦ ${recipient} ထံသို့ ${sender} မှ ရိုသေစွာ ပို့သသော သီတင်းကျွတ် ကန်တော့လွှာလေးပါ။\nအောက်ပါလင့်ခ်ကို နှိပ်၍ ကန်တော့လွှာ ဖွင့်ကြည့်ပါ -\n${cleanUrl}`;

  const encodedMsg = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(cleanUrl);
  const encodedTitle = encodeURIComponent(`${title} (${recipient})`);

  return {
    // Native share data
    native: {
      title: `${title} (${recipient})`,
      text: `${recipient} ထံသို့ ${sender} မှ ရိုသေစွာ ပို့သသော သီတင်းကျွတ် ကန်တော့လွှာလေးပါ။ အောက်ပါလင့်ခ်ကို နှိပ်၍ ကန်တော့လွှာ ဖွင့်ကြည့်ပါ -`,
      url: cleanUrl,
    },
    // Viber (Popular in Myanmar)
    viber: `viber://forward?text=${encodedMsg}`,
    // Telegram
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`${recipient} ထံသို့ ${sender} မှ ရိုသေစွာ ပို့သသော သီတင်းကျွတ် ကန်တော့လွှာ`)}`,
    // WhatsApp
    whatsapp: `https://api.whatsapp.com/send?text=${encodedMsg}`,
    // Facebook
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    // SMS (Works universally on iOS Messages and Android Messages)
    sms: `sms:?&body=${encodedMsg}`,
  };
}
