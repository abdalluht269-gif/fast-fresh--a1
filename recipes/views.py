from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Recipe, Category, Ingredient
from .serializers import (
    RecipeListSerializer, RecipeDetailSerializer, 
    CategorySerializer, IngredientSerializer
)

class RecipeListView(generics.ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['created_at', 'total_time', 'calories_per_serving', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Recipe.objects.select_related('category').all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category__name__icontains=category)
        
        # Filter by max time
        max_time = self.request.query_params.get('max_time', None)
        if max_time:
            try:
                queryset = queryset.filter(total_time__lte=int(max_time))
            except ValueError:
                pass
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filter by ingredients
        ingredients = self.request.query_params.get('ingredients', None)
        if ingredients:
            ingredient_list = [ing.strip() for ing in ingredients.split(',') if ing.strip()]
            for ingredient in ingredient_list:
                queryset = queryset.filter(
                    Q(recipe_ingredients__ingredient__name__icontains=ingredient) |
                    Q(name__icontains=ingredient) |
                    Q(description__icontains=ingredient)
                ).distinct()
        
        # Filter by dietary preferences
        if self.request.query_params.get('vegetarian') == 'true':
            queryset = queryset.filter(is_vegetarian=True)
        if self.request.query_params.get('vegan') == 'true':
            queryset = queryset.filter(is_vegan=True)
        if self.request.query_params.get('gluten_free') == 'true':
            queryset = queryset.filter(is_gluten_free=True)
        
        return queryset

class RecipeDetailView(generics.RetrieveAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeDetailSerializer
    lookup_field = 'slug'

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class IngredientListView(generics.ListAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

@api_view(['GET'])
def recipe_stats(request):
    """Get overall recipe statistics"""
    stats = {
        'total_recipes': Recipe.objects.count(),
        'avg_time_minutes': Recipe.objects.aggregate(avg_time=Avg('total_time'))['avg_time'] or 0,
        'avg_calories': Recipe.objects.aggregate(avg_cal=Avg('calories_per_serving'))['avg_cal'] or 0,
        'vegetarian_percentage': 0,
        'categories': Category.objects.annotate(recipe_count=Count('recipes')).values('name', 'recipe_count')
    }
    
    total_recipes = stats['total_recipes']
    if total_recipes > 0:
        vegetarian_count = Recipe.objects.filter(is_vegetarian=True).count()
        stats['vegetarian_percentage'] = round((vegetarian_count / total_recipes) * 100)
    
    # Round averages
    stats['avg_time_minutes'] = round(stats['avg_time_minutes'])
    stats['avg_calories'] = round(stats['avg_calories'])
    
    return Response(stats)

@api_view(['GET'])
def featured_recipes(request):
    """Get featured recipes"""
    recipes = Recipe.objects.filter(is_featured=True)[:8]
    serializer = RecipeListSerializer(recipes, many=True)
    return Response(serializer.data)