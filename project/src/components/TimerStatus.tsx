type TimerStatusProps = {
  completedRounds: number;
  currentTask: string;
  phaseLabel: string;
  targetRounds: number;
  variant?: 'full' | 'phase' | 'details';
};

export function TimerStatus({
  completedRounds,
  currentTask,
  phaseLabel,
  targetRounds,
  variant = 'full',
}: TimerStatusProps) {
  if (variant === 'phase') {
    return (
      <div className="timer-status timer-status--phase-only">
        <div className="timer-status__phase">{phaseLabel}</div>
      </div>
    );
  }

  if (variant === 'details') {
    return (
      <div className="timer-status timer-status--details">
        <div className="timer-status__task">
          {currentTask.trim() ? currentTask : '输入一个任务后开始专注'}
        </div>
        <div className="timer-status__rounds">
          已完成 {completedRounds} / {targetRounds} 轮
        </div>
      </div>
    );
  }

  return (
    <div className="timer-status">
      <div className="timer-status__phase">{phaseLabel}</div>
      <div className="timer-status__task">
        {currentTask.trim() ? currentTask : '输入一个任务后开始专注'}
      </div>
      <div className="timer-status__rounds">
        已完成 {completedRounds} / {targetRounds} 轮
      </div>
    </div>
  );
}
