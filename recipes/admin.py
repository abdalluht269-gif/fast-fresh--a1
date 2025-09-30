from django.contrib import admin
from .models import Category, Ingredient, Recipe, RecipeIngredient, RecipeStep, RecipeTag, Recipe_Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'emoji', 'recipe_count', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ['name', 'emoji', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1

class RecipeStepInline(admin.TabularInline):
    model = RecipeStep
    extra = 1

class RecipeTagInline(admin.TabularInline):
    model = Recipe_Tag
    extra = 1

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'total_time', 'difficulty', 'calories_per_serving', 'is_featured', 'created_at']
    list_filter = ['category', 'difficulty', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    inlines = [RecipeIngredientInline, RecipeStepInline, RecipeTagInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'image', 'category')
        }),
        ('Time & Difficulty', {
            'fields': ('prep_time', 'cook_time', 'total_time', 'difficulty', 'servings')
        }),
        ('Nutrition (per serving)', {
            'fields': ('calories_per_serving', 'protein_grams', 'carbs_grams', 'fat_grams', 'fiber_grams')
        }),
        ('Dietary Information', {
            'fields': ('is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_dairy_free')
        }),
        ('Metadata', {
            'fields': ('is_featured', 'created_at', 'updated_at')
        }),
    )

@admin.register(RecipeTag)
class RecipeTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color']
    search_fields = ['name']