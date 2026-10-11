'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { isGoalSlug, type GoalSlug } from '@/lib/goals';

const STORAGE_KEY = 'mh.goal';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface GoalContextValue {
  goal: GoalSlug | null;
  setGoal: (goal: GoalSlug) => void;
}

const GoalContext = createContext<GoalContextValue | null>(null);

function readStoredGoal(): GoalSlug | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isGoalSlug(stored)) return stored;
  } catch {
    // localStorage ใช้ไม่ได้ (private mode ฯลฯ) ลองอ่าน cookie แทน
  }
  const match = document.cookie.match(/(?:^|;\s*)mh_goal=([^;]+)/);
  return match && isGoalSlug(match[1]) ? match[1] : null;
}

/** เป้าหมายที่ผู้ใช้เลือก จำไว้ใน localStorage + cookie (cookie เผื่อให้ server อ่านได้ภายหลัง) */
export function GoalProvider({ children }: { children: ReactNode }) {
  const [goal, setGoalState] = useState<GoalSlug | null>(null);

  useEffect(() => {
    setGoalState(readStoredGoal());
  }, []);

  const setGoal = useCallback((next: GoalSlug) => {
    setGoalState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ไม่เป็นไร ยังมี cookie
    }
    document.cookie = `mh_goal=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  }, []);

  return <GoalContext.Provider value={{ goal, setGoal }}>{children}</GoalContext.Provider>;
}

export function useGoal(): GoalContextValue {
  const ctx = useContext(GoalContext);
  if (!ctx) throw new Error('useGoal must be used inside <GoalProvider>');
  return ctx;
}
