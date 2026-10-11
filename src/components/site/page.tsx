import { ViewTransition } from "react";
import { Footer } from "./footer";

/**
 * Every route renders inside <Page> so navigations animate as a directional
 * curtain. Lives in each page (not the layout) because layouts persist.
 */
export function Page({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <>
      <PageBody footer={footer}>{children}</PageBody>
      <Curtain />
    </>
  );
}

function PageBody({ children, footer }: { children: React.ReactNode; footer: boolean }) {
  return (
    <ViewTransition
      enter={{ "page-forward": "page-forward", "page-back": "page-back", "page-morph": "page-morph", default: "none" }}
      exit={{ "page-forward": "page-forward", "page-back": "page-back", "page-morph": "page-morph", default: "none" }}
      default="none"
    >
      <div className="relative">
        <main id="main">{children}</main>
        {footer && <Footer />}
      </div>
    </ViewTransition>
  );
}

/**
 * An empty fixed layer whose only job is to give the transition a curtain:
 * its "new" snapshot is painted as a signal-coloured panel that wipes
 * across the viewport while the old page leaves and the new one arrives.
 */
function Curtain() {
  return (
    <ViewTransition enter={{ "page-forward": "sweep-up", "page-back": "sweep-down", default: "none" }} exit="none" default="none">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-50" />
    </ViewTransition>
  );
}
