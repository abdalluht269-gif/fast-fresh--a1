from django.urls import path
from . import views

urlpatterns = [
    path('recipes/', views.RecipeListView.as_view(), name='recipe-list'),
    path('recipes/<slug:slug>/', views.RecipeDetailView.as_view(), name='recipe-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('ingredients/', views.IngredientListView.as_view(), name='ingredient-list'),
    path('stats/', views.recipe_stats, name='recipe-stats'),
    path('featured/', views.featured_recipes, name='featured-recipes'),
]