from rest_framework import serializers
from .models import Recipe, Category, Ingredient, RecipeIngredient, RecipeStep, RecipeTag

class CategorySerializer(serializers.ModelSerializer):
    recipe_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'emoji', 'recipe_count']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'emoji', 'description']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.ReadOnlyField()
    ingredient_emoji = serializers.ReadOnlyField()
    
    class Meta:
        model = RecipeIngredient
        fields = ['ingredient_name', 'ingredient_emoji', 'quantity', 'notes']

class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ['step_number', 'instruction', 'time_minutes']

class RecipeTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeTag
        fields = ['name', 'color']

class RecipeListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True)
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'category', 'tags',
            'total_time', 'difficulty', 'calories_per_serving', 'servings',
            'protein_grams', 'carbs_grams', 'fat_grams', 'fiber_grams',
            'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_dairy_free',
            'is_featured'
        ]
    
    def get_tags(self, obj):
        return [tag.tag.name for tag in obj.recipe_tags.all()]

class RecipeDetailSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True)
    recipe_ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'category',
            'prep_time', 'cook_time', 'total_time', 'difficulty', 'servings',
            'calories_per_serving', 'protein_grams', 'carbs_grams', 'fat_grams', 'fiber_grams',
            'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_dairy_free',
            'recipe_ingredients', 'steps', 'tags', 'is_featured', 'created_at'
        ]
    
    def get_tags(self, obj):
        return [tag.tag.name for tag in obj.recipe_tags.all()]