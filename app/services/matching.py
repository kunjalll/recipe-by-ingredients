from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import fuzz
import numpy as np

from app.models.recipe import Recipe


# Fuzzy match threshold — how similar two words need to be (0-100)
FUZZY_THRESHOLD = 80


def _fuzzy_match(detected: set[str], recipe_ingredients: set[str]) -> set[str]:
    """
    For each recipe ingredient, check if any detected ingredient
    is similar enough using Levenshtein distance (fuzzy matching).
    
    Example: "tomatoes" matches "tomato" even though they're not identical.
    """
    matched = set()
    for recipe_ing in recipe_ingredients:
        for detected_ing in detected:
            # fuzz.ratio computes Levenshtein similarity (0-100)
            similarity = fuzz.ratio(recipe_ing, detected_ing)
            if similarity >= FUZZY_THRESHOLD:
                matched.add(recipe_ing)
                break
    return matched


def _build_tfidf_scores(
    recipes: list[Recipe],
    detected_ingredients: list[str],
) -> dict[int, float]:
    """
    Use TF-IDF (Term Frequency-Inverse Document Frequency) to score
    how relevant each recipe is to the detected ingredients.
    
    This is the same algorithm used by search engines like Google.
    Each recipe's ingredients become a 'document', and the detected
    ingredients become the 'search query'.
    """
    # Build documents — one string of ingredients per recipe
    documents = []
    recipe_ids = []
    for recipe in recipes:
        ingredient_text = " ".join(
            ing.name.lower() for ing in recipe.ingredients
        )
        if ingredient_text.strip():
            documents.append(ingredient_text)
            recipe_ids.append(recipe.id)

    if not documents:
        return {}

    # Build the query from detected ingredients
    query = " ".join(detected_ingredients)

    # Fit TF-IDF on all recipe documents + the query
    vectorizer = TfidfVectorizer()
    all_texts = documents + [query]
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Query vector is the last row
    query_vector = tfidf_matrix[-1]
    recipe_vectors = tfidf_matrix[:-1]

    # Compute cosine similarity between query and each recipe
    similarities = cosine_similarity(query_vector, recipe_vectors)[0]

    return dict(zip(recipe_ids, similarities))


def match_recipes(
    db: Session,
    detected_ingredients: list[str],
    top_n: int = 10,
) -> list[dict]:
    """
    Main matching function combining:
    1. TF-IDF cosine similarity (search engine ranking)
    2. Fuzzy set intersection (Levenshtein distance matching)
    
    Final score = 60% TF-IDF + 40% Fuzzy Match Coverage
    """
    if not detected_ingredients:
        return []

    # Normalize detected ingredients
    detected_set = {ing.strip().lower() for ing in detected_ingredients}

    # Load all recipes
    recipes = db.query(Recipe).all()
    if not recipes:
        return []

    # Step 1: Get TF-IDF scores for all recipes
    tfidf_scores = _build_tfidf_scores(recipes, list(detected_set))

    scored = []
    for recipe in recipes:
        recipe_ingredients = {
            ing.name.strip().lower()
            for ing in recipe.ingredients
        }
        if not recipe_ingredients:
            continue

        # Step 2: Fuzzy match — finds "tomatoes" == "tomato" etc.
        fuzzy_matched = _fuzzy_match(detected_set, recipe_ingredients)
        match_count = len(fuzzy_matched)

        if match_count == 0:
            continue

        # Step 3: Coverage score (what % of recipe ingredients do you have)
        coverage_score = match_count / len(recipe_ingredients)

        # Step 4: TF-IDF score for this recipe
        tfidf_score = float(tfidf_scores.get(recipe.id, 0.0))

        # Step 5: Combined final score (60% TF-IDF + 40% coverage)
        final_score = (0.6 * tfidf_score) + (0.4 * coverage_score)

        scored.append({
            "recipe": recipe,
            "match_count": match_count,
            "total_ingredients": len(recipe_ingredients),
            "score": round(final_score, 4),
            "tfidf_score": round(tfidf_score, 4),
            "coverage_score": round(coverage_score, 4),
            "matched_ingredients": sorted(fuzzy_matched),
        })

    # Sort by final score descending
    scored.sort(key=lambda x: x["score"], reverse=True)

    return scored[:top_n]