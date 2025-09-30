import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Target, Utensils, AlertTriangle, Coffee } from 'lucide-react';
import { UserProfile } from '../../types/diet';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
  existingProfile?: UserProfile | null;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, onBack, existingProfile }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: existingProfile?.age || 25,
    gender: existingProfile?.gender || 'female',
    height: existingProfile?.height || 165,
    weight: existingProfile?.weight || 65,
    goal: existingProfile?.goal || 'lose_fat',
    activityLevel: existingProfile?.activityLevel || 'moderately_active',
    dietType: existingProfile?.dietType || 'anything',
    allergies: existingProfile?.allergies || [],
    dislikes: existingProfile?.dislikes || [],
    favorites: existingProfile?.favorites || [],
    mealsPerDay: existingProfile?.mealsPerDay || 3,
    includeSnacks: existingProfile?.includeSnacks || false,
    includeSmoothies: existingProfile?.includeSmoothies || false
  });

  const totalSteps = 5;

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  // Step 1: Physical Profile
  const PhysicalProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Physical Profile</h2>
        <p className="text-gray-400">We use RMR (Resting Metabolic Rate) to estimate your nutrition budget</p>
      </div>

      <div className="space-y-6">
        {/* Height */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Height</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={Math.floor(profile.height / 30.48)}
                onChange={(e) => updateProfile({ height: parseInt(e.target.value) * 30.48 + (profile.height % 30.48) })}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="5"
              />
              <span className="text-gray-400 text-sm mt-1 block">ft</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={Math.round((profile.height % 30.48) / 2.54)}
                onChange={(e) => updateProfile({ height: Math.floor(profile.height / 30.48) * 30.48 + parseInt(e.target.value) * 2.54 })}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="6"
              />
              <span className="text-gray-400 text-sm mt-1 block">in</span>
            </div>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Weight</label>
          <input
            type="number"
            value={profile.weight}
            onChange={(e) => updateProfile({ weight: parseInt(e.target.value) })}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
            placeholder="65"
          />
          <span className="text-gray-400 text-sm mt-1 block">kg</span>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Biological sex</label>
          <div className="flex gap-3">
            {['female', 'male', 'other'].map((gender) => (
              <button
                key={gender}
                onClick={() => updateProfile({ gender: gender as 'male' | 'female' | 'other' })}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all capitalize ${
                  profile.gender === gender
                    ? 'border-orange-500 bg-orange-500/20 text-white'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Age</label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) })}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
            placeholder="25"
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Goals
  const GoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Goal</h2>
        <p className="text-gray-400">What is your goal?</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'lose_fat', label: 'Lose fat', description: 'Reduce body fat percentage' },
          { id: 'maintain_weight', label: 'Maintain weight', description: 'Keep current weight stable' },
          { id: 'build_muscle', label: 'Build muscle', description: 'Increase muscle mass' },
          { id: 'gain_weight', label: 'Gain weight', description: 'Increase overall body weight' }
        ].map((goal) => (
          <button
            key={goal.id}
            onClick={() => updateProfile({ goal: goal.id as UserProfile['goal'] })}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              profile.goal === goal.id
                ? 'border-orange-500 bg-orange-500/20 text-white'
                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="font-medium">{goal.label}</div>
            <div className="text-sm text-gray-400 mt-1">{goal.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <label className="block text-white text-sm font-medium mb-3">Activity Level</label>
        <div className="space-y-3">
          {[
            { id: 'sedentary', label: 'Sedentary', description: 'Desk work, no exercise' },
            { id: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
            { id: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
            { id: 'very_active', label: 'Very Active', description: 'Heavy exercise 6-7 days/week' },
            { id: 'extremely_active', label: 'Extremely Active', description: 'Very heavy exercise, physical job' }
          ].map((activity) => (
            <button
              key={activity.id}
              onClick={() => updateProfile({ activityLevel: activity.id as UserProfile['activityLevel'] })}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                profile.activityLevel === activity.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="font-medium text-sm">{activity.label}</div>
              <div className="text-xs text-gray-400">{activity.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 3: Diet Type
  const DietTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Utensils className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Diet Type</h2>
        <p className="text-gray-400">We'll base your meals off this main diet type</p>
      </div>

      <div className="space-y-4">
        {[
          { 
            id: 'anything', 
            label: 'Anything', 
            emoji: '🍽️',
            description: 'Excludes: Nothing',
            details: 'No dietary restrictions'
          },
          { 
            id: 'keto', 
            label: 'Keto', 
            emoji: '🥑',
            description: 'Excludes: High-carb',
            details: 'Grains, Refined Starches, Sugar'
          },
          { 
            id: 'vegetarian', 
            label: 'Vegetarian', 
            emoji: '🥬',
            description: 'Excludes: Red Meat,',
            details: 'Poultry, Fish, Shellfish'
          },
          { 
            id: 'vegan', 
            label: 'Vegan', 
            emoji: '🌱',
            description: 'Excludes: All Animal',
            details: 'Products, Dairy, Eggs'
          },
          { 
            id: 'paleo', 
            label: 'Paleo', 
            emoji: '🥩',
            description: 'Excludes: Grains,',
            details: 'Legumes, Dairy, Processed'
          },
          { 
            id: 'mediterranean', 
            label: 'Mediterranean', 
            emoji: '🫒',
            description: 'Focus: Olive Oil,',
            details: 'Fish, Vegetables, Whole Grains'
          },
          { 
            id: 'carnivore', 
            label: 'Carnivore', 
            emoji: '🥓',
            description: 'Only: Animal Products',
            details: 'Meat, Fish, Eggs, Dairy'
          }
        ].map((diet) => (
          <button
            key={diet.id}
            onClick={() => updateProfile({ dietType: diet.id as UserProfile['dietType'] })}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4 ${
              profile.dietType === diet.id
                ? 'border-orange-500 bg-orange-500/20 text-white'
                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-2xl">{diet.emoji}</div>
            <div className="flex-1">
              <div className="font-medium">{diet.label}</div>
              <div className="text-sm text-gray-400">{diet.description}</div>
              <div className="text-xs text-gray-500">{diet.details}</div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 ${
              profile.dietType === diet.id
                ? 'border-orange-500 bg-orange-500'
                : 'border-gray-600'
            }`}>
              {profile.dietType === diet.id && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 4: Allergies & Preferences
  const AllergiesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Allergies & Preferences</h2>
        <p className="text-gray-400">Do you have any of these common allergies?</p>
      </div>

      {/* Allergies */}
      <div>
        <h3 className="text-white font-medium mb-4">Common Allergies</h3>
        <div className="flex flex-wrap gap-3">
          {['Dairy', 'Eggs', 'Fish', 'Gluten', 'Peanuts', 'Sesame', 'Shellfish', 'Soy', 'Tree Nuts'].map((allergy) => (
            <button
              key={allergy}
              onClick={() => updateProfile({ allergies: toggleArrayItem(profile.allergies, allergy.toLowerCase()) })}
              className={`px-4 py-2 rounded-full transition-all ${
                profile.allergies.includes(allergy.toLowerCase())
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      {/* Dislikes */}
      <div>
        <h3 className="text-white font-medium mb-4">Foods You Don't Like</h3>
        <div className="flex flex-wrap gap-3">
          {['Onions', 'Mushrooms', 'Cilantro', 'Spicy Food', 'Seafood', 'Beans', 'Coconut', 'Olives'].map((dislike) => (
            <button
              key={dislike}
              onClick={() => updateProfile({ dislikes: toggleArrayItem(profile.dislikes, dislike.toLowerCase()) })}
              className={`px-4 py-2 rounded-full transition-all ${
                profile.dislikes.includes(dislike.toLowerCase())
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {dislike}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      <div>
        <h3 className="text-white font-medium mb-4">Favorite Foods</h3>
        <div className="flex flex-wrap gap-3">
          {['Chicken', 'Salmon', 'Avocado', 'Spinach', 'Berries', 'Quinoa', 'Sweet Potato', 'Greek Yogurt'].map((favorite) => (
            <button
              key={favorite}
              onClick={() => updateProfile({ favorites: toggleArrayItem(profile.favorites, favorite.toLowerCase()) })}
              className={`px-4 py-2 rounded-full transition-all ${
                profile.favorites.includes(favorite.toLowerCase())
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {favorite}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">
          Some foods are already excluded because you're following a {profile.dietType} diet.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          You can exclude more types of foods and even custom keywords later in the Settings menu.
        </p>
      </div>
    </div>
  );

  // Step 5: Meal Preferences
  const MealPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Coffee className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your Meals</h2>
        <p className="text-gray-400">Which meals would you like for us to plan for you every day?</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-4">Your meals</h3>
          
          {/* Main Meals */}
          <div className="space-y-4">
            {[
              { id: 'breakfast', label: 'Breakfast', included: true },
              { id: 'lunch', label: 'Lunch', included: true },
              { id: 'dinner', label: 'Dinner', included: true }
            ].map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-white font-medium text-lg">{meal.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Remove</span>
                  <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional Meals */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <span className="text-white font-medium">Include Snacks</span>
                <p className="text-gray-400 text-sm">Healthy snacks between meals</p>
              </div>
              <button
                onClick={() => updateProfile({ includeSnacks: !profile.includeSnacks })}
                className={`w-12 h-6 rounded-full transition-all ${
                  profile.includeSnacks ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                  profile.includeSnacks ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <span className="text-white font-medium">Include Smoothies</span>
                <p className="text-gray-400 text-sm">Nutritious smoothies and drinks</p>
              </div>
              <button
                onClick={() => updateProfile({ includeSmoothies: !profile.includeSmoothies })}
                className={`w-12 h-6 rounded-full transition-all ${
                  profile.includeSmoothies ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                  profile.includeSmoothies ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">
            After finishing signup, you'll have more options, like rearranging the meals, adding new ones, and editing their settings in more detail.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PhysicalProfileStep />;
      case 2: return <GoalsStep />;
      case 3: return <DietTypeStep />;
      case 4: return <AllergiesStep />;
      case 5: return <MealPreferencesStep />;
      default: return <PhysicalProfileStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={prevStep}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStep === 1 ? 'Back' : 'Previous'}
          </button>
          
          {/* Progress Bar */}
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Step {currentStep} of {totalSteps}</span>
              <span className="text-gray-400 text-sm">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={nextStep}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};