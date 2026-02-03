const values = [1, 2, 3, 4, 5, 6, 7] as const;

// 近似 16personalities 的“由大到小再到大”
const sizes = [44, 36, 28, 18, 28, 36, 44];

function sideClass(v: number) {
  if (v <= 3) return "left";
  if (v >= 5) return "right";
  return "mid";
}

export default function Likert({
  value,
  onChange,
  name,
  leftLabel = "同意",
  rightLabel = "不同意"
}: {
  value?: number;
  onChange: (v: number) => void;
  name: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="likertWrap" role="radiogroup" aria-label={name}>
      <div className="likertSide left">{leftLabel}</div>

      <div className="bubbles">
        {values.map((v, idx) => {
          const cls = sideClass(v);
          const selected = value === v;
          return (
            <button
              key={v}
              type="button"
              className={`bubbleBtn ${cls} ${selected ? "selected" : ""}`}
              style={{ width: sizes[idx], height: sizes[idx] }}
              aria-pressed={selected}
              aria-label={`${leftLabel}/${rightLabel}：${v}`}
              onClick={() => onChange(v)}
            >
              <div className="bubbleDot" />
            </button>
          );
        })}
      </div>

      <div className="likertSide right">{rightLabel}</div>
    </div>
  );
}
