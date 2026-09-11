import { db } from "./db";
import { galleryItems } from "./schema";
import { FALLBACK_GALLERY } from "./gallery-data";

async function main() {
  console.log("Seeding gallery items...");
  try {
    for (const item of FALLBACK_GALLERY) {
      await db.insert(galleryItems).values({
        title: item.title,
        category: item.category,
        location: item.location,
        year: item.year,
        imageUrl: item.imageUrl,
        description: item.description,
        featured: item.featured,
        order: item.order,
      });
      console.log(`Inserted: ${item.title}`);
    }
    console.log("Gallery seeded successfully.");
  } catch (err) {
    console.error("Error seeding gallery:", err);
  } finally {
    process.exit(0);
  }
}

main();
