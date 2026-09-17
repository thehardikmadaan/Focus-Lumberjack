import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppStore, type TimerPhase } from '../store/useAppStore';

export function useTimer() {
  const {
    settings,
    timerPhase,
    timerStatus,
    currentCycle,
    startedAt,
    pausedAt,
    accumulatedPausedTime,
    expectedEndTime,
    activeTaskId,
    setTimerState,
    resetTimer,
    addSession,
    updateTaskFocusTime,
  } = useAppStore();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPhaseDuration = useCallback((phase: TimerPhase) => {
    switch (phase) {
      case 'focus': return settings.focusDuration;
      case 'short_break': return settings.shortBreakDuration;
      case 'long_break': return settings.longBreakDuration;
    }
  }, [settings]);

  // Sync timeLeft when idle
  useEffect(() => {
    if (timerStatus === 'idle') {
      setTimeLeft(getPhaseDuration(timerPhase));
    }
  }, [timerStatus, timerPhase, getPhaseDuration]);

  const handleSessionComplete = useCallback(() => {
    if (!startedAt) return;

    const now = Date.now();
    const plannedDuration = getPhaseDuration(timerPhase);

    // Add completed session
    addSession({
        id: crypto.randomUUID(),
        type: timerPhase,
        plannedDuration,
        actualDuration: plannedDuration,
        startedAt,
        endedAt: now,
        completed: true,
        taskId: activeTaskId || undefined,
    });

    if (timerPhase === 'focus' && activeTaskId) {
        updateTaskFocusTime(activeTaskId, plannedDuration);
    }

    // Determine next phase
    let nextPhase: TimerPhase = 'focus';
    let nextCycle = currentCycle;

    if (timerPhase === 'focus') {
        if (currentCycle >= settings.cyclesBeforeLongBreak) {
            nextPhase = 'long_break';
            nextCycle = 1;
        } else {
            nextPhase = 'short_break';
            // don't increment cycle until they start the next focus, or increment it here?
            // usually cycle increments after focus.
        }
    } else {
        // Was a break, go back to focus
        nextPhase = 'focus';
        if (timerPhase === 'short_break') {
            nextCycle = currentCycle + 1;
        }
    }

    // Handle Auto-start logic
    const shouldAutoStart =
        (nextPhase === 'focus' && settings.autoStartFocus) ||
        (nextPhase !== 'focus' && settings.autoStartBreaks);

    if (shouldAutoStart) {
        const durationMs = getPhaseDuration(nextPhase) * 1000;
        setTimerState({
            timerPhase: nextPhase,
            timerStatus: 'running',
            currentCycle: nextCycle,
            startedAt: Date.now(),
            pausedAt: null,
            accumulatedPausedTime: 0,
            expectedEndTime: Date.now() + durationMs,
        });
    } else {
        setTimerState({
            timerPhase: nextPhase,
            timerStatus: 'idle',
            currentCycle: nextCycle,
            startedAt: null,
            pausedAt: null,
            accumulatedPausedTime: 0,
            expectedEndTime: null,
        });
    }

    // Optional: Play sound or notification here
    if (Notification.permission === 'granted') {
       new Notification('Session Complete!', {
           body: timerPhase === 'focus' ? 'Time for a break!' : 'Time to focus!',
       });
    }
  }, [startedAt, timerPhase, getPhaseDuration, currentCycle, settings.cyclesBeforeLongBreak, settings.autoStartFocus, settings.autoStartBreaks, addSession, setTimerState, activeTaskId, updateTaskFocusTime]);

  // Main tick loop
  useEffect(() => {
    if (timerStatus === 'running' && expectedEndTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((expectedEndTime - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          // Trigger completion logic via state or ref if needed, to avoid dependency issues
          handleSessionComplete();
        }
      }, 200); // 200ms tick for smooth UI updates without drift
    } else if (timerStatus === 'paused' && pausedAt && expectedEndTime) {
       // if paused, calculate what time is left based on when we paused
       const remaining = Math.max(0, Math.ceil((expectedEndTime - pausedAt) / 1000));
       setTimeLeft(remaining);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerStatus, expectedEndTime, pausedAt, handleSessionComplete]);

  const startTimer = useCallback(() => {
    const now = Date.now();
    const durationMs = getPhaseDuration(timerPhase) * 1000;

    if (timerStatus === 'idle') {
      setTimerState({
        timerStatus: 'running',
        startedAt: now,
        expectedEndTime: now + durationMs,
        accumulatedPausedTime: 0,
        pausedAt: null,
      });
    } else if (timerStatus === 'paused' && pausedAt && expectedEndTime) {
      // Resume
      const pauseDuration = now - pausedAt;
      setTimerState({
        timerStatus: 'running',
        expectedEndTime: expectedEndTime + pauseDuration,
        accumulatedPausedTime: accumulatedPausedTime + pauseDuration,
        pausedAt: null,
      });
    }
  }, [timerStatus, timerPhase, getPhaseDuration, pausedAt, expectedEndTime, accumulatedPausedTime, setTimerState]);

  const pauseTimer = useCallback(() => {
    if (timerStatus === 'running') {
      setTimerState({
        timerStatus: 'paused',
        pausedAt: Date.now(),
      });
    }
  }, [timerStatus, setTimerState]);

  const stopTimer = useCallback(() => {
      // Save session as uncompleted if it was a focus session and started
      if (timerStatus !== 'idle' && startedAt) {
          const now = Date.now();
          const actualDuration = Math.floor((now - startedAt - accumulatedPausedTime) / 1000);
          const finalDuration = Math.max(0, actualDuration);

          addSession({
              id: crypto.randomUUID(),
              type: timerPhase,
              plannedDuration: getPhaseDuration(timerPhase),
              actualDuration: finalDuration,
              startedAt,
              endedAt: now,
              completed: false,
              taskId: activeTaskId || undefined,
          });

          if (timerPhase === 'focus' && activeTaskId) {
              updateTaskFocusTime(activeTaskId, finalDuration);
          }
      }
      resetTimer();
  }, [timerStatus, startedAt, accumulatedPausedTime, timerPhase, getPhaseDuration, addSession, resetTimer, activeTaskId, updateTaskFocusTime]);



  const skipPhase = useCallback(() => {
       // Or treat as 'stopped' depending on logic. Let's treat as completed for now so it moves forward correctly, or maybe stopTimer and manually advance.
      // Usually skipping a break is fine, skipping a focus might just be "leave early".
      // Let's implement skip as stop current (uncompleted) and move to next phase.

      if (timerStatus !== 'idle' && startedAt) {
          const now = Date.now();
          const actualDuration = Math.floor((now - startedAt - accumulatedPausedTime) / 1000);
          const finalDuration = Math.max(0, actualDuration);

          addSession({
              id: crypto.randomUUID(),
              type: timerPhase,
              plannedDuration: getPhaseDuration(timerPhase),
              actualDuration: finalDuration,
              startedAt,
              endedAt: now,
              completed: false, // marked as false because skipped
              taskId: activeTaskId || undefined,
          });

          if (timerPhase === 'focus' && activeTaskId) {
              updateTaskFocusTime(activeTaskId, finalDuration);
          }
      }

      // Determine next phase (same logic as complete, just code duplication can be cleaned up)
      let nextPhase: TimerPhase = 'focus';
      let nextCycle = currentCycle;

      if (timerPhase === 'focus') {
          if (currentCycle >= settings.cyclesBeforeLongBreak) {
              nextPhase = 'long_break';
              nextCycle = 1;
          } else {
              nextPhase = 'short_break';
          }
      } else {
          nextPhase = 'focus';
          if (timerPhase === 'short_break') {
              nextCycle = currentCycle + 1;
          }
      }

      setTimerState({
          timerPhase: nextPhase,
          timerStatus: 'idle',
          currentCycle: nextCycle,
          startedAt: null,
          pausedAt: null,
          accumulatedPausedTime: 0,
          expectedEndTime: null,
      });

  }, [timerStatus, startedAt, accumulatedPausedTime, timerPhase, getPhaseDuration, addSession, currentCycle, settings.cyclesBeforeLongBreak, setTimerState, activeTaskId, updateTaskFocusTime]);

  // Request Notification permission
  useEffect(() => {
      if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
      }
  }, []);

  return {
    timeLeft,
    timerPhase,
    timerStatus,
    currentCycle,
    startTimer,
    pauseTimer,
    stopTimer,
    skipPhase,
  };
}
