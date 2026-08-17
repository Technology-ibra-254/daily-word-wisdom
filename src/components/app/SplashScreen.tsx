import { useEffect, useState } from "react";
import logo from "@/assets/bible-logo.asset.json";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("bibleapp:splash");
    if (seen) {
      setVisible(false);
      return;
    }
    const a = setTimeout(() => setFading(true), 1200);
    const b = setTimeout(() => {
      sessionStorage.setItem("bibleapp:splash", "1");
      setVisible(false);
    }, 1800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={logo.url}
        alt="The Bible App logo"
        width={128}
        height={128}
        className="h-32 w-32 rounded-3xl shadow-[var(--shadow-float)]"
      />
      <p className="mt-5 text-xl font-extrabold tracking-tight text-brand-foreground">
        The Bible App
      </p>
      <p className="mt-1 text-xs font-medium text-brand-foreground/70">
        Read. Listen. Grow. Earn.
      </p>
    </div>
  );
}
