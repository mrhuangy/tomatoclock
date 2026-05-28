import type { Phase } from '../hooks/usePomodoroTimer';
import { formatTime } from '../utils/time';

type TimerCircleProps = {
  phase: Phase;
  progress: number;
  remainingSeconds: number;
  totalSeconds: number;
};

const RADIUS = 128;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerCircle({
  phase,
  progress,
  remainingSeconds,
  totalSeconds,
}: TimerCircleProps) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const percent = Math.round((1 - remainingSeconds / totalSeconds) * 100);

  return (
    <div className="timer-circle" aria-label={`当前进度 ${percent}%`}>
      <svg className="timer-circle__svg" viewBox="0 0 320 320" role="img">
        <title>番茄钟倒计时进度</title>
        <circle className="timer-circle__track" cx="160" cy="160" r={RADIUS} />
        <circle
          className={`timer-circle__progress timer-circle__progress--${phase}`}
          cx="160"
          cy="160"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="timer-circle__content">
        <span className="timer-circle__time">{formatTime(remainingSeconds)}</span>
        <span className="timer-circle__meta">{percent}%</span>
      </div>
    </div>
  );
}
