"use client";

// Test bench for the logo morph: play it, scrub through it, and tune it live. The controls only ever
// change inputs; the morph itself lives in src/lib/logo-morph and is drawn by LogoMorph.
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { LOGO } from "@/lib/logo-morph/logo-paths";
import { LogoMorph, type LogoMorphHandle } from "./LogoMorph";

type Destination = "header" | "centre";

/** The header's logo is 30 px high (Header.tsx); the slot below has exactly its size. */
const HEADER_LOGO_HEIGHT = 30;
const HEADER_LOGO_WIDTH = Math.round((LOGO.width / LOGO.height) * HEADER_LOGO_HEIGHT);

export function LogoMorphLab() {
  const morph = useRef<LogoMorphHandle>(null);
  const headerSlot = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLElement>(null);
  const scrubber = useRef<HTMLInputElement>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const progressId = useId();

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [distance, setDistance] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const [destination, setDestination] = useState<Destination>("header");
  // the morph plays in the space above the controls, so no part of it passes behind them
  const [panelSpace, setPanelSpace] = useState(0);

  useEffect(() => {
    const el = panel.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(() => setPanelSpace(window.innerHeight - el.getBoundingClientRect().top));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tl = morph.current?.timeline();
    if (!tl) return undefined;
    tl.eventCallback("onComplete", () => setPlaying(false));
    return () => {
      tl.eventCallback("onComplete", null);
    };
  }, []);

  useEffect(() => {
    morph.current?.timeline()?.timeScale(speed);
  }, [speed]);

  // updated directly, so the panel does not re-render sixty times a second
  const showProgress = (progress: number) => {
    if (scrubber.current) scrubber.current.value = String(Math.round(progress * 1000));
    if (readout.current) readout.current.textContent = `${Math.round(progress * 100)}%`;
  };

  const toggle = () => {
    const tl = morph.current?.timeline();
    if (!tl) return;
    if (playing) {
      tl.pause();
      setPlaying(false);
      return;
    }
    if (tl.progress() >= 1) tl.progress(0);
    tl.play();
    setPlaying(true);
  };

  const restart = () => {
    const tl = morph.current?.timeline();
    if (!tl) return;
    tl.restart();
    setPlaying(true);
  };

  const seek = (value: number) => {
    const tl = morph.current?.timeline();
    if (!tl) return;
    tl.pause();
    setPlaying(false);
    tl.progress(value / 1000);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-black text-paper">
      {/* where the logo lands: an outline of the floating header, logo slot and Menu button at their
          real sizes and places (the same classes as Header.tsx in its floating state) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 px-3 pt-3 transition-opacity duration-500 ${
          destination === "header" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="rounded-[1.5rem] border border-white/10">
          <div className="flex h-[var(--header-h)] items-center justify-between gap-6 px-[calc(var(--gutter)-0.75rem)]">
            <span ref={headerSlot} className="block" style={{ width: HEADER_LOGO_WIDTH, height: HEADER_LOGO_HEIGHT }} />
            <span className="flex h-10 items-center rounded-full border border-white/10 px-4 text-[0.8125rem] font-medium text-white/30">
              Menu
            </span>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0" style={{ bottom: panelSpace }}>
        <LogoMorph
          ref={morph}
          target={destination === "header" ? headerSlot : null}
          distance={distance}
          intensity={intensity}
          onProgress={showProgress}
        />
      </div>

      <section
        ref={panel}
        aria-label="Controlos"
        className="absolute inset-x-4 bottom-4 mx-auto max-w-4xl rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:bottom-6 sm:p-6"
      >
        <p className="t-label mb-4 text-white/40">Protótipo · Logo morphing</p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-paper pl-4 pr-5 text-[0.8125rem] font-medium text-ink transition-colors duration-300 hover:bg-white"
          >
            {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            {playing ? "Pausar" : "Iniciar"}
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.8125rem] font-medium transition-colors duration-300 hover:border-white/40"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Reiniciar
          </button>

          <div className="flex min-w-48 flex-1 items-center gap-3">
            <label htmlFor={progressId} className="t-label shrink-0 text-white/55">
              Progresso
            </label>
            <input
              ref={scrubber}
              id={progressId}
              type="range"
              min={0}
              max={1000}
              defaultValue={0}
              onChange={(event) => seek(Number(event.target.value))}
              className="h-1 w-full cursor-pointer accent-orange"
            />
            <output ref={readout} htmlFor={progressId} className="w-10 text-right font-mono text-[0.75rem] tabular-nums text-white/70">
              0%
            </output>
          </div>
        </div>

        <div className="mt-5 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
          <Setting label="Velocidade" value={`${speed.toFixed(2)}×`} min={0.25} max={2} step={0.05} current={speed} onChange={setSpeed} />
          <Setting label="Distância" value={distance.toFixed(2)} min={0} max={2} step={0.05} current={distance} onChange={setDistance} />
          <Setting label="Intensidade" value={intensity.toFixed(2)} min={0} max={2} step={0.05} current={intensity} onChange={setIntensity} />
          <div className="grid gap-2.5">
            <span className="t-label text-white/55">Destino</span>
            <div className="flex gap-1.5">
              {(
                [
                  ["header", "Header"],
                  ["centre", "Centro"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={destination === value}
                  onClick={() => setDestination(value)}
                  className={`h-8 flex-1 rounded-full border text-[0.75rem] font-medium transition-colors duration-300 ${
                    destination === value ? "border-paper bg-paper text-ink" : "border-white/15 hover:border-white/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Setting({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="grid gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="t-label text-white/55">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[0.75rem] tabular-nums text-paper">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 w-full cursor-pointer accent-orange"
      />
    </div>
  );
}
