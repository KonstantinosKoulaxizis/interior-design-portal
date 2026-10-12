// Mock content for the prototype. All copy is Greek placeholder text and all media is
// generated from freely licensed panoramas and 3D models (see CREDITS.md).

export type Project = {
  slug: string;
  title: string;
  place: string;
  year: string;
  category: string;
  image: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "villa-ennis",
    title: "Οικία Έννις",
    place: "Κηφισιά",
    year: "2025",
    category: "Κατοικία",
    image: "/media/hero.jpg",
  },
  {
    slug: "fireplace-salon",
    title: "Σαλόνι με τζάκι",
    place: "Εκάλη",
    year: "2025",
    category: "Ανακαίνιση",
    image: "/media/p-fireplace.jpg",
  },
  {
    slug: "palazzo",
    title: "Palazzo Αίθριο",
    place: "Κέρκυρα",
    year: "2024",
    category: "Φιλοξενία",
    image: "/media/p-palazzo.jpg",
  },
  {
    slug: "light-hall",
    title: "Αίθουσα του φωτός",
    place: "Βουλιαγμένη",
    year: "2024",
    category: "Κατοικία",
    image: "/media/p-window.jpg",
  },
  {
    slug: "timber-loft",
    title: "Ξύλινη σοφίτα",
    place: "Μέτσοβο",
    year: "2023",
    category: "Εξοχική κατοικία",
    image: "/media/p-ceiling.jpg",
  },
];

export const MATERIALS = [
  { name: "Ανάγλυφη πέτρα", note: "Χειροποίητα πλακίδια, ματ υφή", image: "/media/m-stone.jpg" },
  { name: "Δρυς", note: "Μασίφ δάπεδο, φυσικό λάδι", image: "/media/m-oak.jpg" },
  { name: "Καρυδιά", note: "Δοκοί οροφής, σατινέ φινίρισμα", image: "/media/m-walnut.jpg" },
  { name: "Ίστρια πέτρα", note: "Βενετσιάνικο πλακόστρωτο", image: "/media/m-marble.jpg" },
  { name: "Παλαιό τούβλο", note: "Ανακτημένο, εμφανές", image: "/media/m-brick.jpg" },
];

export const PROCESS = [
  { title: "Γνωριμία", text: "Ακούμε πώς ζείτε, τι αγαπάτε και τι ονειρεύεστε για τον χώρο σας." },
  { title: "Σύλληψη", text: "Moodboards, υλικά και πρώτα σκίτσα που αποτυπώνουν την ατμόσφαιρα." },
  { title: "Σχεδιασμός 3D", text: "Φωτορεαλιστικές απεικονίσεις και περιήγηση πριν από κάθε απόφαση." },
  { title: "Υλοποίηση", text: "Επιβλέπουμε κάθε λεπτομέρεια, από το εργοτάξιο ως το τελευταίο αντικείμενο." },
];

export type Product = {
  slug: string;
  name: string;
  category: "Καναπέδες" | "Καθίσματα" | "Φωτισμός" | "Αντικείμενα";
  room: "Σαλόνι" | "Τραπεζαρία" | "Υπνοδωμάτιο";
  material: string;
  price: string;
  model: string;
  /** Pre-rendered transparent thumbnail for the catalogue grid */
  image: string;
  description: string;
  dimensions: string;
  /** Names of the glTF KHR_materials_variants the model ships with, if any */
  variants?: { name: string; label: string; swatch: string }[];
  /** Camera distance and model scale tuning for the viewer */
  view?: { scale?: number; y?: number };
};

