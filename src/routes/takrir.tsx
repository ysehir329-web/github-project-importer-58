import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Check } from "@/components/app/icons";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { groupLabel } from "@/lib/groups";
import { localIso } from "@/lib/utils";

export const Route = createFileRoute("/takrir")({
  head: () => ({ meta: [
    { title: "Takrir — Kur'an Kursu" },
    { name: "description", content: "Takrir yapılan günleri oluşturun ve talebelerin takrir verdiğini kaydedin." },
    { property: "og:title", content: "Takrir — Kur'an Kursu" },
    { property: "og:description", content: "Takrir günleri ve talebelerin takrir kayıtları." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Takrir,
});

function Takrir() {
  const { students, takrirler, addTakrirDay, markTakrir, removeTakrirDay, group } = useStore();
  const [date, setDate] = useState(localIso());
  const session = takrirler.find((d) => d.date === date);
  const verdiCount = students.filter((s) => session?.results[s.id] === true).length;

  return <>
    <Button variant="ghost" size="sm" asChild className="mt-3"><Link to="/menu"><ArrowLeft /> Menü</Link></Button>
    <h2 className="mt-3 font-serif text-3xl font-bold">Takrir</h2>
    <p className="mt-1 text-sm text-muted-foreground">{groupLabel(group)} Grubu</p>
    <div className="mt-4 flex items-center justify-between gap-2">
      <label className="flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 py-2">
        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input aria-label="Takrir tarihi" type="date" value={date} onChange={(e) => { if (e.target.value) setDate(e.target.value); }} className="min-w-0 bg-transparent text-sm text-foreground" />
      </label>
      {session ? <Button variant="outline" size="sm" onClick={() => { if (confirm("Bu günün takririni silmek istiyor musunuz?")) removeTakrirDay(date); }}>Sil</Button>
        : <Button size="sm" disabled={!students.length} onClick={() => addTakrirDay(date)}>Takrir Oluştur</Button>}
    </div>
    {!students.length ? <p className="mt-6 text-center text-sm text-muted-foreground">Henüz talebe yok.</p>
      : !session ? <p className="mt-6 text-center text-sm text-muted-foreground">Bu gün takrir yok.</p>
      : <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <div className="bg-brand-soft px-3 py-3 text-sm"><span className="font-semibold">{verdiCount} verdi</span><span className="text-muted-foreground"> · {students.length - verdiCount} vermedi</span></div>
        {students.map((s) => {
          const verdi = session.results[s.id] === true;
          return <div key={s.id} className="flex items-center gap-3 border-t border-border px-3 py-3">
            <Link to="/talebe/$name" params={{ name: s.id }} className="min-w-0 flex-1 break-words text-sm hover:text-primary hover:underline">{s.name}</Link>
            <Button variant="outline" size="sm" aria-label={`${s.name} Takrir Verdi`} aria-pressed={verdi} onClick={() => markTakrir(date, s.id, !verdi)} className={`w-24 shrink-0 ${verdi ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}`}>
              <Check className={verdi ? "opacity-100" : "opacity-0"} /> Verdi
            </Button>
          </div>;
        })}
      </div>}
  </>;
}