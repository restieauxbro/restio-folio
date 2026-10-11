import { ViewTransition } from "react";
import { Footer } from "./footer";

/**
 * Every route renders inside <Page> so navigations animate as a directional
 * curtain. Lives in each page (not the layout) because layouts persist.
 */
export function Page({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <ViewTransition
      enter={{ "page-forward": "page-forward", "page-back": "page-back", default: "none" }}
      exit={{ "page-forward": "page-forward", "page-back": "page-back", default: "none" }}
      default="none"
    >
      <div className="relative">
        <main id="main">{children}</main>
        {footer && <Footer />}
      </div>
    </ViewTransition>
  );
}
