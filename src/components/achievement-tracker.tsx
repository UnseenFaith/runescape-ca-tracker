"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterControls } from "@/components/filter-controls";
import { AchievementList } from "@/components/achievement-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { achievementsData } from "@/data/achievements";
import { useCompletedAchievements } from "@/hooks/use-completed-achievements";
import type { Boss } from "@/types/achievement";

export function AchievementTracker() {
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [filteredBosses, setFilteredBosses] = useState<Boss[]>([]);
  const [selectedBoss, setSelectedBoss] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showIncomplete, setShowIncomplete] = useState<boolean>(true);

  const {
    isCompleted,
    toggleAchievement,
    batchUpdateAchievements,
    getCompletedCount,
    getCompletedScore,
  } = useCompletedAchievements();

  // Initialize data
  useEffect(() => {
    setBosses(achievementsData);
    setFilteredBosses(achievementsData);
  }, []);

  useEffect(() => {
    let result = [...bosses];

    if (selectedCategory !== "all") {
      result = result.filter((boss) => boss.category === selectedCategory);
    }

    if (selectedBoss !== "all") {
      result = result.filter((boss) => boss.id === selectedBoss);
    }

    // Come back and fix search query, causes a lot of lag
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result
        .map((boss) => ({
          ...boss,
          achievements: boss.achievements.filter(
            (achievement) =>
              achievement.name.toLowerCase().includes(query) ||
              achievement.description.toLowerCase().includes(query)
          ),
        }))
        .filter((boss) => boss.achievements.length > 0);
    }

    if (selectedTier !== "all") {
      result = result
        .map((boss) => ({
          ...boss,
          achievements: boss.achievements.filter(
            (achievement) => achievement.tier === selectedTier
          ),
        }))
        .filter((boss) => boss.achievements.length > 0);
    }

    result = result
      .map((boss) => ({
        ...boss,
        achievements: boss.achievements.filter(
          (achievement) =>
            (showCompleted && isCompleted(boss.id, achievement.id)) ||
            (showIncomplete && !isCompleted(boss.id, achievement.id))
        ),
      }))
      .filter((boss) => boss.achievements.length > 0);

    setFilteredBosses(result);
  }, [
    bosses,
    selectedBoss,
    selectedCategory,
    selectedTier,
    searchQuery,
    showCompleted,
    showIncomplete,
    isCompleted,
  ]);

  /*
  const tiers = Array.from(
    new Set(bosses.flatMap((boss) => boss.achievements.map((a) => a.tier)))
  ).sort();
  */

  const tiers = ["Easy", "Medium", "Hard", "Elite", "Master", "Grandmaster"];

  const categories = Array.from(
    new Set(bosses.map((boss) => boss.category))
  ).sort();

  const totalCount = bosses.reduce(
    (acc, boss) => acc + boss.achievements.length,
    0
  );

  const toggleAllVisible = useCallback(
    (newValue: boolean) => {
      const updates = filteredBosses.flatMap((boss) =>
        boss.achievements.map((achievement) => ({
          bossId: boss.id,
          achievementId: achievement.id,
          newValue,
        }))
      );
      batchUpdateAchievements(updates);
    },
    [filteredBosses, batchUpdateAchievements]
  );

  return (
    <div className="space-y-6 pb-8">
      <FilterControls
        bosses={bosses}
        categories={categories}
        tiers={tiers}
        selectedBoss={selectedBoss}
        selectedCategory={selectedCategory}
        selectedTier={selectedTier}
        searchQuery={searchQuery}
        showCompleted={showCompleted}
        showIncomplete={showIncomplete}
        setSelectedBoss={setSelectedBoss}
        setSelectedCategory={setSelectedCategory}
        setSelectedTier={setSelectedTier}
        setSearchQuery={setSearchQuery}
        setShowCompleted={setShowCompleted}
        setShowIncomplete={setShowIncomplete}
        completedCount={getCompletedCount()}
        totalCount={totalCount}
        completedScore={getCompletedScore()}
        onToggleAll={toggleAllVisible}
      />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-green-100 dark:bg-green-950/30">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-green-200 dark:data-[state=active]:bg-green-900/50"
          >
            List View
          </TabsTrigger>
          {/* Disabled grid view for now because it doesn't work/needs to be changed */}
          <TabsTrigger
            disabled
            value="grid"
            className="data-[state=active]:bg-green-200 dark:data-[state=active]:bg-green-900/50"
          >
            Grid View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <AchievementList
            filteredBosses={filteredBosses}
            toggleAchievement={toggleAchievement}
            isCompleted={isCompleted}
            tier={selectedTier}
          />
        </TabsContent>
        {/*<TabsContent value="grid">
          <AchievementGrid
            filteredBosses={filteredBosses}
            toggleAchievement={toggleAchievement}
            isCompleted={isCompleted}
          />
        </TabsContent>*/}
      </Tabs>
    </div>
  );
}
