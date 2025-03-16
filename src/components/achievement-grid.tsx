import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getBossColor } from "@/lib/utils";
import { memo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Boss } from "@/types/achievement";

interface AchievementGridProps {
  filteredBosses: Boss[];
  toggleAchievement: (
    bossId: string,
    achievementId: string,
    newValue: boolean
  ) => void;
  isCompleted: (bossId: string, achievementId: string) => boolean;
}


// Achievement Grid is completely broken, needs to be fixed at a later date

export const AchievementGrid = memo(function AchievementGrid({
  filteredBosses,
  toggleAchievement,
  isCompleted,
}: AchievementGridProps) {
  const columnCount = Math.max(1, Math.floor(window.innerWidth / 400));

  const rowVirtualizer = useWindowVirtualizer({
    count: Math.ceil(filteredBosses.length / columnCount),
    estimateSize: () => 300,
    overscan: 5,
  });

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {items.map((virtualRow) => (
        <div
          key={virtualRow.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: columnCount }).map((_, columnIndex) => {
              const boss =
                filteredBosses[virtualRow.index * columnCount + columnIndex];
              if (!boss) return null;

              return (
                <Card
                  key={boss.id}
                  className={`border-l-4 ${
                    boss.achievements.every((achievement) =>
                      isCompleted(boss.id, achievement.id)
                    )
                      ? "border-l-green-500"
                      : boss.achievements.some((achievement) =>
                          isCompleted(boss.id, achievement.id)
                        )
                      ? "border-l-amber-500"
                      : "border-l-red-500"
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
                      <div
                        key={achievement.id}
                        className={`flex items-start gap-2 rounded-lg border p-3 ${
                          isCompleted(boss.id, achievement.id)
                            ? "bg-green-50 dark:bg-green-950/20"
                            : ""
                        }`}
                      >
                        <Checkbox
                          checked={isCompleted(boss.id, achievement.id)}
                          onCheckedChange={(checked) =>
                            toggleAchievement(
                              boss.id,
                              achievement.id,
                              Boolean(checked ?? false)
                            )
                          }
                          className="mt-1 border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-primary-foreground"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-medium font-display ${
                                isCompleted(boss.id, achievement.id)
                                  ? "text-muted-foreground line-through"
                                  : ""
                              }`}
                            >
                              {achievement.name}
                            </h4>
                            <Badge
                              className={`${
                                achievement.tier === "Easy"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : achievement.tier === "Medium"
                                  ? "bg-blue-500 hover:bg-blue-600"
                                  : achievement.tier === "Hard"
                                  ? "bg-amber-500 hover:bg-amber-600"
                                  : achievement.tier === "Elite"
                                  ? "bg-purple-500 hover:bg-purple-600"
                                  : achievement.tier === "Master"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-yellow-500 hover:bg-yellow-600"
                              } text-white`}
                            >
                              {achievement.tier}
                            </Badge>
                          </div>
                          <p
                            className={`mt-1 text-sm font-display text-balance ${
                              isCompleted(boss.id, achievement.id)
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});
