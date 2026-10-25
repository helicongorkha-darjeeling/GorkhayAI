export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "reveal mx-auto max-w-2xl text-center" : "reveal max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h-display mt-4 text-4xl md:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-mist">{intro}</p>}
    </div>
  );
}
