type TaskInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TaskInput({ value, onChange }: TaskInputProps) {
  return (
    <label className="task-input">
      <span className="task-input__label">当前任务</span>
      <input
        maxLength={80}
        onChange={(event) => onChange(event.target.value)}
        placeholder="当前要做的事情..."
        type="text"
        value={value}
      />
    </label>
  );
}
