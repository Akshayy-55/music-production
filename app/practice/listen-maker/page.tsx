import { PracticeShell } from "@/components/PracticeShell";
import { ListenMaker } from "@/components/practice/ListenMaker";

export default function ListenMakerPage() {
  return (
    <PracticeShell
      title="Listen like a maker"
      description="Three studio clips with a coach. Feel the speed, mark the energy change, then check what you heard — no playlist required."
    >
      <ListenMaker />
    </PracticeShell>
  );
}
