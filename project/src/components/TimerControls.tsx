import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';

type TimerControlsProps = {
  isRunning: boolean;
  onReset: () => void;
  onSkip: () => void;
  onStartOrPause: () => void;
};

export function TimerControls({
  isRunning,
  onReset,
  onSkip,
  onStartOrPause,
}: TimerControlsProps) {
  return (
    <div className="timer-controls" aria-label="计时器控制">
      <button
        className="icon-button"
        type="button"
        onClick={onReset}
        aria-label="重置"
        title="重置"
      >
        <RotateCcw size={22} strokeWidth={2.4} />
      </button>

      <button
        className="primary-button"
        type="button"
        onClick={onStartOrPause}
        aria-label={isRunning ? '暂停' : '开始或继续'}
        title={isRunning ? '暂停' : '开始或继续'}
      >
        {isRunning ? (
          <Pause size={34} fill="currentColor" strokeWidth={2.4} />
        ) : (
          <Play size={34} fill="currentColor" strokeWidth={2.4} />
        )}
      </button>

      <button
        className="icon-button"
        type="button"
        onClick={onSkip}
        aria-label="跳过"
        title="跳过"
      >
        <SkipForward size={22} fill="currentColor" strokeWidth={2.4} />
      </button>
    </div>
  );
}
