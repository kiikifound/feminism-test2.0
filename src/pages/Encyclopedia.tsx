import encyclopedia from "../data/encyclopedia.json";
import idealsData from "../data/ideals.json";
import { DIMENSIONS } from "../data/dimensions";
import { typeName } from "../lib/text";

export default function Encyclopedia() {
  const ids = (idealsData as any).types.map((t: any) => t.id);

  return (
    <div className="card">
      <h2>派别百科</h2>
      <p className="small">每个派别均包含：代表/主张/关注 + 核心特点 + 在6个指标上的典型表现。</p>
      <div className="hr" />

      {ids.map((id: string) => {
        const e = (encyclopedia as any)[id];
        if (!e) return null;
        return (
          <div key={id} className="card" style={{ marginBottom: 14 }}>
            <h3>{typeName(id)}</h3>
            <div className="small">
              {e.summary?.map((s: string, i: number) => <p key={i} className="small">{s}</p>)}
            </div>
            <div className="hr" />
            <p className="small"><b>关注：</b>{e.focus.join(" / ")}</p>
            <p className="small"><b>核心特点：</b>{e.traits.join(" / ")}</p>
            <div className="hr" />
            {DIMENSIONS.map((d) => (
              <div key={d.key} className="q">
                <p><b>{d.name}</b></p>
                <p className="small">{e.profile[d.key]}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
