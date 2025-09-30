import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, Recipe } from '../types/diet';

// Initialize Gemini AI (you'll need to add your API key)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateMealPlan(userProfile: UserProfile, availableRecipes: Recipe[], days: number = 7) {
    try {
      const prompt = this.createMealPlanPrompt(userProfile, availableRecipes, days);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseMealPlanResponse(text, availableRecipes);
    } catch (error) {
      console.error('AI meal plan generation failed:', error);
      return this.generateFallbackMealPlan(userProfile, availableRecipes, days);
    }
  }

  private createMealPlanPrompt(userProfile: UserProfile, recipes: Recipe[], days: number): string {
    const { age, gender, height, weight, goal, activityLevel, dietType, allergies, dislikes, favorites } = userProfile;
    
    // Calculate BMR and daily calories
    const bmr = this.calculateBMR(weight, height, age, gender);
    const dailyCalories = this.calculateDailyCalories(bmr, activityLevel, goal);
    
    return `
Create a ${days}-day meal plan for a ${age}-year-old ${gender} who is ${height}cm tall and weighs ${weight}kg.

Goals: ${goal}
Activity Level: ${activityLevel}
Diet Type: ${dietType}
Daily Calorie Target: ${dailyCalories}
Allergies: ${allergies.join(', ') || 'None'}
Dislikes: ${dislikes.join(', ') || 'None'}
Favorites: ${favorites.join(', ') || 'None'}

Available Recipes:
${recipes.map(r => `- ${r.name} (${r.caloriesPerServing} cal, ${r.category}, ${r.tags.join(', ')})`).join('\n')}

Requirements:
1. Avoid recipes containing allergies and dislikes
2. Prioritize favorite ingredients when possible
3. Follow the specified diet type restrictions
4. Balance macronutrients appropriately for the goal
5. Include 3 main meals per day
6. Vary recipes throughout the week
7. Stay within daily calorie targets

Return a JSON structure with this format:
{
  "days": [
    {
      "day": 1,
      "date": "2024-01-01",
      "meals": {
        "breakfast": ["Recipe Name 1"],
        "lunch": ["Recipe Name 2"],
        "dinner": ["Recipe Name 3"],
        "snacks": ["Recipe Name 4"]
      },
      "totalCalories": 1800
    }
  ]
}
`;
  }

  private calculateBMR(weight: number, height: number, age: number, gender: string): number {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  private calculateDailyCalories(bmr: number, activityLevel: string, goal: string): number {
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    const baseCalories = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2);

    switch (goal) {
      case 'lose_fat':
        return Math.round(baseCalories * 0.8); // 20% deficit
      case 'gain_weight':
      case 'build_muscle':
        return Math.round(baseCalories * 1.1); // 10% surplus
      default:
        return Math.round(baseCalories);
    }
  }

  private parseMealPlanResponse(response: string, recipes: Recipe[]) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const parsed = JSON.parse(jsonMatch[0]);
      return this.validateAndMapMealPlan(parsed, recipes);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return null;
    }
  }

  private validateAndMapMealPlan(parsed: any, recipes: Recipe[]) {
    // Map recipe names to actual recipe objects
    const recipeMap = new Map(recipes.map(r => [r.name.toLowerCase(), r]));
    
    return parsed.days?.map((day: any) => ({
      ...day,
      meals: {
        breakfast: this.mapRecipeNames(day.meals?.breakfast || [], recipeMap),
        lunch: this.mapRecipeNames(day.meals?.lunch || [], recipeMap),
        dinner: this.mapRecipeNames(day.meals?.dinner || [], recipeMap),
        snacks: this.mapRecipeNames(day.meals?.snacks || [], recipeMap)
      }
    }));
  }

  private mapRecipeNames(recipeNames: string[], recipeMap: Map<string, Recipe>): Recipe[] {
    return recipeNames
      .map(name => recipeMap.get(name.toLowerCase()))
      .filter(Boolean) as Recipe[];
  }

  private generateFallbackMealPlan(userProfile: UserProfile, recipes: Recipe[], days: number) {
    // Simple fallback meal plan generation
    const filteredRecipes = this.filterRecipesByProfile(recipes, userProfile);
    const mealPlan = [];

    for (let day = 1; day <= days; day++) {
      const dayMeals = {
        day,
        date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        meals: {
          breakfast: this.selectRandomRecipes(filteredRecipes.filter(r => r.category === 'smoothie' || r.category === 'snack'), 1),
          lunch: this.selectRandomRecipes(filteredRecipes.filter(r => r.category === 'salad' || r.category === 'soup'), 1),
          dinner: this.selectRandomRecipes(filteredRecipes.filter(r => r.category === 'main' || r.category === 'bowl'), 1),
          snacks: userProfile.includeSnacks ? this.selectRandomRecipes(filteredRecipes.filter(r => r.category === 'snack'), 1) : []
        },
        totalCalories: 0
      };

      // Calculate total calories
      const allMeals = [...dayMeals.meals.breakfast, ...dayMeals.meals.lunch, ...dayMeals.meals.dinner, ...dayMeals.meals.snacks];
      dayMeals.totalCalories = allMeals.reduce((sum, recipe) => sum + recipe.caloriesPerServing, 0);

      mealPlan.push(dayMeals);
    }

    return mealPlan;
  }

  private filterRecipesByProfile(recipes: Recipe[], profile: UserProfile): Recipe[] {
    return recipes.filter(recipe => {
      // Filter by diet type
      if (profile.dietType === 'vegetarian' && !recipe.isVegetarian) return false;
      if (profile.dietType === 'vegan' && !recipe.isVegan) return false;
      
      // Filter by allergies and dislikes
      const recipeText = `${recipe.name} ${recipe.ingredients.join(' ')}`.toLowerCase();
      if (profile.allergies.some(allergy => recipeText.includes(allergy.toLowerCase()))) return false;
      if (profile.dislikes.some(dislike => recipeText.includes(dislike.toLowerCase()))) return false;
      
      return true;
    });
  }

  private selectRandomRecipes(recipes: Recipe[], count: number): Recipe[] {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export const aiService = new AIService();