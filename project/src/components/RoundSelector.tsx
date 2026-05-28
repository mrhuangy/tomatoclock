type RoundSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function RoundSelector({ value, onChange }: RoundSelectorProps) {
  return (
    <div className="round-setting">
      <label className="round-selector">
        <span>连续专注轮数</span>
        <select
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {Array.from({ length: 8 }, (_, index) => index + 1).map((round) => (
            <option key={round} value={round}>
              {round} 轮
            </option>
          ))}
        </select>
      </label>
      <div className="round-setting__hint">最后一轮的休息为长休息</div>
    </div>
  );
}
