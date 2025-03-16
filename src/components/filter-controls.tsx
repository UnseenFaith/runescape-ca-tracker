"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { memo } from "react";
import type { Boss } from "@/types/achievement";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilterControlsProps {
  bosses: Boss[];
  categories: string[];
  tiers: string[];
  selectedBoss: string;
  selectedCategory: string;
  selectedTier: string;
  searchQuery: string;
  showCompleted: boolean;
  showIncomplete: boolean;
  setSelectedBoss: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSelectedTier: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setShowCompleted: (value: boolean) => void;
  setShowIncomplete: (value: boolean) => void;
  completedCount: number;
  totalCount: number;
  completedScore: number;
  onToggleAll: (value: boolean) => void;
}

export const FilterControls = memo(function FilterControls({
  bosses,
  categories,
  tiers,
  selectedBoss,
  selectedCategory,
  selectedTier,
  searchQuery,
  showCompleted,
  showIncomplete,
  setSelectedBoss,
  setSelectedCategory,
  setSelectedTier,
  setSearchQuery,
  setShowCompleted,
  setShowIncomplete,
  completedCount,
  totalCount,
  completedScore,
  onToggleAll,
}: FilterControlsProps) {
  const achievementProgress = (completedCount / totalCount) * 100;

  // Define milestone points
  const milestones = [
    { score: 19, label: "Easy" },
    { score: 135, label: "Medium" },
    { score: 654, label: "Hard" },
    { score: 1342, label: "Elite" },
    { score: 1802, label: "Master" },
    { score: 2066, label: "Grandmaster" },
  ];

  // Calculate combat score progress relative to max (2066)
  const combatScoreProgress = (completedScore / 2066) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Achievement Progress Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <p className="text-sm text-muted-foreground">
              Achievement Progress: {completedCount} / {totalCount}
            </p>
          </div>
          <Progress value={achievementProgress} className="h-2" />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleAll(true)}
            className="text-green-600 hover:text-green-700"
          >
            Complete All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleAll(false)}
            className="text-red-600 hover:text-red-700"
          >
            Uncomplete All
          </Button>
        </div>

        {/* Combat Score Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <p className="text-sm text-muted-foreground">
              Combat Score: {completedScore} / 2066
            </p>
          </div>
          <div className="relative pb-6">
            <Progress value={combatScoreProgress} className="h-2" />
            <TooltipProvider>
              {milestones.map(({ score, label }) => (
                <Tooltip key={score}>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute -top-1 cursor-help"
                      style={{
                        left: `${Math.min((score / 2066) * 100, 100)}%`,
                      }}
                    >
                      <div className="w-px h-5 bg-foreground"></div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground">
                        {label}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{score} points required</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="boss">Boss</Label>
          <Select value={selectedBoss} onValueChange={setSelectedBoss}>
            <SelectTrigger>
              <SelectValue placeholder="All Bosses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bosses</SelectItem>
              {bosses
                .filter(
                  (boss) =>
                    selectedCategory === "all" ||
                    boss.category === selectedCategory
                )
                // Might need to memo this later to avoid rerendering?
                // Or change how this component gets these values
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
                .map((boss) => (
                  <SelectItem key={boss.id} value={boss.id}>
                    {boss.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tier">Tier</Label>
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger>
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {tiers.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
          />
          <Label htmlFor="show-completed">Show Completed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-incomplete"
            checked={showIncomplete}
            onCheckedChange={setShowIncomplete}
          />
          <Label htmlFor="show-incomplete">Show Incomplete</Label>
        </div>
      </div>
    </div>
  );
});
