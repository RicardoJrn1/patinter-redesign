"use client";

// Patrocínios (/sustentabilidade/patrocinios): the whole page under the header — the menu's place, the
// official H1 and text, the link to the sponsorship policy and the official sponsorship request form
// (content/patrocinios.ts). The official page has no photograph, so there is no opening band: from lg,
// two columns from the top — the label, the title and the text on the left, held in view while the form
// scrolls by (CSS sticky: right under the island if the column fits the screen; otherwise it scrolls
// with the page until its last line is in view, and holds there); the form on the right,
// in an outlined frame (the About page's ledger), its groups as fieldsets under the site's small labels.
// Phones: one column. The label, title and lead come in with the inner pages' CSS entrance.
//
// The form is not connected to anything yet (the user's decision): it behaves like the real one — every
// official field is required, the browser checks them, and once a submission has been tried the missing
// ones are outlined in red-deep — but a complete request is not sent: it is answered, in a live region,
// with the demonstration notice. Nothing leaves the page.
//
// With motion, the text and each group fade up as they scroll into view (and back out, scrolling up).
// Reduced motion and no JS: all simply there (without JS the browser still checks the fields, and the
// form, having no action, would only reload the page).
import { ArrowUpRight, Paperclip } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { OpeningHead } from "@/components/sections/page/PageOpening";
import { RollText } from "@/components/ui/RollText";
import { sponsorshipCopy } from "@/content/locales/sponsorship";
import type { SponsorshipField } from "@/content/patrocinios";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION, REDUCED } from "@/lib/motion-queries";


/** What the browser may fill in for each field (not copy: the HTML autocomplete tokens). */
const AUTOCOMPLETE: Record<string, string> = {
  "entidade-nome": "organization",
  "contacto-nome": "name",
  "contacto-telefone": "tel",
  "contacto-email": "email",
  "contacto-morada": "street-address",
  "contacto-localidade": "address-level2",
  "contacto-codigo-postal": "postal-code",
};

// a field's box: the header search's language (light fill, hairline, ink on focus); outlined in
// red-deep, once a submission has been tried, while it is still invalid
const FIELD =
  "w-full rounded-xl border border-line bg-paper/60 px-4 text-[0.9375rem] tracking-[-0.01em] text-ink transition-colors duration-300 placeholder:text-muted hover:border-line-strong focus:border-ink focus:outline-none group-data-[tried]/form:invalid:border-red-deep";

