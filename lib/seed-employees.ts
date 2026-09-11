import "dotenv/config";
import { db } from "./db";
import { employees } from "./schema";
import * as fs from "fs";
import * as path from "path";
import { sql } from "drizzle-orm";

const staffList = [
  {
    name: "ABRAHAM OOMMEN",
    role: "Patron",
    address: "GRACE COTTAGE\nMANJADI P.O. 689105\nKATTOD, THIRUVALLA",
    phone: "9995767469"
  },
  {
    name: "KURIAN MATHEW",
    role: "President",
    address: "VENPARAMPILSALEM HOUSE\nNEAR PUSHPAGIRI HOSPITAL\nTHIRUVALLA P.O-689101",
    phone: "+91 9447120692"
  },
  {
    name: "MATHEW ABRAHAM",
    role: "Vice President",
    address: "LATHARA PUTHENPARAMPIL HOUSE\nAMICHAKARY P.O. - 689112",
    phone: "9961538398"
  },
  {
    name: "BLESSEN DAVID",
    role: "Secretary",
    address: "THUNDIL PUTHENVEEDU\nMANAKALA P.O-691551\nERATHU, PATHANAMTHITTA",
    phone: "79941 20288"
  },
  {
    name: "VINEESH K MURIKKATTU",
    role: "Joint Secretary",
    address: "MURIKKATTU HOUSE\nNALUNNAKKAL P.O. 686538\nVAKATHANAM, KOTTAYAM",
    phone: "9447809842"
  },
  {
    name: "ANOOP. R.V",
    role: "Treasurer",
    address: "FAITH COTTAGE\nNRWA-810, TC-18/954/7\nPARAKOOTAM LANE\nKUNNAPUZHA. 695032\nTHIRUVANANTHAPURAM",
    phone: "90203 33554"
  },
  {
    name: "JOB K. THOMAS",
    role: "Executive Member/Office Administrator",
    address: "KUMBLOLIL HOUSE\nNARAKATHANI P.O. 689544\nVENNIKULAM PATHANAMTHITTA",
    phone: "9526084984"
  },
  {
    name: "SAMSON P BABY",
    role: "Executive Member",
    address: "NEDUMPARAYIL HOUSE\nARAMANAPPADY\nCHANGANACHERRY\nKOTTAYAM-686101",
    phone: "9400183181"
  },
  {
    name: "JOHNSON SAMUEL",
    role: "Executive Member",
    address: "KALLENCHENNMMURY HOUSE\nSHARON PRAYER CENTER\nKANGARAPPADY\nVADACODE.P.O. 682021, ERNAKULAM",
    phone: "9446107026"
  },
  {
    name: "ARUN G K",
    role: "Executive Member",
    address: "KOOTTAMA VILAI\nMARUTHENCODE\nVILAVANCODE, KANNIYAKUMARI\nTAMIL NADU-629163",
    phone: "94864 45004"
  },
  {
    name: "MONCY P. M",
    role: "Executive Member",
    address: "FAITH HOME\nPUNNAIKUNNAM\nEDAKKODE P.O, 695104\nTHIRUVANATHAPURAM",
    phone: "9633203593"
  },
  {
    name: "MATHEW MUNJANNATTU GEEVARUGHESE",
    role: "Executive Member",
    address: "MUNIANNATTU HOUSE\nKAVIYOOR THOTTABHAGOM.\nPATHANAMTHITTA - 689541",
    phone: "+91 80891 95183"
  },
  {
    name: "BIJU EAPEN",
    role: "Executive Member",
    address: "PARUTHIKATTIL HOUSE\nMANJADI P.O, 689105\nTHIRUVALLA",
    phone: "9745383915"
  },
  {
    name: "SALU VARGHESE",
    role: "Executive Member",
    address: "PARUTHIMOOTTTIL HOUSE\nERAVIPEROOR P.O.\nTHIRUVALLA-689542",
    phone: "9847820405"
  },
  {
    name: "SAJAN YOHANNAN",
    role: "Executive Member",
    address: "SAJAN BHAVAN\nKALAPPILACHEPRA P.O, 691520\nELAMAD, CHEPPARA, KOLLAM",
    phone: "97461 68687"
  },
  {
    name: "ABRAHAM PHILIPOSE",
    role: "Executive Member",
    address: "KIZHAKKEMUTTATHIL\nNEAR CENTURY HOSPITAL\nMULAKUZHA(PART) 689505\nCHENGANNUR ALAPUZHA",
    phone: "9633135772"
  },
  {
    name: "BENNY P. JOHN",
    role: "Executive Member",
    address: "SASI MANDIRAM,\nKOZHIKKODE, KATTADI P.O.,\nPOOYAPPALLY, KOLLAM",
    phone: "9048944345"
  },
  {
    name: "AKSA JOY",
    role: "Executive Member",
    address: "EDAPPARAYIL\nVATTAKKATTUPADY\nPERUMBAVOOR P.O.\nTEL: 9495747877",
    phone: "9495747877"
  }
];

async function seedEmployees() {
  console.log("Seeding employees...");
  
  // Clear existing to avoid duplicates
  await db.execute(sql`TRUNCATE TABLE employees RESTART IDENTITY;`);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "employees");
  let uploadedFiles: string[] = [];
  
  try {
    if (fs.existsSync(uploadsDir)) {
      uploadedFiles = fs.readdirSync(uploadsDir);
    }
  } catch (err) {
    console.log("Uploads directory not found or cannot be read.");
  }

  for (let i = 0; i < staffList.length; i++) {
    const staff = staffList[i];
    
    // Attempt to find a matching image file
    // e.g. if name is "ABRAHAM OOMMEN", look for "abraham oommen.jpg" or "abraham_oommen.png"
    let imageUrl = null;
    
    const normalizedName = staff.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    for (const file of uploadedFiles) {
      const normalizedFileName = file.split(".")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      if (normalizedFileName === normalizedName) {
        imageUrl = `/uploads/employees/${file}`;
        break;
      }
    }

    await db.insert(employees).values({
      name: staff.name,
      role: staff.role,
      address: staff.address,
      phone: staff.phone,
      order: i + 1,
      imageUrl: imageUrl,
    });
    
    console.log(`Inserted ${staff.name} ${imageUrl ? "(Found image)" : "(No image found)"}`);
  }

  console.log("Done seeding employees!");
  process.exit(0);
}

seedEmployees().catch((err) => {
  console.error(err);
  process.exit(1);
});
