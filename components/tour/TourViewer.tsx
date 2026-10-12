"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";

type Info = { title: string; text: string };

const pin = (label: string) =>
  `<div class="mm-pin"><span class="mm-pin__dot"></span><span class="mm-pin__label">${label}</span></div>`;

// Panoramas are generated from freely licensed HDR captures (see CREDITS.md).
const NODES = [
  {
    id: "salon",
    panorama: "/tour/salon.jpg",
    thumbnail: "/tour/salon-thumb.jpg",
    name: "Κεντρικό σαλόνι",
    caption: "Οικία Έννις · Κεντρικό σαλόνι",
    links: [
      { nodeId: "atrium", position: { yaw: "0deg", pitch: "-12deg" } },
      { nodeId: "before", position: { yaw: "180deg", pitch: "-12deg" } },
    ],
    markers: [
      {
        id: "fireplace",
        position: { yaw: "125deg", pitch: "-4deg" },
        html: pin("Τζάκι"),
        anchor: "center center",
        data: { title: "Τζάκι από ανάγλυφη πέτρα", text: "Αποκατεστημένο τζάκι με πλαίσιο από χειροποίητα τσιμεντόλιθα και επένδυση από χαλκό." },
      },
      {
        id: "ceiling",
        position: { yaw: "-150deg", pitch: "38deg" },
        html: pin("Οροφή"),
        anchor: "center center",
        data: { title: "Δοκοί από τικ", text: "Αρχικές ξύλινες δοκοί, καθαρισμένες και λαδωμένες για να αναδειχθεί το νερό του ξύλου." },
      },
      {
        id: "window",
        position: { yaw: "0deg", pitch: "18deg" },
        html: pin("Υαλοστάσιο"),
        anchor: "center center",
        data: { title: "Υαλοστάσιο με art glass", text: "Ψηλό παράθυρο με βιτρό. Ο φωτισμός της αίθουσας σχεδιάστηκε γύρω από αυτό." },
      },
    ],
  },
  {
    id: "atrium",
    panorama: "/tour/atrium.jpg",
    thumbnail: "/tour/atrium-thumb.jpg",
    name: "Αίθριο",
    caption: "Palazzo · Αίθριο με τοξοστοιχίες",
    links: [{ nodeId: "salon", position: { yaw: "180deg", pitch: "-10deg" } }],
    markers: [
      {
        id: "arcade",
        position: { yaw: "-95deg", pitch: "2deg" },
        html: pin("Τοξοστοιχία"),
        anchor: "center center",
        data: { title: "Έμπνευση: βενετσιάνικες τοξοστοιχίες", text: "Ο ρυθμός των τόξων έγινε μοτίβο για τα ντουλάπια και τα ανοίγματα της κατοικίας." },
      },
    ],
  },
  {
    id: "before",
    panorama: "/tour/before.jpg",
    thumbnail: "/tour/before-thumb.jpg",
    name: "Πριν την ανακαίνιση",
    caption: "Ο χώρος πριν την παρέμβαση",
    links: [{ nodeId: "salon", position: { yaw: "0deg", pitch: "-12deg" } }],
    markers: [
      {
        id: "old-fireplace",
        position: { yaw: "-60deg", pitch: "-6deg" },
        html: pin("Παλιό τζάκι"),
        anchor: "center center",
        data: { title: "Το αρχικό τζάκι", text: "Κρατήσαμε τη θέση και την αναλογία του, αλλά το ντύσαμε ξανά με πέτρα." },
      },
    ],
  },
];