export const PRODUCTS: Product[] = [
  {
    slug: "glam-velvet-sofa",
    name: "Καναπές Βελούδο Glam",
    category: "Καναπέδες",
    room: "Σαλόνι",
    material: "Βελούδο",
    price: "4.850 €",
    model: "/models/GlamVelvetSofa.glb",
    image: "/catalogue/glam-velvet-sofa.webp",
    description:
      "Τριθέσιος καναπές με βαθιά καθίσματα, βελούδινη επένδυση και ορειχάλκινα πόδια. Διατίθεται σε πέντε αποχρώσεις.",
    dimensions: "Π 228 × Β 95 × Υ 82 εκ.",
    variants: [
      { name: "Navy", label: "Μπλε νυχτός", swatch: "#1f2a44" },
      { name: "Champagne", label: "Σαμπάνια", swatch: "#cdb895" },
      { name: "Gray", label: "Γκρι", swatch: "#8b8c8f" },
      { name: "Black", label: "Μαύρο", swatch: "#1b1b1d" },
      { name: "Pale Pink", label: "Πούδρα", swatch: "#d8b2ad" },
    ],
  },
  {
    slug: "sheen-wood-leather-sofa",
    name: "Καναπές Δέρμα & Ξύλο",
    category: "Καναπέδες",
    room: "Σαλόνι",
    material: "Δέρμα",
    price: "6.200 €",
    model: "/models/SheenWoodLeatherSofa.glb",
    image: "/catalogue/sheen-wood-leather-sofa.webp",
    description: "Ξύλινος σκελετός με δερμάτινα μαξιλάρια και υφασμάτινα ριχτάρια με κρόσσια.",
    dimensions: "Π 210 × Β 90 × Υ 78 εκ.",
  },
  {
    slug: "sheen-chair",
    name: "Πολυθρόνα Sheen",
    category: "Καθίσματα",
    room: "Σαλόνι",
    material: "Βελούδο",
    price: "1.640 €",
    model: "/models/SheenChair.glb",
    image: "/catalogue/sheen-chair.webp",
    description: "Πολυθρόνα με μεταλλική βάση και βελούδο με λάμψη που αλλάζει με το φως.",
    dimensions: "Π 74 × Β 78 × Υ 80 εκ.",
    variants: [
      { name: "Peacock Velvet", label: "Παγώνι", swatch: "#1f5f63" },
      { name: "Mango Velvet", label: "Μάνγκο", swatch: "#d58f2e" },
    ],
  },
  {
    slug: "damask-chair",
    name: "Καρέκλα Damask",
    category: "Καθίσματα",
    room: "Τραπεζαρία",
    material: "Ύφασμα damask",
    price: "890 €",
    model: "/models/ChairDamaskPurplegold.glb",
    image: "/catalogue/damask-chair.webp",
    description: "Κλασική καρέκλα τραπεζαρίας με ύφασμα damask σε μωβ και χρυσό.",
    dimensions: "Π 52 × Β 58 × Υ 96 εκ.",
  },
  {
    slug: "iridescence-lamp",
    name: "Επιτραπέζιο Φωτιστικό Ίρις",
    category: "Φωτισμός",
    room: "Υπνοδωμάτιο",
    material: "Γυαλί",
    price: "720 €",
    model: "/models/IridescenceLamp.glb",
    image: "/catalogue/iridescence-lamp.webp",
    description: "Γυάλινο αμπαζούρ με ιριδίζουσα επίστρωση που ζωντανεύει κάθε γωνία.",
    dimensions: "Ø 30 × Υ 46 εκ.",
  },
  {
    slug: "barn-lamp",
    name: "Απλίκα Barn",
    category: "Φωτισμός",
    room: "Τραπεζαρία",
    material: "Βουρτσισμένος χαλκός",
    price: "540 €",
    model: "/models/AnisotropyBarnLamp.glb",
    image: "/catalogue/barn-lamp.webp",
    description: "Επίτοιχο φωτιστικό από βουρτσισμένο χαλκό με εμφανές νήμα.",
    dimensions: "Ø 36 × Υ 28 εκ.",
  },
  {
    slug: "glass-vase",
    name: "Σετ Γυάλινων Βάζων",
    category: "Αντικείμενα",
    room: "Τραπεζαρία",
    material: "Γυαλί",
    price: "260 €",
    model: "/models/GlassVaseFlowers.glb",
    image: "/catalogue/glass-vase.webp",
    description: "Δύο φυσητά γυάλινα βάζα σε διαφορετικές διαφάνειες, με σύνθεση από άνθη.",
    dimensions: "Ø 18 × Υ 42 εκ.",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
