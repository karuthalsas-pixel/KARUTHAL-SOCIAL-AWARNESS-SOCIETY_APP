import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { galleryItems } from "./schema";

const seedData = [
  {
    title: "Marlowe Residence",
    category: "Residential",
    location: "Portland, OR",
    year: 2024,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    description: "A cedar-clad hillside home organized around a single skylit stair.",
    featured: true,
    order: 1
  },
  {
    title: "Kettle & Vine",
    category: "Hospitality",
    location: "Austin, TX",
    year: 2023,
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    description: "A restaurant interior built around reclaimed oak and warm plaster.",
    featured: true,
    order: 2
  },
  {
    title: "Foundry Lofts",
    category: "Adaptive Reuse",
    location: "Pittsburgh, PA",
    year: 2023,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    description: "A 1920s steel foundry converted into twelve live-work units.",
    featured: false,
    order: 3
  },
  {
    title: "Linden Studio",
    category: "Interiors",
    location: "Brooklyn, NY",
    year: 2022,
    imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
    description: "A ceramicist's live-work studio with north-facing sawtooth glazing.",
    featured: false,
    order: 4
  },
  {
    title: "Harbor Point Pavilion",
    category: "Civic",
    location: "New Bedford, MA",
    year: 2022,
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1600&auto=format&fit=crop",
    description: "A waterfront community pavilion with a folded timber canopy.",
    featured: true,
    order: 5
  },
  {
    title: "Quarry House",
    category: "Residential",
    location: "Asheville, NC",
    year: 2021,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
    description: "A concrete and glass home set into a former stone quarry.",
    featured: false,
    order: 6
  }
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Seeding gallery items...");
  for (const item of seedData) {
    await db.insert(galleryItems).values(item);
  }
  console.log(`Seeded ${seedData.length} gallery items.`);

  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
