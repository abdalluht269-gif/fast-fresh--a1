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
                'name': 'Mediterranean Quinoa Power Bowl',
                'description': 'Nutrient-dense quinoa bowl with Mediterranean vegetables, clinically proven to reduce cardiovascular disease risk by 30%. Rich in complete proteins, fiber, and heart-healthy monounsaturated fats.',
                'image': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
                'category': 'Salads',
                'prep_time': 10,
                'cook_time': 15,
                'difficulty': 'easy',
                'servings': 2,
                'calories_per_serving': 385,
                'protein_grams': 14,
                'carbs_grams': 58,
                'fat_grams': 12,
                'fiber_grams': 8,
                'is_vegetarian': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'quinoa', 'quantity': '1 cup cooked'},
                    {'name': 'tomatoes', 'quantity': '1 cup cherry tomatoes, halved'},
                    {'name': 'cucumber', 'quantity': '1 medium, diced'},
                    {'name': 'bell peppers', 'quantity': '1 red bell pepper, chopped'},
                    {'name': 'feta cheese', 'quantity': '1/2 cup crumbled'},
                    {'name': 'olive oil', 'quantity': '3 tbsp extra virgin'},
                ],
                'steps': [
                    'Cook quinoa according to package directions (15 minutes)',
                    'Prepare vegetables: halve tomatoes, dice cucumber and bell pepper',
                    'Combine cooled quinoa with vegetables in large bowl',
                    'Whisk olive oil with lemon juice and seasonings',
                    'Toss with dressing, add feta and fresh herbs'
                ],
                'tags': ['vegetarian', 'high-protein', 'fiber-rich', 'heart-healthy']
            },
            {
                'name': 'Spinach Iron Power Smoothie',
                'description': 'Iron-rich smoothie providing 45% daily vitamin K requirement. Scientifically proven to boost energy levels within 30 minutes and support healthy blood oxygen transport.',
                'image': 'https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?w=400',
                'category': 'Smoothies',
                'prep_time': 5,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 1,
                'calories_per_serving': 245,
                'protein_grams': 8,
                'carbs_grams': 42,
                'fat_grams': 6,
                'fiber_grams': 8,
                'is_vegan': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'spinach', 'quantity': '2 cups fresh'},
                    {'name': 'banana', 'quantity': '1 medium'},
                    {'name': 'mango', 'quantity': '1/2 cup frozen chunks'},
                    {'name': 'almonds', 'quantity': '2 tbsp raw'},
                    {'name': 'chia seeds', 'quantity': '1 tbsp'},
                    {'name': 'coconut water', 'quantity': '1 cup'},
                ],
                'steps': [
                    'Wash spinach thoroughly and add to blender',
                    'Add banana, mango, almonds, and chia seeds',
                    'Pour in coconut water and blend on high for 60 seconds',
                    'Blend until completely smooth and creamy',
                    'Pour into glass and consume within 15 minutes for maximum nutrient absorption'
                ],
                'tags': ['vegan', 'iron-rich', 'vitamin-k', 'energy-boost']
            },
            {
                'name': 'Turmeric Anti-Inflammatory Lentil Soup',
                'description': 'Curcumin-rich soup clinically shown to reduce inflammation markers by 58%. Contains bioavailable turmeric with black pepper for maximum absorption and therapeutic benefits.',
                'image': 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?w=400',
                'category': 'Soups',
                'prep_time': 10,
                'cook_time': 25,
                'difficulty': 'medium',
                'servings': 2,
                'calories_per_serving': 298,
                'protein_grams': 18,
                'carbs_grams': 45,
                'fat_grams': 4,
                'fiber_grams': 16,
                'is_vegan': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'red lentils', 'quantity': '1 cup dried'},
                    {'name': 'turmeric', 'quantity': '2 tsp ground'},
                    {'name': 'ginger', 'quantity': '1 tbsp fresh, minced'},
                    {'name': 'carrots', 'quantity': '2 medium, diced'},
                    {'name': 'onion', 'quantity': '1 medium, diced'},
                    {'name': 'vegetable broth', 'quantity': '4 cups low-sodium'},
                ],
                'steps': [
                    'Rinse red lentils until water runs clear',
                    'Sauté onion, carrots, ginger in pot for 5 minutes',
                    'Add turmeric and cook for 30 seconds until fragrant',
                    'Add lentils and broth, bring to boil',
                    'Simmer covered for 20 minutes until lentils are tender',
                    'Season with salt, pepper, and fresh herbs before serving'
                ],
                'tags': ['vegan', 'anti-inflammatory', 'protein-rich', 'immune-boost']
            },
            {
                'name': 'Avocado Chickpea Power Salad',
                'description': 'Monounsaturated fat-rich salad proven to increase satiety by 40% and support healthy weight management. Contains complete proteins and 14g fiber for sustained energy.',
                'image': 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=400',
                'category': 'Salads',
                'prep_time': 15,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 2,
                'calories_per_serving': 342,
                'protein_grams': 12,
                'carbs_grams': 28,
                'fat_grams': 22,
                'fiber_grams': 14,
                'is_vegan': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'chickpeas', 'quantity': '1 can (15oz), drained and rinsed'},
                    {'name': 'avocado', 'quantity': '1 large, cubed'},
                    {'name': 'spinach', 'quantity': '4 cups baby spinach'},
                    {'name': 'tomatoes', 'quantity': '1 cup cherry tomatoes, halved'},
                    {'name': 'cucumber', 'quantity': '1 medium, diced'},
                    {'name': 'lemon', 'quantity': '2 tbsp fresh juice'},
                ],
                'steps': [
                    'Drain and rinse chickpeas, pat dry with paper towel',
                    'Cube avocado and immediately toss with lemon juice',
                    'Combine spinach, tomatoes, and cucumber in large bowl',
                    'Add chickpeas and avocado to vegetables',
                    'Drizzle with olive oil and seasonings, toss gently'
                ],
                'tags': ['vegan', 'healthy-fats', 'protein-rich', 'weight-loss']
            },
            {
                'name': 'Blueberry Brain-Boost Smoothie',
                'description': 'Anthocyanin-rich smoothie scientifically proven to improve memory function by 23% in 12 weeks. Contains natural compounds that cross the blood-brain barrier for cognitive enhancement.',
                'image': 'https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?w=400',
                'category': 'Smoothies',
                'prep_time': 5,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 1,
                'calories_per_serving': 287,
                'protein_grams': 11,
                'carbs_grams': 48,
                'fat_grams': 7,
                'fiber_grams': 8,
                'is_vegetarian': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'blueberries', 'quantity': '1 cup frozen'},
                    {'name': 'banana', 'quantity': '1 medium'},
                    {'name': 'greek yogurt', 'quantity': '1/2 cup'},
                    {'name': 'oats', 'quantity': '1/4 cup rolled'},
                    {'name': 'almond milk', 'quantity': '3/4 cup unsweetened'},
                    {'name': 'honey', 'quantity': '1 tbsp raw'},
                ],
                'steps': [
                    'Add oats to blender first and pulse to create oat flour',
                    'Add frozen blueberries, banana, and Greek yogurt',
                    'Pour in almond milk and add honey',
                    'Blend on high for 90 seconds until completely smooth',
                    'Serve immediately for optimal antioxidant potency'
                ],
                'tags': ['vegetarian', 'antioxidants', 'brain-health', 'fiber-rich']
            },
            {
                'name': 'Omega-3 Walnut Energy Bites',
                'description': 'ALA omega-3 rich snack providing 2.5g per serving, proven to improve cognitive function by 18%. Contains natural compounds that support brain health and sustained energy release.',
                'image': 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400',
                'category': 'Snacks',
                'prep_time': 12,
                'cook_time': 0,
                'difficulty': 'easy',
                'servings': 4,
                'calories_per_serving': 312,
                'protein_grams': 9,
                'carbs_grams': 28,
                'fat_grams': 20,
                'fiber_grams': 6,
                'is_vegan': True,
                'is_gluten_free': True,
                'ingredients': [
                    {'name': 'walnuts', 'quantity': '1 cup raw'},
                    {'name': 'dates', 'quantity': '8 medjool, pitted'},
                    {'name': 'chia seeds', 'quantity': '2 tbsp'},
                    {'name': 'cocoa powder', 'quantity': '2 tbsp raw'},
                    {'name': 'vanilla extract', 'quantity': '1 tsp pure'},
                    {'name': 'coconut flakes', 'quantity': '2 tbsp unsweetened'},
                ],
                'steps': [
                    'Soak dates in warm water for 10 minutes if very dry',
                    'Process walnuts in food processor until finely chopped',
                    'Add dates, chia seeds, cocoa powder, and vanilla',
                    'Process until mixture forms a sticky dough',
                    'Roll into 16 small balls using damp hands',
                    'Roll in coconut flakes and refrigerate for 30 minutes'
                ],
                'tags': ['vegan', 'brain-health', 'omega-3', 'cognitive-function']
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