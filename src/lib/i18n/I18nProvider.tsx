import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { TE, translateString } from "./dictionary";

export type Lang = "en" | "te";
const STORAGE_KEY = "kg-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (s: string) => string };
const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (s) => s });

export function useI18n() {
  return useContext(I18nContext);
}

/** Original English text kept per text node so we can switch back. */
const originals = new WeakMap<Text, string>();

function translateTree(root: Node, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n = walker.nextNode();
  while (n) {
    nodes.push(n as Text);
    n = walker.nextNode();
  }
  for (const node of nodes) {
    const parentTag = node.parentElement?.tagName;
    if (parentTag === "SCRIPT" || parentTag === "STYLE") continue;
    const base = originals.get(node) ?? node.data;
    const key = base.trim();
    if (!key) continue;
    if (lang === "te") {
      const hit = translateString(key);
      if (!hit) continue;
      if (!originals.has(node)) originals.set(node, node.data);
      const next = node.data.replace(key, hit);
      if (node.data !== next) node.data = next;
    } else if (originals.has(node)) {
      if (node.data !== base) node.data = base;
      originals.delete(node);
    }
  }

  // placeholders + aria-labels
  const els = (root instanceof Element ? root : document.body).querySelectorAll<HTMLElement>("[placeholder],[aria-label]");
  els.forEach((el) => {
    for (const attr of ["placeholder", "aria-label"] as const) {
      const cur = el.getAttribute(attr);
      if (!cur) continue;
      const orig = el.dataset[attr === "placeholder" ? "i18nPlaceholder" : "i18nAria"];
      if (lang === "te") {
        const base = orig ?? cur;
        const hit = translateString(base.trim());
        if (!hit) continue;
        if (!orig) el.dataset[attr === "placeholder" ? "i18nPlaceholder" : "i18nAria"] = base;
        if (cur !== hit) el.setAttribute(attr, hit);
      } else if (orig) {
        el.setAttribute(attr, orig);
        delete el.dataset[attr === "placeholder" ? "i18nPlaceholder" : "i18nAria"];
      }
    }
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "te" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  // Translate whatever React renders, and keep translating on DOM updates.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang === "te" ? "te" : "en";
    let scheduled = false;
    const run = () => {
      scheduled = false;
      observer.disconnect();
      translateTree(document.body, lang);
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(run);
    };
    const observer = new MutationObserver(schedule);
    run();
    return () => observer.disconnect();
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (s: string) => (lang === "te" ? translateString(s) ?? s : s) }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
