import { Background } from "@/components/Background";
import { Playground } from "@/components/Playground";

export default function Home() {
  return (
    <main className="relative flex-1 text-white">
      <Background />
      <Playground />
    </main>
  );
}
