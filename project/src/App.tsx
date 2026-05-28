import { RoundSelector } from './components/RoundSelector';
import { TaskInput } from './components/TaskInput';
import { TimerCircle } from './components/TimerCircle';
import { TimerControls } from './components/TimerControls';
import { TimerStatus } from './components/TimerStatus';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';

export default function App() {
  const {
    state,
    notice,
    phaseLabel,
    totalSeconds,
    progress,
    startOrPause,
    reset,
    skip,
    setCurrentTask,
    setTargetRounds,
  } = usePomodoroTimer();

  return (
    <main className={`app app--${state.phase}`}>
      <section className="task-section" aria-label="任务记录区">
        <TaskInput value={state.currentTask} onChange={setCurrentTask} />
      </section>

      <section className="timer-section" aria-label="核心计时器区">
        <TimerStatus
          completedRounds={state.completedRounds}
          currentTask={state.currentTask}
          phaseLabel={phaseLabel}
          targetRounds={state.targetRounds}
          variant="phase"
        />
        <TimerCircle
          phase={state.phase}
          progress={progress}
          remainingSeconds={state.remainingSeconds}
          totalSeconds={totalSeconds}
        />
        <TimerStatus
          completedRounds={state.completedRounds}
          currentTask={state.currentTask}
          phaseLabel={phaseLabel}
          targetRounds={state.targetRounds}
          variant="details"
        />
      </section>

      <section className="control-section" aria-label="设置与控制区">
        <RoundSelector value={state.targetRounds} onChange={setTargetRounds} />
        <TimerControls
          isRunning={state.isRunning}
          onReset={reset}
          onSkip={skip}
          onStartOrPause={startOrPause}
        />
      </section>

      {notice ? (
        <div className="toast" role="status" aria-live="polite">
          {notice}
        </div>
      ) : null}
    </main>
  );
}
