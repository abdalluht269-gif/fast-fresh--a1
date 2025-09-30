import Cookies from 'js-cookie';
import { UserProfile, MealPlan, WeeklyPlan } from '../types/diet';

export class StorageService {
  private static USER_PROFILE_KEY = 'diet_planner_profile';
  private static MEAL_PLANS_KEY = 'diet_planner_meal_plans';
  private static WEEKLY_PLANS_KEY = 'diet_planner_weekly_plans';

  // User Profile Management
  saveUserProfile(profile: UserProfile): void {
    try {
      const profileData = {
        ...profile,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(profileData));
      
      // Also save in cookies for 30 days
      Cookies.set(this.USER_PROFILE_KEY, JSON.stringify(profileData), { expires: 30 });
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  }

  getUserProfile(): UserProfile | null {
    try {
      // Try localStorage first
      let profileData = localStorage.getItem(this.USER_PROFILE_KEY);
      
      // Fallback to cookies
      if (!profileData) {
        profileData = Cookies.get(this.USER_PROFILE_KEY) || null;
      }

      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  clearUserProfile(): void {
    localStorage.removeItem(this.USER_PROFILE_KEY);
    Cookies.remove(this.USER_PROFILE_KEY);
  }

  // Meal Plans Management
  saveMealPlan(mealPlan: MealPlan): void {
    try {
      const existingPlans = this.getMealPlans();
      const updatedPlans = existingPlans.filter(plan => 
        !(plan.userId === mealPlan.userId && plan.date === mealPlan.date)
      );
      updatedPlans.push(mealPlan);
      
      localStorage.setItem(this.MEAL_PLANS_KEY, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Failed to save meal plan:', error);
    }
  }

  getMealPlans(userId?: string): MealPlan[] {
    try {
      const plansData = localStorage.getItem(this.MEAL_PLANS_KEY);
      const plans = plansData ? JSON.parse(plansData) : [];
      
      return userId ? plans.filter((plan: MealPlan) => plan.userId === userId) : plans;
    } catch (error) {
      console.error('Failed to get meal plans:', error);
      return [];
    }
  }

  getMealPlanByDate(userId: string, date: string): MealPlan | null {
    const plans = this.getMealPlans(userId);
    return plans.find(plan => plan.date === date) || null;
  }

  // Weekly Plans Management
  saveWeeklyPlan(weeklyPlan: WeeklyPlan): void {
    try {
      const existingPlans = this.getWeeklyPlans();
      const updatedPlans = existingPlans.filter(plan => 
        !(plan.userId === weeklyPlan.userId && plan.weekStart === weeklyPlan.weekStart)
      );
      updatedPlans.push(weeklyPlan);
      
      localStorage.setItem(this.WEEKLY_PLANS_KEY, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Failed to save weekly plan:', error);
    }
  }

  getWeeklyPlans(userId?: string): WeeklyPlan[] {
    try {
      const plansData = localStorage.getItem(this.WEEKLY_PLANS_KEY);
      const plans = plansData ? JSON.parse(plansData) : [];
      
      return userId ? plans.filter((plan: WeeklyPlan) => plan.userId === userId) : plans;
    } catch (error) {
      console.error('Failed to get weekly plans:', error);
      return [];
    }
  }

  getCurrentWeekPlan(userId: string): WeeklyPlan | null {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weeklyPlans = this.getWeeklyPlans(userId);
    return weeklyPlans.find(plan => plan.weekStart === weekStartStr) || null;
  }

  // Utility Methods
  clearAllData(): void {
    localStorage.removeItem(this.USER_PROFILE_KEY);
    localStorage.removeItem(this.MEAL_PLANS_KEY);
    localStorage.removeItem(this.WEEKLY_PLANS_KEY);
    Cookies.remove(this.USER_PROFILE_KEY);
  }

  exportUserData(): string {
    const profile = this.getUserProfile();
    const mealPlans = this.getMealPlans(profile?.id);
    const weeklyPlans = this.getWeeklyPlans(profile?.id);
    
    return JSON.stringify({
      profile,
      mealPlans,
      weeklyPlans,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  importUserData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) {
        this.saveUserProfile(data.profile);
      }
      
      if (data.mealPlans) {
        data.mealPlans.forEach((plan: MealPlan) => this.saveMealPlan(plan));
      }
      
      if (data.weeklyPlans) {
        data.weeklyPlans.forEach((plan: WeeklyPlan) => this.saveWeeklyPlan(plan));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import user data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();