interface VersionMarkProps {
  version: string;
}

const VersionMark = ({ version }: VersionMarkProps) => {
  return (
    <div className="pointer-events-none fixed bottom-2 right-2 z-50 hidden font-mono text-[10px] font-semibold tracking-[0.18em] text-ink-300 sm:block sm:bottom-3 sm:right-3 sm:text-[11px]">
      v {version}
    </div>
  );
};

export default VersionMark;
