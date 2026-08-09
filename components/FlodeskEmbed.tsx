"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SUCCESS_REDIRECT_DELAY_MS = 1600;

declare global {
  interface Window {
    __digitalNirajFlodeskBootstrapped?: boolean;
  }
}

function configureDelayedSuccessRedirect(fragment: DocumentFragment) {
  const configElement = fragment.querySelector<HTMLElement>("[data-ff-el='config'][data-ff-config]");
  const encodedConfig = configElement?.getAttribute("data-ff-config");
  if (!configElement || !encodedConfig) return;

  try {
    const config = JSON.parse(window.atob(encodedConfig));
    config.onSuccess = {
      ...config.onSuccess,
      mode: "message",
      redirectUrl: "",
    };
    configElement.setAttribute("data-ff-config", window.btoa(JSON.stringify(config)));
  } catch {
    throw new Error("The Flodesk success configuration could not be prepared.");
  }
}

export default function FlodeskEmbed() {
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let observer: MutationObserver | undefined;
    let redirectTimer: number | undefined;
    let cancelled = false;

    const watchForSuccess = (root: Element) => {
      const redirectAfterSuccess = () => {
        if (root.getAttribute("data-ff-stage") !== "success" || redirectTimer) return;
        redirectTimer = window.setTimeout(() => router.push("/thanks"), SUCCESS_REDIRECT_DELAY_MS);
      };

      observer = new MutationObserver(redirectAfterSuccess);
      observer.observe(root, { attributes: true, attributeFilter: ["data-ff-stage"] });
      redirectAfterSuccess();
    };

    const injectEmbed = async () => {
      try {
        const response = await fetch("/flodesk-embed.html", { cache: "force-cache" });
        if (!response.ok) throw new Error("The Flodesk form could not be loaded.");

        const html = await response.text();
        if (cancelled) return;

        const template = document.createElement("template");
        template.innerHTML = html;
        configureDelayedSuccessRedirect(template.content);

        const nodes = Array.from(template.content.childNodes);
        for (const node of nodes) {
          if (node instanceof HTMLLinkElement) {
            const href = node.getAttribute("href");
            if (href && !document.head.querySelector(`link[href="${href}"]`)) {
              document.head.appendChild(node.cloneNode(true));
            }
            continue;
          }

          if (node instanceof HTMLScriptElement) {
            const isBootstrap = node.textContent?.includes("FlodeskObject");
            if (isBootstrap && window.__digitalNirajFlodeskBootstrapped) continue;

            const liveScript = document.createElement("script");
            for (const attribute of Array.from(node.attributes)) {
              liveScript.setAttribute(attribute.name, attribute.value);
            }
            liveScript.textContent = node.textContent;
            mount.appendChild(liveScript);
            if (isBootstrap) window.__digitalNirajFlodeskBootstrapped = true;
            continue;
          }

          mount.appendChild(node.cloneNode(true));
        }

        const root = mount.querySelector("[data-ff-el='root']");
        if (!root) throw new Error("The Flodesk form markup is unavailable.");
        watchForSuccess(root);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "The Flodesk form could not be loaded.");
        }
      }
    };

    const existingRoot = mount.querySelector("[data-ff-el='root']");
    if (existingRoot) watchForSuccess(existingRoot);
    else void injectEmbed();

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flodesk-shell">
      <div ref={mountRef} />
      {loadError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          {loadError} Please refresh the page and try again.
        </p>
      )}
    </div>
  );
}
