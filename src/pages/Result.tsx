import idealsData from "../data/ideals.json";
import encyclopedia from "../data/encyclopedia.json";
import { DIMENSIONS } from "../data/dimensions";
import { loadAnswers } from "../lib/storage";
import { buildUserVec, computeTypeScores, pickMainSecond, checkConsistency } from "../lib/scoring";
import RadarChart from "../components/RadarChart";
import TopBarChart from "../components/TopBarChart";
import { dimMeaning, explainWhy, neighborDiff, typeName, typeSummary } from "../lib/text";

export default function Result() {
  const answers = loadAnswers();
  const userVec = buildUserVec(answers);
  const scores = computeTypeScores(userVec, answers);
  const pick = pickMainSecond(scores);
  const consistency = checkConsistency(answers);

  const mainId = pick.mainId;
  const secondId = pick.secondId;

  const types = (idealsData as any).types;
  const mainIdeal = types.find((x: any) => x.id === mainId)?.ideal ?? [50, 50, 50, 50, 50, 50];
  const secondIdeal = secondId ? types.find((x: any) => x.id === secondId)?.ideal : undefined;

  const top5Labels = pick.top5.map(([id]) => typeName(id));
  const top5Values = pick.top5.map(([, v]) => Math.round(v));

  const neighbor = pick.sorted.find(([id]) => id !== mainId && id !== secondId)?.[0];
  const neighborIdeal = neighbor ? types.find((x: any) => x.id === neighbor)?.ideal : undefined;

  const mainSummary = typeSummary(mainId);

  return (
    <div className="card">
      <h2>结果</h2>

      <div className="row">
        <div className="card">
          <h3>核心派别</h3>
          <p style={{ marginTop: 6 }}>
            <b>{typeName(mainId)}</b>
            {secondId ? (
              <>
                {" "}
                <span className="small">（混合：次派别为 </span>
                <b>{typeName(secondId)}</b>
                <span className="small">）</span>
              </>
            ) : null}
          </p>
          <div className="hr" />
          {mainSummary.map((s, idx) => (
            <p key={idx} className="small">{s}</p>
          ))}
          <div className="hr" />
          <div className="small">{consistency.flag ? consistency.note : " "}</div>
        </div>

        <div className="card">
          <h3>派别分布（Top 5）</h3>
          <TopBarChart labels={top5Labels} values={top5Values} />
          <div className="small">分数表示“接近度”（0–100），不是“对错”。</div>
        </div>
      </div>

      <div className="hr" />

      <div className="card">
        <h3>立场图谱（6维）</h3>
        <RadarChart
          userVec={userVec}
          mainVec={mainIdeal}
          secondVec={secondIdeal}
          mainName={typeName(mainId)}
          secondName={secondId ? typeName(secondId) : undefined}
        />
        <div className="small">实线为你的得分；虚线为派别典型取向。</div>
      </div>

      <div className="hr" />

      <div className="card">
        <h3>核心变量得分</h3>
        {userVec.map((v, i) => {
          const m = dimMeaning(i, v);
          return (
            <div key={i} className="q">
              <p><b>{DIMENSIONS[i].name}</b>：{Math.round(v)}/100</p>
              <p className="small">这个指标在问：{DIMENSIONS[i].left} ↔ {DIMENSIONS[i].right}</p>
              <p className="small">你的倾向：{m.band}</p>
            </div>
          );
        })}
      </div>

      <div className="hr" />

      <div className="row">
        <div className="card">
          <h3>为什么是这个派别</h3>
          {explainWhy(mainId, secondId, userVec).map((t, idx) => (
            <p key={idx} className="small">{t}</p>
          ))}
        </div>

        <div className="card">
          <h3>与你相邻派别的差异点</h3>
          {neighbor && neighborIdeal ? (
            <>
              <p className="small">相邻派别：<b>{typeName(neighbor)}</b></p>
              <div className="hr" />
              {neighborDiff(userVec, neighborIdeal).map((t, idx) => (
                <p key={idx} className="small">{t}</p>
              ))}
            </>
          ) : (
            <p className="small">未找到足够的相邻派别信息。</p>
          )}
        </div>
      </div>

      <div className="hr" />

      <div className="card">
        <h3>你的核心派别：定义与指标表现</h3>
        {(() => {
          const entry = (encyclopedia as any)[mainId];
          if (!entry) return <p className="small">无。</p>;
          return (
            <>
              <p className="small"><b>关注：</b>{entry.focus.join(" / ")}</p>
              <p className="small"><b>核心特点：</b>{entry.traits.join(" / ")}</p>
              <div className="hr" />
              {DIMENSIONS.map((d) => (
                <div key={d.key} className="q">
                  <p><b>{d.name}</b></p>
                  <p className="small">{entry.profile[d.key]}</p>
                </div>
              ))}
            </>
          );
        })()}
      </div>
    </div>
  );
}
