from sqlalchemy.orm import Session

from app.models.recipe import Recipe


def match_recipes(
    db: Session,
    detected_ingredients: list[str],
    top_n: int = 10,
) -> list[dict]:
    """
    Compare detected ingredients against all recipes in the database.
    Score each recipe by how many of its ingredients are present
    in the detected list, then return the top N matches.
    """

    # Normalize detected ingredients to lowercase
    detected_set = {ing.strip().lower() for ing in detected_ingredients}

    if not detected_set:
        return []

    # Load all recipes with their ingredients
    recipes = db.query(Recipe).all()

    scored = []
    for recipe in recipes:
        # Get the set of ingredient names for this recipe
        recipe_ingredients = {
            ing.name.strip().lower()
            for ing in recipe.ingredients
        }

        if not recipe_ingredients:
            continue

        # Count how many recipe ingredients appear in detected list
        matched = detected_set & recipe_ingredients  # set intersection
        match_count = len(matched)

        if match_count == 0:
            continue

        # Score = percentage of recipe ingredients you have
        score = match_count / len(recipe_ingredients)

        scored.append({
            "recipe": recipe,
            "match_count": match_count,
            "total_ingredients": len(recipe_ingredients),
            "score": round(score, 2),
            "matched_ingredients": sorted(matched),
        })

    # Sort by score descending, then by match_count descending
    scored.sort(key=lambda x: (x["score"], x["match_count"]), reverse=True)

    # Return top N
    return scored[:top_n]