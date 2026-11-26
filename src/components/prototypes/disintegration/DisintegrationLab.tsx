"use client";

// Test bench for the disintegrating symbol: play it, scrub through it, and tune it live — without
// touching the code. The controls only ever change inputs; the effect itself lives in
// src/lib/disintegration and is drawn by DisintegrationCanvas.
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { DisintegrationCanvas, type DisintegrationHandle } from "./DisintegrationCanvas";

/** Seconds the whole effect lasts at 1×. */
const DURATION = 5.5;
const DEFAULT_PARTICLES = 14000;

export function DisintegrationLab() {
  const canvas = useRef<DisintegrationHandle>(null);
  const scrubber = useRef<HTMLInputElement>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const progressId = useId();

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(1);
  // the slider moves `target`; the canvas only rebuilds once it settles on `particles`
  const [target, setTarget] = useState(DEFAULT_PARTICLES);
  const [particles, setParticles] = useState(DEFAULT_PARTICLES);
  const [built, setBuilt] = useState<number | null>(null);

  useEffect(() => {
    // The timeline does one thing: move `progress` from 0 to 1. Everything on screen is a function of
    // that number — which is what makes the effect run backwards for free, and what lets a
    // ScrollTrigger drive the very same thing later (scrub the progress instead of playing it).
    const state = { progress: 0 };
    const tl = gsap.timeline({ paused: true, onComplete: () => setPlaying(false) });
    tl.to(state, {
      progress: 1,
      duration: DURATION,
      ease: "none",
      onUpdate: () => {
        canvas.current?.setProgress(state.progress);
        // updated directly, so the panel does not re-render sixty times a second
        if (scrubber.current) scrubber.current.value = String(Math.round(state.progress * 1000));
        if (readout.current) readout.current.textContent = `${Math.round(state.progress * 100)}%`;
      },
    });
    timeline.current = tl;
    return () => {
      tl.kill();
      timeline.current = null;
    };
  }, []);

  useEffect(() => {
    timeline.current?.timeScale(speed);
  }, [speed]);

  // rebuilding the particles is the one costly step: wait for the slider to settle
  useEffect(() => {
    const timer = window.setTimeout(() => setParticles(target), 160);
    return () => window.clearTimeout(timer);
  }, [target]);

  const toggle = () => {
    const tl = timeline.current;
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
    const tl = timeline.current;
    if (!tl) return;
    tl.restart();
    setPlaying(true);
  };

  const seek = (value: number) => {
    const tl = timeline.current;
    if (!tl) return;
    tl.pause();
    setPlaying(false);
    tl.progress(value / 1000);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-black text-paper">
      <DisintegrationCanvas
        ref={canvas}
        particles={particles}
        intensity={intensity}
        onBuilt={setBuilt}
        className="absolute inset-0"
      />

      <p className="t-label absolute left-[var(--gutter)] top-6 text-white/40">Protótipo · Desintegração do símbolo</p>

      <section
        aria-label="Controlos"
        className="absolute inset-x-4 bottom-4 mx-auto max-w-4xl rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:bottom-6 sm:p-6"
      >
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

        <div className="mt-5 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-3 sm:gap-8">
          <Setting
            label="Velocidade"
            value={`${speed.toFixed(2)}×`}
            min={0.25}
            max={2}
            step={0.05}
            current={speed}
            onChange={setSpeed}
          />
          <Setting
            label="Dispersão"
            value={intensity.toFixed(2)}
            min={0.4}
            max={2}
            step={0.05}
            current={intensity}
            onChange={setIntensity}
          />
          <Setting
            label="Partículas"
            value={built === null ? "—" : built.toLocaleString("pt-PT")}
            min={4000}
            max={30000}
            step={500}
            current={target}
            onChange={setTarget}
          />
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
