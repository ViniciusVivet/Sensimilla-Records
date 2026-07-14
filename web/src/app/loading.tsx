import Image from "next/image";

export default function Loading() {
  return (
    <div
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center bg-bg"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo com animacao de respirar */}
        <div className="relative h-28 w-28 animate-pulse md:h-36 md:w-36">
          <Image
            src="/logos/sensimilla-logo-white.png"
            alt="Sensimilla Records"
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(200,242,74,0.15)]"
            priority
          />
        </div>

        {/* Barra de loading sutil */}
        <div className="h-[2px] w-24 overflow-hidden rounded-full bg-fg/10">
          <div className="h-full w-full origin-left animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
