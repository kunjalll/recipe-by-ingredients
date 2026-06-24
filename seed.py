import ast

import pandas as pd
from sqlalchemy.orm import Session

from app.core.database import engine
from app.models.recipe import Recipe, RecipeIngredient


def clean_ingredients(raw: str) -> list[str]:
    try:
        items = ast.literal_eval(raw)
        return [str(i).strip().lower() for i in items if str(i).strip()]
    except Exception:
        return []


def seed():
    print("Loading dataset...")
    df = pd.read_csv("data/RAW_recipes.csv")
    df = df[["name", "description", "steps", "ingredients"]].dropna()
    df = df.head(500)

    print(f"Seeding {len(df)} recipes into database...")

    with Session(engine) as db:
        db.query(RecipeIngredient).delete()
        db.query(Recipe).delete()
        db.commit()

        for _, row in df.iterrows():
            ingredients = clean_ingredients(row["ingredients"])

            try:
                steps_list = ast.literal_eval(row["steps"])
                instructions = "\n".join(
                    f"{i+1}. {step}"
                    for i, step in enumerate(steps_list)
                )
            except Exception:
                instructions = str(row["steps"])

            recipe = Recipe(
                title=str(row["name"])[:255],
                description=str(row["description"])[:500]
                if row["description"]
                else None,
                instructions=instructions,
                ingredients=[
                    RecipeIngredient(name=ing[:255])
                    for ing in ingredients
                ],
            )
            db.add(recipe)

        db.commit()
        print("✅ Done! Database seeded successfully.")


if __name__ == "__main__":
    seed()