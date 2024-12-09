import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "TimeTracker",
  description:
    "TimeTracker omogoča spremljanje delovnih ur, evidenco odsotnosti in izboljšanje produktivnosti z naprednimi orodji za beleženje časa.",
  keywords: "sledenje času, upravljanje dela, produktivnost, evidenca ur, odsotnosti, upravljanje zaposlenih",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