export function SponsorshipSection({ locale }: { locale: Locale }) {
  const { sponsorshipForm, sponsorshipIntro, sponsorshipOpening, sponsorshipPlace } = sponsorshipCopy[locale];
  /** Said after an external link's text, for screen readers (as in News.tsx). */
  const NEW_TAB = ui[locale].newTab;
  const root = useRef<HTMLElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const formId = useId();
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [fileName, setFileName] = useState("");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // both conditions: a conditions object only runs its function while one of them matches
      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
        if ((ctx.conditions as Record<string, boolean>).reduced) return undefined;
        const items = q("[data-reveal]");
        // each item triggered by its own box (its own position never changes: only its opacity and y)
        items.forEach((item) =>
          gsap.fromTo(
            item,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 92%", toggleActions: "play none none reverse" } }
          )
        );
        return () => gsap.set(items, { clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  // The text column's height, for its sticky `top` (below): a column taller than the screen holds once
  // its last line is in view, not under the island with its end out of reach. Kept current as fonts
  // load and the window is resized.
  useEffect(() => {
    const el = column.current;
    if (!el) return undefined;
    const measure = () => el.style.setProperty("--col-h", `${el.offsetHeight}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, []);

  // reached only when the browser finds every required field filled in: nothing is sent
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const field = (f: SponsorshipField) => {
    const id = `${formId}-${f.name}`;
    const common = { id, name: f.name, required: true, autoComplete: AUTOCOMPLETE[f.name] ?? "off" };
    return (
      <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
        <label htmlFor={id} className="mb-2 block text-[0.8125rem] font-medium tracking-[-0.005em] text-coal/80">
          {f.label}
          <span aria-hidden="true" className="text-red-deep">
            {" "}
            *
          </span>
        </label>
        {f.type === "textarea" ? (
          <textarea {...common} rows={3} className={`${FIELD} min-h-28 resize-y py-3 leading-[1.5]`} />
        ) : (
          <input {...common} type={f.type ?? "text"} className={`${FIELD} h-12`} />
        )}
      </div>
    );
  };

  const { attachment } = sponsorshipForm;

  return (
    // the page's opening and its body in one: data-page-opening gives the label, the title and the lead
    // the inner pages' CSS entrance (globals.css), so they paint at once, without waiting for hydration
    <section
      ref={root}
      id="patrocinios"
      data-page-opening
      aria-labelledby="patrocinios-title"
      className="bg-chalk px-[var(--gutter)] pt-[calc(var(--header-h)+2.5rem)] text-coal lg:pt-[calc(var(--frame-top)+clamp(1.5rem,3vw,3rem))]"
    >
      <div className="grid gap-y-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-[clamp(3rem,6vw,7rem)]">
        {/* the label, the title and the text; from lg beside the form, and held in view while it scrolls
            by. Sticky `top`: under the island (frame top + 1.5rem), or — a column taller than the screen —
            the screen's height less the column's and a 2rem margin (negative), so it holds with its last
            line in view. Before the measure (no JS yet), --col-h is 0: under the island. */}
        <div
          ref={column}
          className="lg:sticky lg:top-[min(calc(var(--frame-top)_+_1.5rem),calc(100svh_-_var(--col-h,0px)_-_2rem))] lg:self-start"
        >
          <OpeningHead
            titleId="patrocinios-title"
            place={sponsorshipPlace}
            title={sponsorshipOpening.title}
            titleLines={sponsorshipOpening.titleLines}
          />
          <p data-opening-rise="lead" className="t-lead mt-7 max-w-[36ch] text-graphite">
            {sponsorshipOpening.lead}
          </p>

          <p
            data-reveal
            className="mt-10 max-w-[30ch] text-[clamp(1.25rem,1.7vw,1.75rem)] font-medium leading-[1.22] tracking-[-0.02em] text-pretty [font-stretch:88%]"
          >
            {sponsorshipIntro.statement}
          </p>
          {/* the Sponsorship Policy link, where the official page has one (the English page has none) */}
          {sponsorshipIntro.policy.href && (
            <p data-reveal className="mt-8 text-[clamp(1.0625rem,1.2vw,1.25rem)] tracking-[-0.015em] text-coal">
              {sponsorshipIntro.policy.before}{" "}
              <a href={sponsorshipIntro.policy.href} target="_blank" rel="noreferrer" className="group inline-flex items-baseline gap-1.5 font-medium">
                <span className="link-line">{sponsorshipIntro.policy.label}</span>
                <span className="sr-only">{NEW_TAB}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-4 shrink-0 self-center transition-[translate] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
              .
            </p>
          )}
          <p data-reveal className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-pretty text-graphite">
            {sponsorshipIntro.formIntro}
          </p>
        </div>

        {/* the official form, in the About page's outlined frame */}
        <form
          onSubmit={onSubmit}
          // the browser fires `invalid` on each missing field when a submission is tried
          onInvalidCapture={() => setTried(true)}
          onChange={() => setSent(false)}
          data-tried={tried || undefined}
          className="group/form rounded-[var(--island-radius)] border border-coal/12 p-[clamp(1.25rem,3vw,2.5rem)]"
        >
          {sponsorshipForm.groups.map((group, i) => (
            <fieldset key={group.id} data-reveal className={i > 0 ? "mt-9 border-t border-line pt-8" : ""}>
              <legend className="t-label float-left w-full text-coal">
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="relative block h-[3px] w-7 shrink-0 bg-signal">
                    <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
                  </span>
                  {group.title}
                </span>
              </legend>
              <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">{group.fields.map(field)}</div>
            </fieldset>
          ))}

          {/* the project's presentation: the file input itself is hidden, its label is the button */}
          <fieldset data-reveal className="mt-9 border-t border-line pt-8">
            <legend className="t-label float-left w-full text-coal">
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className="relative block h-[3px] w-7 shrink-0 bg-signal">
                  <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
                </span>
                {attachment.title}
              </span>
            </legend>
            <div className="clear-both pt-5">
              <p id={`${formId}-anexo-label`} className="mb-3 text-[0.8125rem] font-medium tracking-[-0.005em] text-coal/80">
                {attachment.label}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <input
                  id={`${formId}-anexo`}
                  name="apresentacao"
                  type="file"
                  accept="application/pdf"
                  aria-labelledby={`${formId}-anexo-label`}
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`${formId}-anexo`}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-coal/20 px-5 text-[0.8125rem] font-medium tracking-[-0.01em] text-coal transition-colors duration-300 hover:border-coal peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-orange"
                >
                  <Paperclip aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  {attachment.button}
                </label>
                <span aria-live="polite" className="min-w-0 truncate text-[0.875rem] text-muted">
                  {fileName || attachment.empty}
                </span>
              </div>
            </div>
          </fieldset>

          <div data-reveal className="mt-9 border-t border-line pt-8">
            <label className="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-coal/85">
              <input name="consentimento" type="checkbox" required className="mt-0.5 size-5 shrink-0 accent-red-deep" />
              <span>{sponsorshipForm.consent}</span>
            </label>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="submit"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-coal pl-6 pr-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-chalk transition-colors duration-500 ease-out-expo hover:bg-red-deep focus-visible:bg-red-deep"
              >
                <RollText>{sponsorshipForm.submit}</RollText>
                <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-chalk/12">
                  <ArrowUpRight
                    strokeWidth={1.75}
                    className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </button>
              {/* announced when it appears: the request was complete, and was not sent */}
              <p role="status" className="text-[0.9375rem] leading-snug text-coal">
                {sent && (
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="relative block h-[3px] w-7 shrink-0 bg-signal">
                      <span className="absolute inset-y-0 right-0 w-2 bg-comet" />
                    </span>
                    {sponsorshipForm.demoNotice}
                  </span>
                )}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
