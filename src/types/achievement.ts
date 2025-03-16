export interface Achievement {
  id: string
  name: string
  description: string
  tier: string
  score: number
}

export interface Boss {
  id: string
  name: string
  category: string
  achievements: Achievement[]
}

