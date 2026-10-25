import "./globals.css";

export const metadata = {
  title: "သီတင်းကျွတ် ကန်တော့ဆုတောင်း",
  description: "ချစ်ခင်လေးစားရသူများအတွက် သီတင်းကျွတ် ကန်တော့ကတ် ဖန်တီးပါ။",
};

export default function RootLayout({ children }) {
  return (
    <html lang="my">
      <body>{children}</body>
    </html>
  );
}
