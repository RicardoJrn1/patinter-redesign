import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RollText } from "@/components/ui/RollText";
import { menuGroups, news } from "@/content/site";

// Isolated test page: four hover ideas for the text links (footer menu, news), next to today's, to be
// compared with the mouse. Not part of the site: kept out of search engines. Pure CSS, no JS.
export const metadata: Metadata = {
  title: "Protótipo — hover dos links",
  robots: { index: false, follow: false },
};

const group = menuGroups[0];
const story = news.items[0];

// `.is-on` forces the hover state (for screenshots); `:focus-visible` gives keyboard users the same.
const css = `
.hv { --signal:#e52d36; --comet:#f5d21a; --ease:cubic-bezier(0.16,1,0.3,1); }
.hv .lk { cursor:pointer; text-align:left; }
.hv .t { color:rgb(23 23 23 / .8); transition:color .3s; }
.hv .lk:is(:hover,:focus-visible,.is-on) .t { color:#171717; }
.hv .ar { color:rgb(23 23 23 / .45); transition:translate .5s var(--ease), color .3s; }
.hv .lk:is(:hover,:focus-visible,.is-on) .ar { translate:2px -2px; color:#171717; }

/* A: the footer bar in miniature under the text: 1/5 red, then yellow. Draws in from the left, leaves to the right. */
.hv-a .t { background-image:linear-gradient(90deg, var(--signal) 0 20%, var(--comet) 20% 100%); background-repeat:no-repeat;
  background-size:0% 2px; background-position:100% 100%; padding-bottom:5px; transition:background-size .7s var(--ease), color .3s; }
.hv-a .lk:is(:hover,:focus-visible,.is-on) .t { background-size:100% 2px; background-position:0 100%; }

/* B: the letters themselves painted from the left: red, then yellow. */
.hv-b .t { color:transparent; -webkit-background-clip:text; background-clip:text; background-repeat:no-repeat;
  background-image:linear-gradient(90deg, var(--signal) 0 20%, var(--comet) 20% 100%), linear-gradient(var(--base), var(--base));
  background-size:0% 100%, 100% 100%; background-position:100% 0, 0 0; transition:background-size .7s var(--ease); }
.hv-b { --base:rgb(23 23 23 / .8); }
.hv-b.dark { --base:rgb(244 241 235 / .85); }
.hv-b .lk:is(:hover,:focus-visible,.is-on) .t { color:transparent; background-size:100% 100%, 100% 100%; background-position:0 0, 0 0; }

/* C: a highlighter swept from the left: a red tip, then yellow; the text stays dark on it. */
.hv-c .t { background-image:linear-gradient(90deg, var(--signal) 0 0.28em, var(--comet) 0.28em 100%); background-repeat:no-repeat;
  background-size:0% 100%; background-position:100% 0; padding:0.08em 0.3em 0.08em 0.5em; margin-left:-0.5em;
  transition:background-size .6s var(--ease), color .3s; }
.hv-c .lk:is(:hover,:focus-visible,.is-on) .t { background-size:100% 100%; background-position:0 0; }

/* D: the labels' little red-and-yellow dash slides in before the text, which steps aside for it. */
.hv-d .lk { position:relative; }
.hv-d .mk { position:absolute; left:0; top:0.62em; width:1rem; height:3px; margin-top:-1.5px;
  background:linear-gradient(90deg, var(--signal) 0 68%, var(--comet) 68% 100%); transform:scaleX(0); transform-origin:left;
  transition:transform .5s var(--ease); }
.hv-d .t { display:inline-block; transition:transform .5s var(--ease), color .3s; }
.hv-d .lk:is(:hover,:focus-visible,.is-on) .mk { transform:scaleX(1); }
.hv-d .lk:is(:hover,:focus-visible,.is-on) .t { transform:translateX(1.6rem); }

@media (prefers-reduced-motion: reduce) { .hv * { transition:none !important; } }
`;

type Variant = "a" | "b" | "c" | "d";

