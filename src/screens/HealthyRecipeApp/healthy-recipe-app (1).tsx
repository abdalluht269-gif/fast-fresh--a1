import React, { useState, useEffect } from 'react';
import { Search, Clock, Flame, ChefHat, ArrowLeft, Plus, Filter } from 'lucide-react';

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

  const API_BASE_URL = 'http://localhost:8000/api';

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
      {ingredient_name: "cucumber", ingredient_emoji: "🥒", quantity: "1 large"}
    ],
    steps: [
      {step_number: 1, instruction: "Chop vegetables"},
      {step_number: 2, instruction: "Add feta and olives"}
    ],
    tags: ["vegetarian", "quick", "healthy"]
  };

  // Sample data for fallback
  const sampleRecipes = [
    {
      id: 1,
      name: "Mediterranean Salad",
      category_name: "Salads",
      total_time: 15,
      calories_per_serving: 220,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"
    },
    {
      id: 2,
      name: "Green Smoothie",
      category_name: "Smoothies",
      total_time: 5,
      calories_per_serving: 180,
      image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400"
    },
    {
      id: 3,
      name: "Quinoa Bowl",
      category_name: "Bowls",
      total_time: 25,
      calories_per_serving: 340,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
    },
    {
      id: 4,
      name: "Veggie Wrap",
      category_name: "Wraps",
      total_time: 10,
      calories_per_serving: 280,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
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
    fetchRecipes();
    fetchCategories();
    fetchIngredients();
  }, []);

  const handleSearch = async () => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      ingredients: selectedIngredients.join(','),
      max_time: 25
    };
    await fetchRecipes(filters);
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => {
      const newIngredients = prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient];
      
      if (currentView === 'search') {
        setTimeout(() => {
          const filters = {
            search: searchTerm,
            category: selectedCategory,
            ingredients: newIngredients.join(','),
            max_time: 25
          };
          fetchRecipes(filters);
        }, 300);
      }
      
      return newIngredients;
    });
  };

  useEffect(() => {
    if (currentView === 'search' && searchTerm) {
      const debounceTimer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (currentView === 'search') {
      handleSearch();
    }
  }, [selectedCategory]);

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
          <button 
            onClick={() => setCurrentView('main')}
            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Cooking
          </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          ) : recipes.map(recipe => (
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
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 border border-gray-100"
            >
              <img 
                src={recipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"} 
                alt={recipe.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {recipe.category_name || recipe.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Flame className="w-3 h-3" />
                    {recipe.calories_per_serving || recipe.calories}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{recipe.name}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {recipe.total_time ? `${recipe.total_time} min` : recipe.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedIngredients([]);
                fetchRecipes();
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setCurrentView('search')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </button>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading recipe...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src={selectedRecipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"} 
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-800">{selectedRecipe.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedRecipe.total_time ? `${selectedRecipe.total_time} min` : selectedRecipe.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {selectedRecipe.calories_per_serving || selectedRecipe.calories} cal
                    </div>
                  </div>
                </div>

                {selectedRecipe.description && (
                  <p className="text-gray-700 mb-6">{selectedRecipe.description}</p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(selectedRecipe.tags || []).map((tag, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {typeof tag === 'object' ? tag.name : tag}
                    </span>
                  ))}
                  {selectedRecipe.is_vegetarian && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">vegetarian</span>
                  )}
                  {selectedRecipe.is_vegan && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">vegan</span>
                  )}
                  {selectedRecipe.is_gluten_free && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">gluten-free</span>
                  )}
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    🧺 Ingredients
                  </h2>
                  <ul className="space-y-2">
                    {(selectedRecipe.recipe_ingredients || selectedRecipe.ingredients || []).map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="flex items-center gap-2">
                          {ingredient.ingredient_emoji && <span>{ingredient.ingredient_emoji}</span>}
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
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    Instructions
                  </h2>
                  <ol className="space-y-3">
                    {(selectedRecipe.steps || []).map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {step.step_number || index + 1}
                        </span>
                        <span className="text-gray-700">
                          {step.instruction || step}
                          {step.time_minutes > 0 && (
                            <span className="text-sm text-gray-500 ml-2">({step.time_minutes} min)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Nutritional Info */}
                {(selectedRecipe.protein_grams || selectedRecipe.carbs_grams || selectedRecipe.fat_grams) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Nutrition (per serving)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      {selectedRecipe.protein_grams && (
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{selectedRecipe.protein_grams}g</div>
                          <div className="text-gray-600">Protein</div>
                        </div>
                      )}
                      {selectedRecipe.carbs_grams && (
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{selectedRecipe.carbs_grams}g</div>
                          <div className="text-gray-600">Carbs</div>
                        </div>
                      )}
                      {selectedRecipe.fat_grams && (
                        <div className="text-center">
                          <div className="font-semibold text-yellow-600">{selectedRecipe.fat_grams}g</div>
                          <div className="text-gray-600">Fat</div>
                        </div>
                      )}
                      {selectedRecipe.fiber_grams && (
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{selectedRecipe.fiber_grams}g</div>
                          <div className="text-gray-600">Fiber</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                    fetchRecipes({category: category.name.toLowerCase()});
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
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200"
                >
                  <img 
                    src={recipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"} 
                    alt={recipe.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                        {recipe.category_name || recipe.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Flame className="w-3 h-3" />
                        {recipe.calories_per_serving || recipe.calories}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{recipe.name}</h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {recipe.total_time ? `${recipe.total_time} min` : recipe.time}
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
            <div className="bg-white