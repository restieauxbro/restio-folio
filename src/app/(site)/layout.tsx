import { Header } from "@/components/site/header";
import { RevealObserver } from "@/components/fx/reveal-observer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <RevealObserver />
    </>
  );
}
