/* eslint-disable @typescript-eslint/naming-convention */
const Alert = ({ type, text }: { type: string; text: string }) => {
  const isDanger = type === "danger";

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-20 z-[60] flex items-center justify-center px-4">
      <div
        className="pointer-events-auto inline-flex max-w-[calc(100vw-2rem)] items-stretch border text-paper-0"
        role="alert"
        style={{
          background: isDanger ? "var(--accent)" : "var(--ink-900)",
          borderColor: isDanger ? "var(--accent)" : "var(--ink-900)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p
          className="t-mono grid place-items-center px-3 py-2 text-[10px] font-bold uppercase leading-none text-paper-0 sm:px-4"
          style={{
            background: isDanger
              ? "color-mix(in srgb, var(--accent) 72%, #000)"
              : "var(--ink-700)",
            letterSpacing: "0.18em",
          }}
        >
          {isDanger ? "FAILED" : "SENT"}
        </p>
        <p className="t-display-italic px-4 py-2 text-left text-[15px] leading-snug text-paper-0 sm:px-5">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Alert;
