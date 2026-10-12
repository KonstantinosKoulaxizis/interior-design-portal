import type { Metadata } from "next";
import TourViewer from "@/components/tour/TourViewer";

export const metadata: Metadata = { title: "Περιήγηση 360° | Maria Michalakakou" };

export default function TourPage() {
  return (
    <main>
      <TourViewer />
    </main>
  );
}
