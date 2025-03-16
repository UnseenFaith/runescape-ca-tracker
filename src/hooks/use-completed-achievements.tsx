"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { achievementsData } from "@/data/achievements";

// Type for the completed achievements data structure
export type CompletedAchievements = {
  [bossId: string]: {
    [achievementId: string]: boolean;
  };
};

export function useCompletedAchievements() {
  const [completedAchievements, setCompletedAchievements] =
    useState<CompletedAchievements>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const loadCompletedAchievements = () => {
      try {
        const savedData = localStorage.getItem("rs-completed-achievements");
        if (savedData) {
          setCompletedAchievements(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load completed achievements:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCompletedAchievements();
  }, []);

  const debouncedSave = useCallback((data: CompletedAchievements) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("rs-completed-achievements", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save completed achievements:", error);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      debouncedSave(completedAchievements);
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [completedAchievements, isLoaded, debouncedSave]);

  const isCompleted = useCallback(
    (bossId: string, achievementId: string): boolean => {
      return Boolean(completedAchievements[bossId]?.[achievementId]);
    },
    [completedAchievements]
  );

  const batchUpdateAchievements = useCallback(
    (
      updates: {
        bossId: string;
        achievementId: string;
        newValue: boolean;
      }[]
    ) => {
      setCompletedAchievements((prev) => {
        const newState = { ...prev };

        updates.forEach(({ bossId, achievementId, newValue }) => {
          if (!newState[bossId]) {
            newState[bossId] = {};
          }

          if (newValue) {
            newState[bossId][achievementId] = true;
          } else {
            delete newState[bossId][achievementId];
            if (Object.keys(newState[bossId]).length === 0) {
              delete newState[bossId];
            }
          }
        });

        return newState;
      });
    },
    []
  );

  const toggleAchievement = useCallback(
    (bossId: string, achievementId: string, newValue: boolean) => {
      batchUpdateAchievements([{ bossId, achievementId, newValue }]);
    },
    [batchUpdateAchievements]
  );

  const getCompletedCount = useCallback((): number => {
    return Object.values(completedAchievements).reduce(
      (total, bossAchievements) => total + Object.keys(bossAchievements).length,
      0
    );
  }, [completedAchievements]);

  const getCompletedScore = useCallback((): number => {
    return achievementsData.reduce((totalScore, boss) => {
      const bossAchievements = completedAchievements[boss.id] || {};
      return (
        totalScore +
        boss.achievements.reduce((bossScore, achievement) => {
          if (bossAchievements[achievement.id]) {
            return bossScore + achievement.score;
          }
          return bossScore;
        }, 0)
      );
    }, 0);
  }, [completedAchievements]);

  const resetAll = useCallback(() => {
    setCompletedAchievements({});
  }, []);

  return {
    isCompleted,
    toggleAchievement,
    batchUpdateAchievements,
    getCompletedCount,
    getCompletedScore,
    resetAll,
    isLoaded,
  };
}
