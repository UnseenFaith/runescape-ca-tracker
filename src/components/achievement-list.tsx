import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getBossColor } from "@/lib/utils";
import { memo, useCallback } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Boss } from "@/types/achievement";

interface AchievementProps {
  achievement: Boss["achievements"][0];
  bossId: string;
  isCompleted: (bossId: string, achievementId: string) => boolean;
  toggleAchievement: (
    bossId: string,
    achievementId: string,
    newValue: boolean
  ) => void;
}

const Achievement = memo(function Achievement({
  achievement,
  bossId,
  isCompleted,
  toggleAchievement,
}: AchievementProps) {
  const completed = isCompleted(bossId, achievement.id);
  const toggle = useCallback(
    (newValue: boolean) => {
      toggleAchievement(bossId, achievement.id, newValue);
    },
    [toggleAchievement, bossId, achievement.id]
  );

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border p-3 ${
        completed ? "bg-green-50 dark:bg-green-950/20" : ""
      }`}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => toggle(Boolean(checked ?? false))}
        className="mt-1 border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-primary-foreground"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4
            className={`font-medium font-display ${
              completed ? "text-muted-foreground line-through" : ""
            }`}
          >
            {achievement.name}
          </h4>
          <Badge
            className={`${
              achievement.tier === "Easy"
                ? "bg-blue-500 hover:bg-blue-600"
                : achievement.tier === "Medium"
                ? "bg-green-500 hover:bg-green-600"
                : achievement.tier === "Hard"
                ? "bg-red-500 hover:bg-red-600"
                : achievement.tier === "Elite"
                ? "bg-purple-500 hover:bg-purple-600"
                : achievement.tier === "Master"
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-semibold`}
          >
            {achievement.tier}
          </Badge>
        </div>
        <p
          className={`mt-1 text-sm font-display text-balance ${
            completed ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {achievement.description}
        </p>
      </div>
    </div>
  );
});

interface AchievementListProps {
  filteredBosses: Boss[];
  toggleAchievement: (
    bossId: string,
    achievementId: string,
    newValue: boolean
  ) => void;
  isCompleted: (bossId: string, achievementId: string) => boolean;
  tier?: string;
}

export const AchievementList = memo(function AchievementList({
  filteredBosses,
  toggleAchievement,
  isCompleted,
  tier,
}: AchievementListProps) {
  const rowVirtualizer = useWindowVirtualizer({
    count: filteredBosses.length,
    estimateSize: useCallback(
      (index) => {
        const boss = filteredBosses[index];
        if (tier !== "all") {
          return (
            80 +
            boss.achievements.filter((a) => a.tier === tier).length * 98 +
            32
          );
        }
        return 80 + boss.achievements.length * 98 + 32;
      },
      [filteredBosses, tier]
    ),
    overscan: 5,
  });

  if (filteredBosses.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No achievements found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
        padding: "1rem 0",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const boss = filteredBosses[virtualRow.index];
        return (
          <div
            key={boss.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Card
              className={`border-l-4 space-y-4 ${
                boss.achievements.every((achievement) =>
                  isCompleted(boss.id, achievement.id)
                )
                  ? "border-l-green-500"
                  : "border-l-yellow-500"
              }`}
            >
              <CardHeader
                className={`bg-gradient-to-r ${getBossColor(boss.id)}`}
              >
                <div className="flex justify-between items-center">
                  <CardTitle>{boss.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    {boss.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {boss.achievements.map((achievement) => (
                  <Achievement
                    key={achievement.id}
                    achievement={achievement}
                    bossId={boss.id}
                    isCompleted={isCompleted}
                    toggleAchievement={toggleAchievement}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
});
