from django.core.management.base import BaseCommand
from recipes.models import Category, Ingredient, Recipe, RecipeIngredient, RecipeStep, RecipeTag, Recipe_Tag

class Command(BaseCommand):
    help = 'Populate database with sample healthy recipes'

    def handle(self, *args, **options):
        self.stdout.write('Creating categories...')
        
        # Create categories
        categories_data = [
            {'name': 'Salads', 'emoji': '🥗', 'description': 'Fresh and healthy salads'},
            {'name': 'Smoothies', 'emoji': '🥤', 'description': 'Nutritious smoothies and drinks'},
            {'name': 'Soups', 'emoji': '🍲', 'description': 'Warm and comforting soups'},
            {'name': 'Bowls', 'emoji': '🍜', 'description': 'Healthy bowl recipes'},
            {'name': 'Snacks', 'emoji': '🍎', 'description': 'Quick and healthy snacks'},
            {'name': 'Wraps', 'emoji': '🌯', 'description': 'Healthy wraps and sandwiches'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create ingredients
        ingredients_data = [
            {'name': 'tomatoes', 'emoji': '🍅'},
            {'name': 'cucumber', 'emoji': '🥒'},
            {'name': 'spinach', 'emoji': '🥬'},
            {'name': 'avocado', 'emoji': '🥑'},
            {'name': 'quinoa', 'emoji': '🌾'},
            {'name': 'chickpeas', 'emoji': '🫘'},
            {'name': 'banana', 'emoji': '🍌'},
            {'name': 'berries', 'emoji': '🫐'},
            {'name': 'mango', 'emoji': '🥭'},
            {'name': 'feta cheese', 'emoji': '🧀'},
            {'name': 'olive oil', 'emoji': '🫒'},
            {'name': 'lemon', 'emoji': '🍋'},
            {'name': 'greek yogurt', 'emoji': '🥛'},
            {'name': 'honey', 'emoji': '🍯'},
            {'name': 'almonds', 'emoji': '🌰'},
            {'name': 'kale', 'emoji': '🥬'},
            {'name': 'apple', 'emoji': '🍎'},
            {'name': 'carrots', 'emoji': '🥕'},
            {'name': 'bell peppers', 'emoji': '🫑'},
            {'name': 'onion', 'emoji': '🧅'},
        ]
        
        ingredients = {}
        for ing_data in ingredients_data:
            ingredient, created = Ingredient.objects.get_or_create(
                name=ing_data['name'],
                defaults=ing_data
            )
            ingredients[ing_data['name']] = ingredient
            if created:
                self.stdout.write(f'Created ingredient: {ingredient.name}')

        # Create tags
        tags_data = [
            {'name': 'vegetarian', 'color': '#10b981'},
            {'name': 'vegan', 'color': '#059669'},
            {'name': 'gluten-free', 'color': '#f59e0b'},
            {'name': 'quick', 'color': '#3b82f6'},
            {'name': 'healthy', 'color': '#8b5cf6'},
            {'name': 'mediterranean', 'color': '#06b6d4'},
            {'name': 'protein-rich', 'color': '#ef4444'},
            {'name': 'low-carb', 'color': '#f97316'},
        ]
        
        tags = {}
        for tag_data in tags_data:
            tag, created = RecipeTag.objects.get_or_create(
                name=tag_data['name'],
                defaults=tag_data
            )
            tags[tag_data['name']] = tag
            if created:
                self.stdout.write(f'Created tag: {tag.name}')

        # Create recipes
        recipes_data = [
            {
                'name': 'Mediterranean Salad',
                'description': 'A fresh and healthy Mediterranean salad perfect for a quick lunch or light dinner.',
                'image': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
                'category': 'Salads',
                'prep_time': 15,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 2,
                'calories_per_serving': 220,
                'protein_grams': 8,
                'carbs_grams': 12,
                'fat_grams': 18,
                'fiber_grams': 4,
                'is_vegetarian': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'tomatoes', 'quantity': '2 medium'},
                    {'name': 'cucumber', 'quantity': '1 large'},
                    {'name': 'feta cheese', 'quantity': '100g'},
                    {'name': 'olive oil', 'quantity': '2 tbsp'},
                ],
                'steps': [
                    'Chop tomatoes and cucumber into bite-sized pieces',
                    'Add feta cheese and mix gently',
                    'Drizzle with olive oil and season with salt and pepper',
                    'Toss gently and serve immediately'
                ],
                'tags': ['vegetarian', 'quick', 'healthy', 'mediterranean']
            },
            {
                'name': 'Tropical Mango Smoothie',
                'description': 'Refreshing tropical smoothie packed with vitamins and natural sweetness.',
                'image': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400',
                'category': 'Smoothies',
                'prep_time': 5,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 1,
                'calories_per_serving': 180,
                'protein_grams': 6,
                'carbs_grams': 28,
                'fat_grams': 2,
                'fiber_grams': 8,
                'is_vegan': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'mango', 'quantity': '1 cup frozen'},
                    {'name': 'banana', 'quantity': '1 medium'},
                    {'name': 'spinach', 'quantity': '1 cup'},
                    {'name': 'greek yogurt', 'quantity': '1/2 cup'},
                ],
                'steps': [
                    'Add all ingredients to blender',
                    'Blend until smooth and creamy',
                    'Add ice if desired consistency is thinner',
                    'Pour into glass and enjoy immediately'
                ],
                'tags': ['vegan', 'quick', 'healthy']
            },
            {
                'name': 'Quinoa Power Bowl',
                'description': 'Nutritious quinoa bowl with fresh vegetables and protein.',
                'image': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
                'category': 'Bowls',
                'prep_time': 15,
                'cook_time': 15,
                'difficulty': 'medium',
                'servings': 2,
                'calories_per_serving': 340,
                'protein_grams': 12,
                'carbs_grams': 45,
                'fat_grams': 8,
                'fiber_grams': 6,
                'is_vegetarian': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'quinoa', 'quantity': '1 cup'},
                    {'name': 'chickpeas', 'quantity': '1/2 cup'},
                    {'name': 'avocado', 'quantity': '1 medium'},
                    {'name': 'spinach', 'quantity': '2 cups'},
                ],
                'steps': [
                    'Cook quinoa according to package instructions',
                    'Prepare vegetables and chickpeas',
                    'Arrange quinoa in bowl with toppings',
                    'Drizzle with dressing and serve'
                ],
                'tags': ['vegetarian', 'healthy', 'protein-rich']
            },
            {
                'name': 'Fresh Veggie Wrap',
                'description': 'Light and fresh vegetable wrap perfect for lunch on the go.',
                'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
                'category': 'Wraps',
                'prep_time': 10,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 1,
                'calories_per_serving': 280,
                'protein_grams': 10,
                'carbs_grams': 35,
                'fat_grams': 12,
                'fiber_grams': 5,
                'is_vegetarian': True,
                'ingredients': [
                    {'name': 'spinach', 'quantity': '1 cup'},
                    {'name': 'tomatoes', 'quantity': '1 medium'},
                    {'name': 'cucumber', 'quantity': '1/2 medium'},
                    {'name': 'avocado', 'quantity': '1/2 medium'},
                ],
                'steps': [
                    'Lay out wrap on flat surface',
                    'Add spinach leaves as base',
                    'Add sliced vegetables',
                    'Roll tightly and slice in half'
                ],
                'tags': ['vegetarian', 'quick', 'healthy']
            },
            {
                'name': 'Berry Protein Smoothie',
                'description': 'Antioxidant-rich berry smoothie with added protein.',
                'image': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
                'category': 'Smoothies',
                'prep_time': 5,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 1,
                'calories_per_serving': 200,
                'protein_grams': 15,
                'carbs_grams': 25,
                'fat_grams': 3,
                'fiber_grams': 8,
                'is_vegetarian': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'berries', 'quantity': '1 cup mixed'},
                    {'name': 'banana', 'quantity': '1/2 medium'},
                    {'name': 'greek yogurt', 'quantity': '1/2 cup'},
                    {'name': 'honey', 'quantity': '1 tsp'},
                ],
                'steps': [
                    'Add all ingredients to blender',
                    'Blend until smooth',
                    'Adjust sweetness with honey if needed',
                    'Serve immediately'
                ],
                'tags': ['vegetarian', 'quick', 'protein-rich']
            },
            {
                'name': 'Avocado Toast Supreme',
                'description': 'Elevated avocado toast with fresh toppings and herbs.',
                'image': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
                'category': 'Snacks',
                'prep_time': 8,
                'cook_time': 2,
                'difficulty': 'easy',
                'servings': 1,
                'calories_per_serving': 250,
                'protein_grams': 8,
                'carbs_grams': 20,
                'fat_grams': 18,
                'fiber_grams': 10,
                'is_vegetarian': True,
                'ingredients': [
                    {'name': 'avocado', 'quantity': '1 medium'},
                    {'name': 'tomatoes', 'quantity': '1/2 medium'},
                    {'name': 'lemon', 'quantity': '1/2 juiced'},
                ],
                'steps': [
                    'Toast bread until golden',
                    'Mash avocado with lemon juice',
                    'Spread avocado on toast',
                    'Top with sliced tomatoes and season'
                ],
                'tags': ['vegetarian', 'quick', 'healthy']
            }
        ]

        for recipe_data in recipes_data:
            # Create recipe
            recipe, created = Recipe.objects.get_or_create(
                name=recipe_data['name'],
                defaults={
                    'description': recipe_data['description'],
                    'image': recipe_data['image'],
                    'category': categories[recipe_data['category']],
                    'prep_time': recipe_data['prep_time'],
                    'cook_time': recipe_data['cook_time'],
                    'difficulty': recipe_data['difficulty'],
                    'servings': recipe_data['servings'],
                    'calories_per_serving': recipe_data['calories_per_serving'],
                    'protein_grams': recipe_data['protein_grams'],
                    'carbs_grams': recipe_data['carbs_grams'],
                    'fat_grams': recipe_data['fat_grams'],
                    'fiber_grams': recipe_data['fiber_grams'],
                    'is_vegetarian': recipe_data.get('is_vegetarian', False),
                    'is_vegan': recipe_data.get('is_vegan', False),
                    'is_gluten_free': recipe_data.get('is_gluten_free', False),
                    'is_featured': True,
                }
            )
            
            if created:
                self.stdout.write(f'Created recipe: {recipe.name}')
                
                # Add ingredients
                for ing_data in recipe_data['ingredients']:
                    if ing_data['name'] in ingredients:
                        RecipeIngredient.objects.create(
                            recipe=recipe,
                            ingredient=ingredients[ing_data['name']],
                            quantity=ing_data['quantity']
                        )
                
                # Add steps
                for i, step_text in enumerate(recipe_data['steps'], 1):
                    RecipeStep.objects.create(
                        recipe=recipe,
                        step_number=i,
                        instruction=step_text
                    )
                
                # Add tags
                for tag_name in recipe_data['tags']:
                    if tag_name in tags:
                        Recipe_Tag.objects.create(
                            recipe=recipe,
                            tag=tags[tag_name]
                        )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample recipes!')
        )