export default function TourViewer() {
  const el = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let viewer: import("@photo-sphere-viewer/core").Viewer | undefined;
    let cancelled = false;

    (async () => {
      const [{ Viewer }, { MarkersPlugin }, { VirtualTourPlugin }, { GalleryPlugin }] = await Promise.all([
        import("@photo-sphere-viewer/core"),
        import("@photo-sphere-viewer/markers-plugin"),
        import("@photo-sphere-viewer/virtual-tour-plugin"),
        import("@photo-sphere-viewer/gallery-plugin"),
      ]);
      if (cancelled || !el.current) return;

      viewer = new Viewer({
        container: el.current,
        loadingTxt: "Φόρτωση…",
        defaultZoomLvl: 20,
        mousewheelCtrlKey: false,
        touchmoveTwoFingers: false,
        navbar: ["zoom", "move", "gallery", "caption", "fullscreen"],
        lang: {
          zoom: "Μεγέθυνση",
          zoomOut: "Σμίκρυνση",
          zoomIn: "Μεγέθυνση",
          moveUp: "Πάνω",
          moveDown: "Κάτω",
          moveLeft: "Αριστερά",
          moveRight: "Δεξιά",
          fullscreen: "Πλήρης οθόνη",
          menu: "Μενού",
          close: "Κλείσιμο",
          twoFingers: "Χρησιμοποιήστε δύο δάχτυλα",
          ctrlZoom: "Ctrl + κύλιση για μεγέθυνση",
          loadError: "Η εικόνα δεν φορτώθηκε",
          webglError: "Ο browser δεν υποστηρίζει WebGL",
        },
        plugins: [
          [MarkersPlugin, {}],
          [GalleryPlugin, { thumbnailSize: { width: 160, height: 90 }, hideOnClick: true }],
          [
            VirtualTourPlugin,
            {
              positionMode: "manual",
              renderMode: "3d",
              nodes: NODES,
              startNodeId: "salon",
              showLinkTooltip: true,
              transitionOptions: { showLoader: false, speed: "18rpm", effect: "fade", rotation: true },
              arrowStyle: { size: { width: 80, height: 80 } },
            },
          ],
        ],
      });

      const markers = viewer.getPlugin(MarkersPlugin) as InstanceType<typeof MarkersPlugin>;
      markers.addEventListener("select-marker", (e) => {
        const data = e.marker.config.data as Info | undefined;
        if (data) setInfo(data);
      });
      viewer.addEventListener("ready", () => setReady(true), { once: true });

      // A slow idle drift so the room feels alive until the visitor takes over.
      let idle = true;
      const stop = () => (idle = false);
      viewer.addEventListener("click", stop);
      el.current.addEventListener("pointerdown", stop);
      const drift = () => {
        if (!viewer || cancelled) return;
        if (idle) {
          const p = viewer.getPosition();
          viewer.rotate({ yaw: p.yaw + 0.0009, pitch: p.pitch });
        }
        requestAnimationFrame(drift);
      };
      requestAnimationFrame(drift);
    })();

    return () => {
      cancelled = true;
      viewer?.destroy();
    };
  }, []);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden" data-lenis-prevent>
      <div ref={el} className="absolute inset-0" data-cursor="drag" />

      <AnimatePresence>
        {!ready && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 z-10 flex items-center justify-center bg-ink">
            <span className="eyebrow animate-pulse">Ετοιμάζουμε την περιήγηση</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] bg-gradient-to-b from-ink/85 to-transparent px-6 pt-28 pb-20 md:px-10">
        <p className="eyebrow mb-3">Εικονική περιήγηση · 360°</p>
        <h1 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-none font-extralight">
          Οικία <span className="italic text-blue">Έννις</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm text-mist/75">
          Σύρετε για να κοιτάξετε γύρω, πατήστε τα βέλη για να μετακινηθείτε και τα σημεία για λεπτομέρειες.
        </p>
      </div>

      <AnimatePresence>
        {info && (
          <motion.div
            key={info.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-4 bottom-20 left-4 z-[6] rounded-lg border border-ivory/10 bg-ink/85 p-6 backdrop-blur-xl md:right-10 md:left-auto md:w-[340px]"
          >
            <button onClick={() => setInfo(null)} aria-label="Κλείσιμο" className="absolute top-4 right-4 text-mist hover:text-ivory">
              ✕
            </button>
            <p className="eyebrow mb-3 text-[0.62rem] text-blue">Λεπτομέρεια</p>
            <h2 className="pr-6 font-display text-2xl font-light">{info.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist/80">{info.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
