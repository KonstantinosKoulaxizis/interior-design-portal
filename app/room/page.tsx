import type { Metadata } from "next";
import RoomExperience from "@/components/room/RoomExperience";

export const metadata: Metadata = { title: "Χώρος 3D | Maria Michalakakou" };

export default function RoomPage() {
  return (
    <main>
      <RoomExperience />
    </main>
  );
}
