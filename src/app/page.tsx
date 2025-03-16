import { AchievementTracker } from "@/components/achievement-tracker";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-500 to-red-600 text-transparent bg-clip-text">
              Runescape Combat Achievements
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Track and search through your combat achievements
            </p>
          </div>
          <AchievementTracker />
        </div>
      </main>
    </div>
  );
}
