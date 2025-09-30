export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  goal: 'lose_fat' | 'maintain_weight' | 'build_muscle' | 'gain_weight';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  dietType: 'anything' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'carnivore';
  allergies: string[];
  dislikes: string[];
  favorites: string[];
  mealsPerDay: number;
  includeSnacks: boolean;
  includeSmoothies: boolean;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: DayMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: Date;
}

export interface DayMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'smoothie';
  recipes: Recipe[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface Recipe {
  id: number;
  name: string;
  image: string;
  category: string;
  totalTime: number;
  caloriesPerServing: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
}

export interface WeeklyPlan {
  userId: string;
  weekStart: string;
  days: MealPlan[];
  weeklyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}