/** The footer's first group, with the variant's markup. */
function FooterSample({ v, dark = false }: { v: Variant; dark?: boolean }) {
  return (
    <div className={`hv-${v} ${dark ? "dark" : ""}`}>
      <p className={`t-label ${dark ? "text-comet" : "text-red-deep"}`}>{group.title}</p>
      <ul className="mt-4 space-y-2.5">
        {group.links.map((link) => (
          <li key={link.label}>
            <button type="button" data-sample className="lk block text-[0.9375rem] leading-snug tracking-[-0.01em]">
              {v === "d" && <span aria-hidden="true" className="mk" />}
              <span className="t">{link.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The news strip's first line, with the variant's markup. */
function NewsSample({ v }: { v: Variant }) {
  return (
    <div className={`hv-${v} self-start border-y border-line`}>
      <a href={story.href} target="_blank" rel="noreferrer" data-sample className="lk block py-4">
        <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-1.5">
          <time dateTime={story.date} className="t-label text-muted">
            {story.date.split("-").reverse().join("/")}
          </time>
          {/* D: the dash sits on the title's first line; room on the right for the title to step aside */}
          <span className={`relative col-start-1 text-[1.0625rem] leading-snug tracking-[-0.01em] ${v === "d" ? "pr-7" : ""}`}>
            {v === "d" && <span aria-hidden="true" className="mk" />}
            <span className="t">{story.title}</span>
          </span>
          <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="ar col-start-2 row-span-2 row-start-1 size-4 self-center" />
        </span>
      </a>
    </div>
  );
}

function Row({ tag, name, note, children }: { tag: string; name: string; note: ReactNode; children: ReactNode }) {
  return (
    <section className="grid gap-x-12 gap-y-8 border-t border-line py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1.6fr)]">
      <div>
        <p className="t-label text-muted">{tag}</p>
        <h2 className="mt-3 text-[1.5rem] font-medium leading-tight tracking-[-0.03em]">{name}</h2>
        <div className="mt-3 max-w-[26rem] text-[0.9375rem] leading-relaxed text-coal/70">{note}</div>
      </div>
      {children}
    </section>
  );
}

export default function HoverPrototypePage() {
  return (
    <main className="hv min-h-svh bg-chalk px-[var(--gutter)] pb-24 pt-16 text-coal">
      <style>{css}</style>
      <p className="t-label text-muted">Protótipo · passe o rato por cima dos links</p>
      <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">Hover dos links</h1>

      <div className="mt-14">
        <Row tag="Hoje" name="O texto rola e fica vermelho" note="O que está no site agora, para comparar.">
          <div>
            <p className="t-label text-red-deep">{group.title}</p>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <button type="button" className="group block text-left text-[0.9375rem] leading-snug tracking-[-0.01em] text-coal/80 transition-colors duration-300 hover:text-red-deep">
                    <RollText>{link.label}</RollText>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start border-y border-line">
            <a href={story.href} target="_blank" rel="noreferrer" className="group block py-4">
              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-1.5">
                <time className="t-label text-muted">{story.date.split("-").reverse().join("/")}</time>
                <span className="col-start-1 text-[1.0625rem] leading-snug tracking-[-0.01em] text-coal/85 transition-colors duration-300 group-hover:text-red-deep">
                  {story.title}
                </span>
                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="col-start-2 row-span-2 row-start-1 size-4 self-center text-coal/45 transition-[translate,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-deep" />
              </span>
            </a>
          </div>
        </Row>

        <Row tag="A · Recomendado" name="Sublinhado da marca" note="A barra do rodapé em miniatura, por baixo do texto: 1/5 vermelho, o resto amarelo. Desenha-se da esquerda para a direita e sai pela direita. O texto continua escuro e legível.">
          <FooterSample v="a" />
          <NewsSample v="a" />
        </Row>

        <Row
          tag="B · A sua ideia, à letra"
          name="Texto pintado"
          note={
            <>
              As próprias letras pintam-se da esquerda para a direita: vermelho no início, amarelo no resto. No fundo claro o amarelo quase
              desaparece. No fundo escuro (caixa preta ao lado) funciona bem.
            </>
          }
        >
          <FooterSample v="b" />
          <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,1fr)_auto]">
            <NewsSample v="b" />
            <div className="rounded-xl bg-coal p-6">
              <FooterSample v="b" dark />
            </div>
          </div>
        </Row>

        <Row tag="C" name="Marcador" note="Uma faixa de marcador passa por trás do texto, da esquerda para a direita: uma ponta vermelha e o resto amarelo. O texto fica escuro em cima do amarelo, que se lê bem. É a opção mais chamativa.">
          <FooterSample v="c" />
          <NewsSample v="c" />
        </Row>

        <Row tag="D" name="Traço que entra" note="O pequeno traço vermelho e amarelo das etiquetas das secções entra à esquerda e empurra o texto um pouco para a direita. A mais discreta.">
          <FooterSample v="d" />
          <NewsSample v="d" />
        </Row>
      </div>
    </main>
  );
}
