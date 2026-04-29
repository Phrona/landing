export function Footer() {
  return (
    <footer className="px-6 pb-12 mt-auto">
      <div className="max-w-6xl mx-auto pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="text-sm text-[rgba(255,255,255,0.4)]">
          &copy; 2026 Phrona, Inc. All rights reserved.
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-[rgba(255,255,255,0.4)]">
          <a
            href="/privacy"
            className="hover:text-[rgba(255,255,255,0.75)] transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-[rgba(255,255,255,0.75)] transition-colors"
          >
            Terms
          </a>
          <a
            href="mailto:hello@phrona.io"
            className="hover:text-[rgba(255,255,255,0.75)] transition-colors"
          >
            Contact
          </a>
          <a
            href="https://acstrategygroup.com"
            className="hover:text-[rgba(255,255,255,0.75)] transition-colors"
          >
            ACSG
          </a>
          <a
            href="https://acstrategy.substack.com"
            className="hover:text-[rgba(255,255,255,0.75)] transition-colors"
          >
            Substack
          </a>
        </nav>
      </div>
    </footer>
  );
}
