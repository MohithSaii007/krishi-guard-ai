import { createFileRoute } from "@tanstack/react-router";
import { slides } from "@/components/deck/slides";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "KRISHI-GUARD AI — Printable Deck" },
      {
        name: "description",
        content: "Print-ready version of the KRISHI-GUARD AI smart farming pitch deck.",
      },
      { property: "og:title", content: "KRISHI-GUARD AI — Printable Deck" },
      {
        property: "og:description",
        content: "Export the KRISHI-GUARD AI pitch deck as a PDF handout.",
      },
    ],
  }),
  component: PrintDeck,
});

function PrintDeck() {
  return (
    <main className="bg-charcoal">
      {slides.map(({ id, Component }) => (
        <div key={id} className="print-slide flex justify-center">
          <Component />
        </div>
      ))}
    </main>
  );
}