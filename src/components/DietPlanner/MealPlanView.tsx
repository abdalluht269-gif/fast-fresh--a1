import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, ChefHat, ArrowLeft, RefreshCw, Download, Settings } from 'lucide-react';
import { UserProfile, MealPlan, WeeklyPlan, Recipe } from '../../types/diet';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';

interface MealPlanViewProps {
  userProfile: UserProfile;
  onBack: () => void;
  onEditProfile: () => void;
  recipes: Recipe[];
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ 
  userProfile, 
  onBack, 
  onEditProfile, 
  recipes 
}) => {
  const [currentWeekPlan, setCurrentWeekPlan] = useState<WeeklyPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  useEffect(() => {
    loadCurrentWeekPlan();
  }, [userProfile]);

  const loadCurrentWeekPlan = () => {
    const existingPlan = storageService.getCurrentWeekPlan(userProfile.id || 'user');
    if (existingPlan) {
      setCurrentWeekPlan(existingPlan);
    } else {
      generateNewWeekPlan();
    }
  };

  const generateNewWeekPlan = async () => {
    setLoading(true);
    try {
      const mealPlan = await aiService.generateMealPlan(userProfile, recipes, 7);
      
      if (mealPlan) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        
        const weeklyPlan: WeeklyPlan = {
          userId: userProfile.id || 'user',
          weekStart: weekStart.toISOString().split('T')[0],
          days: mealPlan.map((day: any, index: number) => {
            const dayDate = new Date(weekStart);
            dayDate.setDate(dayDate.getDate() + index);
            
            const dayMeals = [
              ...day.meals.breakfast,
              ...day.meals.lunch,
              ...day.meals.dinner,
              ...(day.meals.snacks || [])
            ];
            
            return {
              id: `${userProfile.id || 'user'}-${dayDate.toISOString().split('T')[0]}`,
              userId: userProfile.id || 'user',
              date: dayDate.toISOString().split('T')[0],
              meals: [
                {
                  type: 'breakfast' as const,
                  recipes: day.meals.breakfast,
                  totalCalories: day.meals.breakfast.reduce((sum: number, r: Recipe) => sum + r.caloriesPerServing, 0),
                  totalProtein: day.meals.breakfast.reduce((sum: number, r: Recipe) => sum + r.proteinGrams, 0),
                  totalCarbs: day.meals.breakfast.reduce((sum: number, r: Recipe) => sum + r.carbsGrams, 0),
                  totalFat: day.meals.breakfast.reduce((sum: number, r: Recipe) => sum + r.fatGrams, 0)
                },
                {
                  type: 'lunch' as const,
                  recipes: day.meals.lunch,
                  totalCalories: day.meals.lunch.reduce((sum: number, r: Recipe) => sum + r.caloriesPerServing, 0),
                  totalProtein: day.meals.lunch.reduce((sum: number, r: Recipe) => sum + r.proteinGrams, 0),
                  totalCarbs: day.meals.lunch.reduce((sum: number, r: Recipe) => sum + r.carbsGrams, 0),
                  totalFat: day.meals.lunch.reduce((sum: number, r: Recipe) => sum + r.fatGrams, 0)
                },
                {
                  type: 'dinner' as const,
                  recipes: day.meals.dinner,
                  totalCalories: day.meals.dinner.reduce((sum: number, r: Recipe) => sum + r.caloriesPerServing, 0),
                  totalProtein: day.meals.dinner.reduce((sum: number, r: Recipe) => sum + r.proteinGrams, 0),
                  totalCarbs: day.meals.dinner.reduce((sum: number, r: Recipe) => sum + r.carbsGrams, 0),
                  totalFat: day.meals.dinner.reduce((sum: number, r: Recipe) => sum + r.fatGrams, 0)
                }
              ],
              totalCalories: dayMeals.reduce((sum: number, r: Recipe) => sum + r.caloriesPerServing, 0),
              totalProtein: dayMeals.reduce((sum: number, r: Recipe) => sum + r.proteinGrams, 0),
              totalCarbs: dayMeals.reduce((sum: number, r: Recipe) => sum + r.carbsGrams, 0),
              totalFat: dayMeals.reduce((sum: number, r: Recipe) => sum + r.fatGrams, 0),
              createdAt: new Date()
            };
          }),
          weeklyTotals: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }
        };

        // Calculate weekly totals
        weeklyPlan.weeklyTotals = weeklyPlan.days.reduce((totals, day) => ({
          calories: totals.calories + day.totalCalories,
          protein: totals.protein + day.totalProtein,
          carbs: totals.carbs + day.totalCarbs,
          fat: totals.fat + day.totalFat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        storageService.saveWeeklyPlan(weeklyPlan);
        setCurrentWeekPlan(weeklyPlan);
      }
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const exportMealPlan = () => {
    if (currentWeekPlan) {
      const dataStr = JSON.stringify(currentWeekPlan, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `meal-plan-${currentWeekPlan.weekStart}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Creating Your Meal Plan</h2>
          <p className="text-gray-400">AI is analyzing your preferences and generating personalized meals...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'day' && selectedDay) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setViewMode('week')}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Week View
            </button>
            <h1 className="text-2xl font-bold text-white">
              {getDayName(selectedDay.date)} - {getShortDate(selectedDay.date)}
            </h1>
            <div className="w-20" />
          </div>

          {/* Day Summary */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{selectedDay.totalCalories}</div>
                <div className="text-gray-400 text-sm">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{Math.round(selectedDay.totalProtein)}g</div>
                <div className="text-gray-400 text-sm">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{Math.round(selectedDay.totalCarbs)}g</div>
                <div className="text-gray-400 text-sm">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{Math.round(selectedDay.totalFat)}g</div>
                <div className="text-gray-400 text-sm">Fat</div>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-6">
            {selectedDay.meals.map((meal, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 capitalize flex items-center gap-2">
                  {meal.type === 'breakfast' && '🌅'}
                  {meal.type === 'lunch' && '☀️'}
                  {meal.type === 'dinner' && '🌙'}
                  {meal.type === 'snack' && '🍎'}
                  {meal.type}
                </h3>
                
                <div className="grid gap-4">
                  {meal.recipes.map((recipe, recipeIndex) => (
                    <div key={recipeIndex} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{recipe.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {recipe.totalTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {recipe.caloriesPerServing} cal
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Nutrition</div>
                        <div className="text-xs text-gray-500">
                          P: {recipe.proteinGrams}g | C: {recipe.carbsGrams}g | F: {recipe.fatGrams}g
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Meal Total:</span>
                    <span className="text-white">
                      {meal.totalCalories} cal | {Math.round(meal.totalProtein)}g protein | {Math.round(meal.totalCarbs)}g carbs | {Math.round(meal.totalFat)}g fat
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Your Meal Plan</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditProfile}
              className="text-gray-400 hover:text-white p-2"
              title="Edit Profile"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={exportMealPlan}
              className="text-gray-400 hover:text-white p-2"
              title="Export Plan"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={generateNewWeekPlan}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Goal</div>
              <div className="text-white font-medium capitalize">{userProfile.goal.replace('_', ' ')}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Diet Type</div>
              <div className="text-white font-medium capitalize">{userProfile.dietType}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Activity</div>
              <div className="text-white font-medium capitalize">{userProfile.activityLevel.replace('_', ' ')}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Weekly Avg</div>
              <div className="text-white font-medium">
                {currentWeekPlan ? Math.round(currentWeekPlan.weeklyTotals.calories / 7) : 0} cal/day
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        {currentWeekPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {currentWeekPlan.days.map((day, index) => (
              <div 
                key={index}
                onClick={() => {
                  setSelectedDay(day);
                  setViewMode('day');
                }}
                className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-700 transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-white font-bold">{getDayName(day.date)}</div>
                  <div className="text-gray-400 text-sm">{getShortDate(day.date)}</div>
                </div>

                <div className="space-y-3">
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="bg-gray-700 rounded-lg p-3">
                      <div className="text-white text-sm font-medium mb-2 capitalize flex items-center gap-2">
                        {meal.type === 'breakfast' && '🌅'}
                        {meal.type === 'lunch' && '☀️'}
                        {meal.type === 'dinner' && '🌙'}
                        {meal.type === 'snack' && '🍎'}
                        {meal.type}
                      </div>
                      {meal.recipes.map((recipe, recipeIndex) => (
                        <div key={recipeIndex} className="text-xs text-gray-300 mb-1">
                          {recipe.name}
                        </div>
                      ))}
                      <div className="text-xs text-gray-400 mt-2">
                        {meal.totalCalories} cal
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-600">
                  <div className="text-center">
                    <div className="text-orange-500 font-bold">{day.totalCalories}</div>
                    <div className="text-gray-400 text-xs">Total Calories</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!currentWeekPlan && !loading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Meal Plan Found</h3>
            <p className="text-gray-400 mb-6">Generate your first personalized meal plan</p>
            <button
              onClick={generateNewWeekPlan}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Generate Meal Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};