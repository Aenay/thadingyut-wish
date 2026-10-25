import "./globals.css";

export const metadata = {
  title: "သီတင်းကျွတ် မေတ္တာကန်တော့ကတ် • မိဘဆရာ ဂါရဝပြုလွှာ",
  description: "မွေးသမိခင်၊ မွေးသဖခင် ကျေးဇူးရှင် မိဘနှစ်ပါးတို့အား ကာယကံ၊ ဝစီကံ၊ မနောကံ သုံးပါးသော ကံတို့ဖြင့် ရိုသေစွာ ဦးချကန်တော့အပ်ပါသည်။",
  openGraph: {
    title: "သီတင်းကျွတ် မေတ္တာကန်တော့ကတ် • ဦးချကန်တော့လွှာ",
    description: "မိဘများထံ ရိုသေစွာ ပို့သသော ၃ ကြိမ် ဦးချကန်တော့ခြင်း အခမ်းအနားနှင့် သီတင်းကျွတ် မေတ္တာကတ်လေးကို ဖွင့်ကြည့်ပါခင်ဗျာ/ရှင်။",
    type: "website",
    locale: "my_MM",
  },
  twitter: {
    card: "summary_large_image",
    title: "သီတင်းကျွတ် မေတ္တာကန်တော့ကတ်",
    description: "မိဘများထံ ရိုသေစွာ ပို့သသော သီတင်းကျွတ် မေတ္တာကန်တော့လွှာလေးကို ဖွင့်ကြည့်ပါ",
  },
};

export const viewport = {
  themeColor: "#1b0910",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="my">
      <body>{children}</body>
    </html>
  );
}
