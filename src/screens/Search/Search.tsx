import React, { useState, useEffect, Suspense } from 'react';
import { Search, Clock, Flame, ChefHat, ArrowLeft, Plus, Filter } from 'lucide-react';

// Lazy load components
const ProfileSetup = React.lazy(() => import('../../components/DietPlanner/ProfileSetup').then(module => ({ default: module.ProfileSetup })));
const MealPlanView = React.lazy(() => import('../../components/DietPlanner/MealPlanView').then(module => ({ default: module.MealPlanView })));

const FastHealthApp = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showDietPlanner, setShowDietPlanner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showMealPlan, setShowMealPlan] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  // Sample fallback recipe for demo
  const sampleRecipe = {
    id: 1,
    name: "Mediterranean Salad",
    category_name: "Salads",
    total_time: 15,
    calories_per_serving: 220,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    recipe_ingredients: [
      {ingredient_name: "tomatoes", ingredient_emoji: "🍅", quantity: "2 medium"},
      {ingredient_name: "cucumber", ingredient_emoji: "🥒", quantity: "1 large"},
      {ingredient_name: "feta cheese", ingredient_emoji: "🧀", quantity: "100g"},
      {ingredient_name: "olives", ingredient_emoji: "🫒", quantity: "1/4 cup"},
      {ingredient_name: "olive oil", ingredient_emoji: "🫒", quantity: "2 tbsp"}
    ],
    steps: [
      {step_number: 1, instruction: "Chop tomatoes and cucumber into bite-sized pieces"},
      {step_number: 2, instruction: "Add feta cheese and olives"},
      {step_number: 3, instruction: "Drizzle with olive oil and season with salt and pepper"},
      {step_number: 4, instruction: "Toss gently and serve immediately"}
    ],
    tags: ["vegetarian", "quick", "healthy", "mediterranean"],
    description: "A fresh and healthy Mediterranean salad perfect for a quick lunch or light dinner.",
    protein_grams: 8,
    carbs_grams: 12,
    fat_grams: 18,
    fiber_grams: 4
  };

  // Sample data for fallback
  const sampleRecipes = [
    {
      id: 1,
      name: "Rainbow Fruit Salad",
      category: "Fruit Salads",
      tags: ["vegan", "healthy", "quick", "antioxidants"],
      total_time: 15,
      calories_per_serving: 120,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      protein_grams: 2,
      carbs_grams: 30,
      fat_grams: 0.5,
      fiber_grams: 6,
      description: "Colorful mix of seasonal fruits with natural sweetness and vitamins"
    },
    {
      id: 2,
      name: "Tropical Paradise Bowl",
      category: "Fruit Salads",
      tags: ["vegan", "tropical", "healthy"],
      total_time: 12,
      calories_per_serving: 140,
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400",
      protein_grams: 3,
      carbs_grams: 35,
      fat_grams: 1,
      fiber_grams: 7,
      description: "Exotic tropical fruits with coconut flakes and lime zest"
    },
    {
      id: 3,
      name: "Berry Antioxidant Mix",
      category: "Fruit Salads",
      tags: ["vegan", "antioxidants", "healthy"],
      total_time: 8,
      calories_per_serving: 95,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      protein_grams: 2,
      carbs_grams: 23,
      fat_grams: 0.3,
      fiber_grams: 8,
      description: "Mixed berries packed with antioxidants and natural sweetness"
    },
    {
      id: 4,
      name: "Citrus Mint Refresh",
      category: "Fruit Salads",
      tags: ["vegan", "refreshing", "vitamin-c"],
      total_time: 10,
      calories_per_serving: 85,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      protein_grams: 1.5,
      carbs_grams: 22,
      fat_grams: 0.2,
      fiber_grams: 5,
      description: "Refreshing citrus fruits with fresh mint and honey drizzle"
    },
    {
      id: 5,
      name: "Apple Cinnamon Delight",
      category: "Fruit Salads",
      tags: ["vegan", "warming", "healthy"],
      total_time: 15,
      calories_per_serving: 110,
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
      protein_grams: 2,
      carbs_grams: 28,
      fat_grams: 1,
      fiber_grams: 6,
      description: "Crisp apples with cinnamon, walnuts, and a touch of honey"
    },
    {
      id: 6,
      name: "Mediterranean Garden Salad",
      category: "Vegetable Salads",
      tags: ["vegetarian", "mediterranean", "healthy"],
      total_time: 15,
      calories_per_serving: 220,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      protein_grams: 8,
      carbs_grams: 12,
      fat_grams: 18,
      fiber_grams: 4,
      description: "Fresh tomatoes, cucumber, olives, and feta with olive oil"
    },
    {
      id: 7,
      name: "Kale Caesar Power Salad",
      category: "Vegetable Salads",
      tags: ["vegetarian", "protein-rich", "healthy"],
      total_time: 20,
      calories_per_serving: 180,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      protein_grams: 12,
      carbs_grams: 8,
      fat_grams: 12,
      fiber_grams: 6,
      description: "Massaged kale with parmesan, chickpeas, and tahini dressing"
    },
    {
      id: 8,
      name: "Rainbow Veggie Crunch",
      category: "Vegetable Salads",
      tags: ["vegan", "colorful", "crunchy"],
      total_time: 18,
      calories_per_serving: 160,
      image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400",
      protein_grams: 6,
      carbs_grams: 20,
      fat_grams: 8,
      fiber_grams: 8,
      description: "Colorful bell peppers, carrots, cabbage with sesame dressing"
    },
    {
      id: 9,
      name: "Spinach Avocado Power Bowl",
      category: "Vegetable Salads",
      tags: ["vegan", "healthy-fats", "iron-rich"],
      total_time: 12,
      calories_per_serving: 200,
      image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400",
      protein_grams: 8,
      carbs_grams: 15,
      fat_grams: 15,
      fiber_grams: 10,
      description: "Baby spinach with avocado, pumpkin seeds, and lemon vinaigrette"
    },
    {
      id: 10,
      name: "Roasted Beet & Goat Cheese",
      category: "Vegetable Salads",
      tags: ["vegetarian", "gourmet", "antioxidants"],
      total_time: 25,
      calories_per_serving: 190,
      image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400",
      protein_grams: 9,
      carbs_grams: 18,
      fat_grams: 10,
      fiber_grams: 5,
      description: "Roasted beets with goat cheese, walnuts, and arugula"
    },
    {
      id: 11,
      name: "Green Goddess Smoothie",
      category: "Smoothies",
      tags: ["vegan", "green", "detox"],
      total_time: 5,
      calories_per_serving: 180,
      image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400",
      protein_grams: 6,
      carbs_grams: 28,
      fat_grams: 2,
      fiber_grams: 8,
      description: "Spinach, banana, mango, and coconut water blend"
    },
    {
      id: 12,
      name: "Berry Protein Power",
      category: "Smoothies",
      tags: ["vegetarian", "protein-rich", "antioxidants"],
      total_time: 5,
      calories_per_serving: 220,
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400",
      protein_grams: 15,
      carbs_grams: 25,
      fat_grams: 3,
      fiber_grams: 8,
      description: "Mixed berries with Greek yogurt and protein powder"
    },
    {
      id: 13,
      name: "Tropical Mango Blast",
      category: "Smoothies",
      tags: ["vegan", "tropical", "vitamin-c"],
      total_time: 5,
      calories_per_serving: 200,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
      protein_grams: 4,
      carbs_grams: 42,
      fat_grams: 3,
      fiber_grams: 5,
      description: "Mango, pineapple, coconut milk, and lime smoothie"
    },
    {
      id: 14,
      name: "Chocolate Peanut Butter",
      category: "Smoothies",
      tags: ["vegetarian", "protein-rich", "indulgent"],
      total_time: 5,
      calories_per_serving: 280,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      protein_grams: 18,
      carbs_grams: 22,
      fat_grams: 12,
      fiber_grams: 6,
      description: "Banana, cocoa powder, peanut butter, and almond milk"
    },
    {
      id: 15,
      name: "Vanilla Oat Dream",
      category: "Smoothies",
      tags: ["vegan", "creamy", "fiber-rich"],
      total_time: 5,
      calories_per_serving: 190,
      image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400",
      protein_grams: 8,
      carbs_grams: 32,
      fat_grams: 4,
      fiber_grams: 7,
      description: "Oats, banana, vanilla, dates, and oat milk blend"
    },
    {
      id: 16,
      name: "Creamy Tomato Basil Soup",
      category: "Soups",
      tags: ["vegetarian", "comfort", "antioxidants"],
      total_time: 25,
      calories_per_serving: 160,
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
      protein_grams: 6,
      carbs_grams: 18,
      fat_grams: 8,
      fiber_grams: 4,
      description: "Rich tomato soup with fresh basil and coconut cream"
    },
    {
      id: 17,
      name: "Lentil Vegetable Stew",
      category: "Soups",
      tags: ["vegan", "protein-rich", "hearty"],
      total_time: 25,
      calories_per_serving: 240,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
      protein_grams: 14,
      carbs_grams: 35,
      fat_grams: 4,
      fiber_grams: 12,
      description: "Red lentils with carrots, celery, and warming spices"
    },
    {
      id: 18,
      name: "Butternut Squash Ginger",
      category: "Soups",
      tags: ["vegan", "warming", "vitamin-a"],
      total_time: 25,
      calories_per_serving: 140,
      image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400",
      protein_grams: 4,
      carbs_grams: 28,
      fat_grams: 3,
      fiber_grams: 6,
      description: "Roasted butternut squash with ginger and coconut milk"
    },
    {
      id: 19,
      name: "Mushroom Barley Soup",
      category: "Soups",
      tags: ["vegan", "earthy", "fiber-rich"],
      total_time: 25,
      calories_per_serving: 180,
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
      protein_grams: 8,
      carbs_grams: 30,
      fat_grams: 4,
      fiber_grams: 8,
      description: "Mixed mushrooms with pearl barley and herbs"
    },
    {
      id: 20,
      name: "Spicy Black Bean Soup",
      category: "Soups",
      tags: ["vegan", "spicy", "protein-rich"],
      total_time: 20,
      calories_per_serving: 220,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
      protein_grams: 12,
      carbs_grams: 32,
      fat_grams: 5,
      fiber_grams: 14,
      description: "Black beans with jalapeños, cumin, and lime"
    },
    {
      id: 21,
      name: "Avocado Toast Supreme",
      category: "Snacks",
      tags: ["vegetarian", "healthy-fats", "quick"],
      total_time: 8,
      calories_per_serving: 250,
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
      protein_grams: 8,
      carbs_grams: 20,
      fat_grams: 18,
      fiber_grams: 10,
      description: "Smashed avocado on whole grain toast with hemp seeds"
    },
    {
      id: 22,
      name: "Energy Balls Trio",
      category: "Snacks",
      tags: ["vegan", "energy", "no-bake"],
      total_time: 15,
      calories_per_serving: 180,
      image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400",
      protein_grams: 6,
      carbs_grams: 22,
      fat_grams: 8,
      fiber_grams: 5,
      description: "Dates, nuts, and cocoa powder rolled into bite-sized balls"
    },
    {
      id: 23,
      name: "Hummus Veggie Platter",
      category: "Snacks",
      tags: ["vegan", "protein-rich", "colorful"],
      total_time: 10,
      calories_per_serving: 160,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      protein_grams: 8,
      carbs_grams: 18,
      fat_grams: 6,
      fiber_grams: 7,
      description: "Homemade hummus with fresh cut vegetables"
    },
    {
      id: 24,
      name: "Greek Yogurt Berry Parfait",
      category: "Snacks",
      tags: ["vegetarian", "protein-rich", "probiotics"],
      total_time: 5,
      calories_per_serving: 200,
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
      protein_grams: 15,
      carbs_grams: 25,
      fat_grams: 4,
      fiber_grams: 8,
      description: "Greek yogurt layered with berries and granola"
    },
    {
      id: 25,
      name: "Roasted Chickpea Crunch",
      category: "Snacks",
      tags: ["vegan", "crunchy", "protein-rich"],
      total_time: 25,
      calories_per_serving: 140,
      image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400",
      protein_grams: 8,
      carbs_grams: 20,
      fat_grams: 4,
      fiber_grams: 6,
      description: "Crispy roasted chickpeas with paprika and garlic"
    }
  ];

  const sampleCategories = [
    { id: 'all', name: 'All', recipe_count: 40 },
    { id: 'salads', name: 'Salads', recipe_count: 12 },
    { id: 'smoothies', name: 'Smoothies', recipe_count: 8 },
    { id: 'soups', name: 'Soups', recipe_count: 6 },
    { id: 'bowls', name: 'Bowls', recipe_count: 10 },
    { id: 'snacks', name: 'Snacks', recipe_count: 4 }
  ];

  const sampleIngredients = [
    { name: "tomatoes", emoji: "🍅" },
    { name: "cucumber", emoji: "🥒" },
    { name: "spinach", emoji: "🥬" },
    { name: "avocado", emoji: "🥑" },
    { name: "quinoa", emoji: "🌾" },
    { name: "chickpeas", emoji: "🫘" },
    { name: "banana", emoji: "🍌" },
    { name: "berries", emoji: "🫐" }
  ];

  // API Functions
  const fetchRecipes = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.ingredients) params.append('ingredients', filters.ingredients);
      if (filters.max_time) params.append('max_time', filters.max_time);
      
      const response = await fetch(`${API_BASE_URL}/recipes/?${params}`);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.log('Using sample data:', err.message);
      setRecipes(sampleRecipes);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories([{id: 'all', name: 'All', recipe_count: 0}, ...data]);
    } catch (err) {
      console.log('Using sample categories');
      setCategories(sampleCategories);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/`);
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      const data = await response.json();
      setIngredients(data);
    } catch (err) {
      console.log('Using sample ingredients');
      setIngredients(sampleIngredients);
    }
  };

  const fetchRecipeDetail = async (slug) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${slug}/`);
      if (!response.ok) throw new Error('Recipe not found');
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (err) {
      setSelectedRecipe(sampleRecipe);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    setRecipes(sampleRecipes);
    setFilteredRecipes(sampleRecipes);
    fetchCategories();
    fetchIngredients();
  }, []);

  // Smart search and filter function
  const applyFilters = () => {
    let filtered = [...recipes];

    // Search filter - matches name, description, or ingredients
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower) ||
        recipe.category_name.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Ingredient filter
    if (selectedIngredients.length > 0) {
      filtered = filtered.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDesc = recipe.description?.toLowerCase() || '';
        return selectedIngredients.some(ingredient => 
          recipeName.includes(ingredient.toLowerCase()) ||
          recipeDesc.includes(ingredient.toLowerCase())
        );
      });
    }

    setFilteredRecipes(filtered);
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  // Apply filters when search term, category, or ingredients change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, selectedIngredients, recipes]);

  // Diet Planner handlers
  const handleProfileComplete = (profile) => {
    setUserProfile(profile);
    setShowDietPlanner(false);
    setShowMealPlan(true);
  };

  const handleBackFromProfile = () => {
    setShowDietPlanner(false);
    setCurrentView('landing');
  };

  const handleBackFromMealPlan = () => {
    setShowMealPlan(false);
    setCurrentView('landing');
  };

  const handleEditProfile = () => {
    setShowMealPlan(false);
    setShowDietPlanner(true);
  };

  // Render diet planner components
  if (showDietPlanner) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }>
        <ProfileSetup 
          onComplete={handleProfileComplete}
          onBack={handleBackFromProfile}
          existingProfile={userProfile}
        />
      </Suspense>
    );
  }

  if (showMealPlan && userProfile) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Loading meal plan...</div>
        </div>
      }>
        <MealPlanView 
          userProfile={userProfile}
          onBack={handleBackFromMealPlan}
          onEditProfile={handleEditProfile}
          recipes={recipes}
        />
      </Suspense>
    );
  }

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto shadow-lg">
            FH
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fast Health</h1>
          <p className="text-gray-600 mb-8">Quick, healthy recipes in 25 minutes or less</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Cooking
            </button>
            
            <button 
              onClick={() => setShowDietPlanner(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              AI Diet Planner
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Search Page Component
  const SearchPage = () => (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentView('main')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Search Recipes</h2>
          <div className="w-6 h-6"></div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.recipe_count || 0})
            </button>
          ))}
        </div>

        {/* Ingredient Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter by Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map(ingredient => (
              <button
                key={ingredient.id || ingredient.name}
                onClick={() => toggleIngredient(ingredient.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                  selectedIngredients.includes(ingredient.name)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                }`}
              >
                <span>{ingredient.emoji || '🥗'}</span>
                <span className="capitalize">{ingredient.name}</span>
              </button>
            ))}
          </div>
          {selectedIngredients.length > 0 && (
            <button
              onClick={() => setSelectedIngredients([])}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Recipe Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading recipes...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <div className="text-red-500 mb-2">⚠️ Error loading recipes</div>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => {setError(null); fetchRecipes();}}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : filteredRecipes.map(recipe => (
            <div 
              key={recipe.id}
              onClick={() => {
                if (recipe.slug) {
                  fetchRecipeDetail(recipe.slug);
                } else {
                  setSelectedRecipe({...sampleRecipe, ...recipe});
                }
                setCurrentView('recipe');
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <img 
                src={recipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"} 
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {recipe.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <Clock className="w-3 h-3" />
                    {recipe.total_time ? `${recipe.total_time} min` : recipe.time}
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{recipe.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Flame className="w-3 h-3" />
                    <span className="font-medium">{recipe.calories_per_serving || recipe.calories} cal</span>
                  </div>
                  <div className="text-gray-500">
                    Protein: {recipe.protein_grams}g
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedIngredients([]);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Recipe Detail Component
  const RecipeDetail = () => {
    if (!selectedRecipe) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        {/* Hero Image Section */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={selectedRecipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800"} 
            alt={selectedRecipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <button 
            onClick={() => setCurrentView('main')}
            className="absolute top-6 left-6 bg-white bg-opacity-90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{selectedRecipe.name}</h1>
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{selectedRecipe.total_time ? `${selectedRecipe.total_time} min` : selectedRecipe.time}</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="font-medium">{selectedRecipe.calories_per_serving || selectedRecipe.calories} cal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading recipe...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Description and Tags */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {selectedRecipe.description && (
                  <p className="text-gray-700 text-lg mb-4">{selectedRecipe.description}</p>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selectedRecipe.tags || []).map((tag, index) => (
                    <span key={index} className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                      {typeof tag === 'object' ? tag.name : tag}
                    </span>
                  ))}
                  {selectedRecipe.is_vegetarian && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">vegetarian</span>
                  )}
                  {selectedRecipe.is_vegan && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">vegan</span>
                  )}
                  {selectedRecipe.is_gluten_free && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">gluten-free</span>
                  )}
                </div>

                {/* Nutrition Info */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Nutrition Facts (per serving)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">{selectedRecipe.calories_per_serving || selectedRecipe.calories}</div>
                      <div className="text-gray-600 font-medium">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{selectedRecipe.protein_grams || 0}g</div>
                      <div className="text-gray-600 font-medium">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{selectedRecipe.carbs_grams || 0}g</div>
                      <div className="text-gray-600 font-medium">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{selectedRecipe.fiber_grams || 0}g</div>
                      <div className="text-gray-600 font-medium">Fiber</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{selectedRecipe.fat_grams || 0}g Fat</div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                  🧺 Ingredients
                </h2>
                <ul className="space-y-4">
                  {(selectedRecipe.recipe_ingredients || selectedRecipe.ingredients || []).map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-4 text-gray-700 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex-shrink-0"></div>
                      <span className="flex items-center gap-3 text-lg">
                        {ingredient.ingredient_emoji && <span className="text-2xl">{ingredient.ingredient_emoji}</span>}
                        <span className="font-medium">
                          {ingredient.quantity && `${ingredient.quantity} `}
                          {ingredient.ingredient_name || ingredient}
                        </span>
                        {ingredient.notes && <span className="text-gray-500">({ingredient.notes})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                  <ChefHat className="w-6 h-6" />
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {(selectedRecipe.steps || []).map((step, index) => (
                    <li key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step_number || index + 1}
                      </span>
                      <span className="text-gray-700 text-lg leading-relaxed">
                        {step.instruction || step}
                        {step.time_minutes > 0 && (
                          <span className="text-sm text-gray-500 ml-2 font-medium">({step.time_minutes} min)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main Dashboard Component
  const MainDashboard = () => {
    const [stats, setStats] = useState({
      total_recipes: 0,
      avg_time_minutes: 25,
      avg_calories: 200,
      vegetarian_percentage: 80
    });

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.log('Stats not available, using defaults');
      }
    };

    useEffect(() => {
      fetchStats();
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Search */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Fast Health</h2>
              <button 
                onClick={() => setCurrentView('search')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            
            <div 
              onClick={() => setCurrentView('search')}
              className="relative cursor-pointer"
            >
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search healthy recipes..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-md border-none outline-none cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(1).map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.name.toLowerCase());
                    setCurrentView('search');
                  }}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
                >
                  <div className="text-3xl mb-2">
                    {category.name === 'Salads' && '🥗'}
                    {category.name === 'Smoothies' && '🥤'}
                    {category.name === 'Soups' && '🍲'}
                    {category.name === 'Bowls' && '🍜'}
                    {category.name === 'Snacks' && '🍎'}
                    {category.name === 'Wraps' && '🌯'}
                    {category.name === 'Toasts' && '🍞'}
                  </div>
                  <div className="font-semibold text-gray-800">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.recipe_count || 0} recipes</div>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Recipes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Popular Recipes</h3>
              <button 
                onClick={() => setCurrentView('search')}
                className="text-blue-500 hover:text-blue-600"
              >
                See all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(recipes.slice(0, 4)).map(recipe => (
                <div 
                  key={recipe.id}
                  onClick={() => {
                    if (recipe.slug) {
                      fetchRecipeDetail(recipe.slug);
                    } else {
                      setSelectedRecipe({...sampleRecipe, ...recipe});
                    }
                    setCurrentView('recipe');
                  }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <img 
                    src={recipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"} 
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 px-3 py-1 rounded-full font-medium capitalize">
                        {recipe.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Clock className="w-3 h-3" />
                        {recipe.total_time ? `${recipe.total_time} min` : recipe.time}
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">{recipe.name}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-orange-600">
                        <Flame className="w-3 h-3" />
                        <span className="font-medium">{recipe.calories_per_serving || recipe.calories} cal</span>
                      </div>
                      <div className="text-gray-500">
                        Protein: {recipe.protein_grams}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show loading or empty state if no recipes */}
              {recipes.length === 0 && !loading && (
                <div className="col-span-full text-center py-8">
                  <div className="text-4xl mb-2">🍽️</div>
                  <p className="text-gray-500">Loading delicious recipes...</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.total_recipes || recipes.length}</div>
              <div className="text-sm text-gray-600">Total Recipes</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-2xl font-bold text-green-500">{stats.avg_time_minutes}</div>
              <div className="text-sm text-gray-600">Avg Time (min)</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-500">{stats.avg_calories}</div>
              <div className="text-sm text-gray-600">Avg Calories</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.vegetarian_percentage}%</div>
              <div className="text-sm text-gray-600">Vegetarian</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current view
  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'main':
      return <MainDashboard />;
    case 'search':
      return <SearchPage />;
    case 'recipe':
      return <RecipeDetail />;
    default:
      return <LandingPage />;
  }
};

export { FastHealthApp as Search };