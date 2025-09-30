from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, default='🍽️')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def recipe_count(self):
        return self.recipes.count()

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)
    emoji = models.CharField(max_length=10, default='🥗')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Recipe(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    image = models.URLField(max_length=500, help_text="URL to recipe image")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='recipes')
    
    # Time and difficulty
    prep_time = models.PositiveIntegerField(help_text="Preparation time in minutes")
    cook_time = models.PositiveIntegerField(help_text="Cooking time in minutes", default=0)
    total_time = models.PositiveIntegerField(help_text="Total time in minutes")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='easy')
    servings = models.PositiveIntegerField(default=1)
    
    # Nutrition per serving
    calories_per_serving = models.PositiveIntegerField()
    protein_grams = models.FloatField(validators=[MinValueValidator(0)])
    carbs_grams = models.FloatField(validators=[MinValueValidator(0)])
    fat_grams = models.FloatField(validators=[MinValueValidator(0)])
    fiber_grams = models.FloatField(validators=[MinValueValidator(0)], default=0)
    
    # Dietary flags
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    is_dairy_free = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.total_time:
            self.total_time = self.prep_time + self.cook_time
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='recipe_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=50, help_text="e.g., '2 cups', '1 tbsp'")
    notes = models.CharField(max_length=200, blank=True, help_text="e.g., 'chopped', 'optional'")
    
    class Meta:
        unique_together = ['recipe', 'ingredient']
    
    def __str__(self):
        return f"{self.quantity} {self.ingredient.name}"
    
    @property
    def ingredient_name(self):
        return self.ingredient.name
    
    @property
    def ingredient_emoji(self):
        return self.ingredient.emoji

class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    step_number = models.PositiveIntegerField()
    instruction = models.TextField()
    time_minutes = models.PositiveIntegerField(default=0, help_text="Time for this step in minutes")
    
    class Meta:
        unique_together = ['recipe', 'step_number']
        ordering = ['step_number']
    
    def __str__(self):
        return f"Step {self.step_number}: {self.instruction[:50]}..."

class RecipeTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#10b981', help_text="Hex color code")
    
    def __str__(self):
        return self.name

class Recipe_Tag(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='recipe_tags')
    tag = models.ForeignKey(RecipeTag, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['recipe', 'tag']