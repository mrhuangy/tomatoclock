import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playBeep, prepareAudio, speak } from '../utils/audio';
import { formatTime } from '../utils/time';

export type Phase = 'focus' | 'shortBreak' | 'longBreak';

export type TimerState = {
  currentTask: string;
  phase: Phase;
  remainingSeconds: number;
  completedRounds: number;
  targetRounds: number;
  isRunning: boolean;
};

export const DURATIONS: Record<Phase, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const STORAGE_KEY = 'pomodoro-timer-state';

const PHASE_LABELS: Record<Phase, string> = {
  focus: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
};

const INITIAL_STATE: TimerState = {
  currentTask: '',
  phase: 'focus',
  remainingSeconds: DURATIONS.focus,
  completedRounds: 0,
  targetRounds: 4,
  isRunning: false,
};

function loadInitialState(): TimerState {
  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return INITIAL_STATE;
    }

    const parsedState = JSON.parse(rawState) as Partial<TimerState>;
    const phase = parsedState.phase ?? INITIAL_STATE.phase;

    if (!['focus', 'shortBreak', 'longBreak'].includes(phase)) {
      return INITIAL_STATE;
    }

    return {
      currentTask: parsedState.currentTask ?? '',
      phase,
      remainingSeconds: Math.min(
        Math.max(parsedState.remainingSeconds ?? DURATIONS[phase], 0),
        DURATIONS[phase],
      ),
      completedRounds: Math.min(Math.max(parsedState.completedRounds ?? 0, 0), 8),
      targetRounds: Math.min(Math.max(parsedState.targetRounds ?? 4, 1), 8),
      isRunning: false,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function usePomodoroTimer() {
  const [state, setState] = useState<TimerState>(loadInitialState);
  const [notice, setNotice] = useState('');
  const endAtRef = useRef<number | null>(null);
  const stateRef = useRef(state);

  const phaseLabel = state.phase === 'focus' && !state.isRunning
    ? '准备专注'
    : state.isRunning
      ? `${PHASE_LABELS[state.phase]}中`
      : `${PHASE_LABELS[state.phase]}已暂停`;

  const totalSeconds = DURATIONS[state.phase];
  const progress = useMemo(() => {
    return 1 - state.remainingSeconds / totalSeconds;
  }, [state.remainingSeconds, totalSeconds]);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => {
      setNotice('');
    }, 2400);
  }, []);

  const completePhase = useCallback((options?: { silent?: boolean }) => {
    const current = stateRef.current;
    let nextCompletedRounds = current.completedRounds;
    let nextPhase: Phase;
    let message: string;

    if (current.phase === 'focus') {
      nextCompletedRounds += 1;

      if (nextCompletedRounds >= current.targetRounds) {
        nextPhase = 'longBreak';
        message = '专注时间结束，进入长休息';
      } else {
        nextPhase = 'shortBreak';
        message = '专注时间结束，休息一下吧';
      }
    } else if (current.phase === 'shortBreak') {
      nextPhase = 'focus';
      message = '休息结束，继续加油';
    } else {
      nextCompletedRounds = 0;
      nextPhase = 'focus';
      message = '长休息结束，新一轮番茄钟即将开始';
    }

    if (!options?.silent) {
      playBeep();
      speak(message);
      showNotice(message);
    }

    endAtRef.current = Date.now() + DURATIONS[nextPhase] * 1000;

    setState({
      ...current,
      phase: nextPhase,
      remainingSeconds: DURATIONS[nextPhase],
      completedRounds: nextCompletedRounds,
      isRunning: true,
    });
  }, [showNotice]);

  const startOrPause = useCallback(() => {
    prepareAudio();

    setState((current) => {
      if (!current.isRunning && current.phase === 'focus' && !current.currentTask.trim()) {
        showNotice('请先输入当前任务');
        return current;
      }

      if (current.isRunning) {
        playBeep();
        endAtRef.current = null;
        return {
          ...current,
          isRunning: false,
        };
      }

      playBeep();
      endAtRef.current = Date.now() + current.remainingSeconds * 1000;

      return {
        ...current,
        isRunning: true,
      };
    });
  }, [showNotice]);

  const reset = useCallback(() => {
    setState((current) => {
      endAtRef.current = null;

      return {
        ...current,
        remainingSeconds: DURATIONS[current.phase],
        isRunning: false,
      };
    });
  }, []);

  const skip = useCallback(() => {
    completePhase();
  }, [completePhase]);

  const setCurrentTask = useCallback((currentTask: string) => {
    setState((current) => ({
      ...current,
      currentTask,
    }));
  }, []);

  const setTargetRounds = useCallback((targetRounds: number) => {
    const normalizedRounds = Math.min(Math.max(targetRounds, 1), 8);

    setState((current) => ({
      ...current,
      targetRounds: normalizedRounds,
      completedRounds: Math.min(current.completedRounds, normalizedRounds),
    }));
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        isRunning: false,
      }),
    );
  }, [state]);

  useEffect(() => {
    if (!state.isRunning) {
      document.title = '番茄钟';
      return;
    }

    document.title = `[${formatTime(state.remainingSeconds)}] ${PHASE_LABELS[state.phase]}`;
  }, [state.isRunning, state.phase, state.remainingSeconds]);

  useEffect(() => {
    if (!state.isRunning) {
      return undefined;
    }

    if (!endAtRef.current) {
      endAtRef.current = Date.now() + state.remainingSeconds * 1000;
    }

    const intervalId = window.setInterval(() => {
      const endAt = endAtRef.current;

      if (!endAt) {
        return;
      }

      const nextRemainingSeconds = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));

      setState((current) => ({
        ...current,
        remainingSeconds: nextRemainingSeconds,
      }));

      if (nextRemainingSeconds <= 0) {
        window.clearInterval(intervalId);
        completePhase();
      }
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [completePhase, state.isRunning, state.remainingSeconds]);

  return {
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
  };
}
