export type Piece = { label: string; material: string; x: number; y: number };

export type Season = {
  id: "spring" | "summer" | "autumn" | "winter";
  name: string;
  months: string;
  line: string;
  /** colour temperature of the room's light, shown in the meta row */
  light: string;
  image: string;
  alt: string;
  /** CSS object-position, so phones crop to the heart of the room */
  focus: string;
  /** hover labels, positioned in % of the frame once the final images are in */
  pieces: Piece[];
};

export const SEASONS: Season[] = [
  {
    id: "spring",
    name: "Άνοιξη",
    months: "Μάρτιος — Μάιος",
    line: "Ανοιχτά παντζούρια, λινό και ανθισμένη αμυγδαλιά. Το σπίτι παίρνει ανάσα.",
    light: "5600 K · πρωινό φως",
    image: "/media/seasons/spring.jpg",
    alt: "Σαλόνι την άνοιξη, με λινό καναπέ και ανθισμένα κλαδιά αμυγδαλιάς δίπλα στις ανοιχτές μπαλκονόπορτες",
    focus: "55% 50%",
    pieces: [],
  },
  {
    id: "summer",
    name: "Καλοκαίρι",
    months: "Ιούνιος — Αύγουστος",
    line: "Μισόκλειστα παντζούρια, ψάθα και τραβερτίνης. Το φως μπαίνει σε λωρίδες.",
    light: "6500 K · μεσημεριανός ήλιος",
    image: "/media/seasons/summer.jpg",
    alt: "Το ίδιο σαλόνι το καλοκαίρι, με λωρίδες ήλιου από τα παντζούρια πάνω σε λευκό καναπέ και ψάθινη πολυθρόνα",
    focus: "55% 50%",
    pieces: [],
  },
  {
    id: "autumn",
    name: "Φθινόπωρο",
    months: "Σεπτέμβριος — Νοέμβριος",
    line: "Βελούδο στο χρώμα της σκουριάς, καρυδιά και χαμηλό χρυσό απογευματινό φως.",
    light: "3500 K · χρυσή ώρα",
    image: "/media/seasons/autumn.jpg",
    alt: "Το ίδιο σαλόνι το φθινόπωρο, με βελούδινες πολυθρόνες στο χρώμα της σκουριάς και χαμηλό χρυσό φως",
    focus: "55% 50%",
    pieces: [],
  },
  {
    id: "winter",
    name: "Χειμώνας",
    months: "Δεκέμβριος — Φεβρουάριος",
    line: "Αναμμένο τζάκι, μοχέρ και μπουκλέ. Έξω η μπλε ώρα, μέσα η φλόγα.",
    light: "2700 K · φως φωτιάς",
    image: "/media/seasons/winter.jpg",
    alt: "Το ίδιο σαλόνι τον χειμώνα, με αναμμένο μαρμάρινο τζάκι, μπλε καναπέ και τη μπλε ώρα έξω από τις μπαλκονόπορτες",
    focus: "45% 50%",
    pieces: [],
  },
];
