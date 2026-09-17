"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Bot } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; followUp?: string[] };

// ────────────────────────────────────────────────────────────────
// COMPREHENSIVE KNOWLEDGE BASE
// Each entry has: keywords (trigger words), weight (importance),
// and answer. The scoring engine picks the best match.
// ────────────────────────────────────────────────────────────────
interface KBEntry {
  id: string;
  keywords: string[];
  weight: number;
  answer: string;
  followUp?: string[]; // suggested follow-up questions
}

const KB: KBEntry[] = [
  // ── GREETINGS ──
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "helo", "hai", "hii", "vanakkam", "namaste", "good morning", "good afternoon", "good evening", "good night", "howdy", "greetings", "ഹലോ"],
    weight: 1,
    answer: "Hello! 👋 Welcome to Karuthal Social Awareness Society!\n\nI can help you with:\n• 📋 Our awareness programs\n• 📞 Contact details & location\n• 📅 How to book a session\n• 🏆 Our achievements\n• 👥 Our team\n\nWhat would you like to know?",
    followUp: ["Our programs", "Contact us", "Book a session", "How are you?"]
  },

  // ── SMALL TALK ──
  {
    id: "small_talk_how_are_you",
    keywords: ["how are you", "how r u", "how do you do", "hope you are well", "how are u"],
    weight: 3,
    answer: "I'm just a helpful AI assistant, but I'm doing great! Thank you for asking! 😊 How are you doing today?",
    followUp: ["I am doing well", "I need help with programs", "Book a session"]
  },
  {
    id: "small_talk_response_good",
    keywords: ["doing well", "im fine", "doing great", "i am good", "fine", "good", "great", "excellent"],
    weight: 1,
    answer: "That's wonderful to hear! 🌟 Is there anything specific I can help you with regarding Karuthal Society today?",
    followUp: ["Our programs", "Contact us"]
  },

  // ── ABOUT ──
  {
    id: "about",
    keywords: ["who", "about", "karuthal", "society", "what is", "organization", "ngo", "trust", "registered", "reg", "founded", "established", "describe", "tell me", "കരുതൽ", "what are you", "what do you do"],
    weight: 2,
    answer: "🏛️ Karuthal Social Awareness Society\n\n• 📌 Reg No: PTM/TC/15/2023\n• 📍 Thiruvalla, Kerala, India\n• 🕰️ 10+ years of service\n• 🎯 Mission: Safeguarding children & youth across India\n\nWe deliver interactive, 1.5-hour School Mission programs for students from LKG to +2. Our sessions combine puppet shows, magic, videos, music, and live student counseling to make social awareness genuinely impactful.",
    followUp: ["What programs do you offer?", "How to book?", "Contact details"]
  },

  // ── LEADERSHIP ──
  {
    id: "leadership",
    keywords: ["president", "founder", "chairman", "director", "who started", "who is the head", "leader", "vinson", "varghese"],
    weight: 3,
    answer: "👥 Leadership\n\nThe President of Karuthal Social Awareness Society is Vinson Varghese. Under his dedicated leadership, the organization strives to safeguard and educate the youth of India against modern social hazards.",
    followUp: ["About Karuthal", "Our programs"]
  },

  // ── ALL PROGRAMS OVERVIEW ──
  {
    id: "programs_overview",
    keywords: ["program", "service", "offer", "awareness", "session", "mission", "school mission", "what do you teach", "curriculum", "topics", "subjects", "all programs", "list programs"],
    weight: 3,
    answer: "📚 Our 5 Core Awareness Programs\n(Each session is 1.5 hours, interactive & visual)\n\n1. 🛡️ Child Protection & Safety\n2. 🚫 Anti-Addiction Guidance\n3. 📱 Cyber & Mobile Trap Safety\n4. 🚦 Road Safety & Speed Caution\n5. 🥗 Healthy Lifestyle & Nutrition\n\nAll programs use puppet shows, magic tricks, videos, music, and live counseling for maximum impact!\n\nAsk me about any specific program for more details.",
    followUp: ["Child protection", "Anti-addiction", "Cyber safety", "Road safety", "Healthy lifestyle"]
  },

  // ── CHILD PROTECTION ──
  {
    id: "child_protection",
    keywords: ["child", "protection", "abuse", "good touch", "bad touch", "boundary", "personal", "pocso", "sexual", "molest", "harassment", "safe touch", "unsafe touch", "report abuse"],
    weight: 3,
    answer: "🛡️ Child Protection & Safety Program\n\nThis program sensitizes students on:\n• Good Touch vs Bad Touch awareness\n• Understanding personal body boundaries\n• Recognizing and reporting abuse\n• Building courage to speak up to trusted adults\n• POCSO Act awareness (age-appropriate)\n\nDelivered by experienced, trained student counselors in a safe, supportive environment.",
    followUp: ["Other programs", "Book this program", "Contact us"]
  },

  // ── ANTI-ADDICTION ──
  {
    id: "anti_addiction",
    keywords: ["drug", "alcohol", "addiction", "substance", "de-addiction", "tobacco", "smoking", "cigarette", "liquor", "narcotics", "withdrawal", "rehab", "abuse substances", "intoxication", "drink"],
    weight: 3,
    answer: "🚫 Anti-Addiction Guidance Program\n\nThis program educates students on:\n• Physical consequences of drugs & alcohol\n• Mental health impacts of substance abuse\n• Social and family consequences\n• How peer pressure leads to addiction\n• Building confidence to say NO\n• Pathways to recovery & support\n\nTargeted for LKG to +2 students with age-appropriate content.",
    followUp: ["Other programs", "Book this program", "Contact us"]
  },

  // ── CYBER SAFETY ──
  {
    id: "cyber_safety",
    keywords: ["cyber", "mobile", "internet", "online", "social media", "instagram", "facebook", "tiktok", "scam", "trap", "grooming", "phishing", "hacking", "screen time", "digital", "app", "gaming", "addiction online", "cyberbullying", "bully online"],
    weight: 3,
    answer: "📱 Cyber & Mobile Trap Safety Program\n\nThis program covers:\n• Safe social media habits\n• Recognizing online grooming & predators\n• Protecting personal information online\n• Identifying digital scams & phishing\n• Managing screen time & mobile addiction\n• Cyberbullying — how to respond\n• Privacy settings & safe browsing\n\nEssential for the digital generation!",
    followUp: ["Other programs", "Book this program", "Contact us"]
  },

  // ── ROAD SAFETY ──
  {
    id: "road_safety",
    keywords: ["road", "traffic", "safety", "speed", "accident", "driving", "helmet", "seatbelt", "signal", "rash driving", "vehicle", "bike", "car", "drunk driving", "pedestrian"],
    weight: 3,
    answer: "🚦 Road Safety & Speed Caution Program\n\nThis program instills:\n• Traffic rules & signal awareness\n• Dangers of speeding & rash driving\n• Importance of helmets & seatbelts\n• Consequences of drunk driving\n• Pedestrian safety habits\n• Road accident statistics & reality\n\nEspecially important for adolescent youth who are approaching driving age.",
    followUp: ["Other programs", "Book this program", "Contact us"]
  },

  // ── HEALTHY LIFESTYLE ──
  {
    id: "healthy_lifestyle",
    keywords: ["health", "nutrition", "food", "diet", "lifestyle", "eating", "wellness", "junk food", "fast food", "obesity", "exercise", "fitness", "balanced", "vegetable", "fruit", "water", "healthy habit"],
    weight: 3,
    answer: "🥗 Healthy Lifestyle & Nutrition Program\n\nThis program guides students on:\n• Benefits of balanced nutrition\n• Dangers of excessive junk food & fast food\n• Building healthy eating habits early\n• Importance of physical activity\n• Hydration & sleep habits\n• Simple nutritional planning for children\n\nHelps children make smarter food choices for a healthier future.",
    followUp: ["Other programs", "Book this program", "Contact us"]
  },

  // ── CONTACT & LOCATION ──
  {
    id: "contact_location",
    keywords: ["contact", "reach", "call", "phone", "number", "email", "mail", "whatsapp", "message", "get in touch", "communicate", "talk", "speak", "enquiry", "inquiry", "helpline", "address", "location", "where", "place", "thiruvalla", "kerala", "office", "headquarters", "situated", "find you", "directions", "map", "kuttapuzha"],
    weight: 4,
    answer: "KARUTHAL SOCIAL AWARENESS SOCIETY\nReg.No: PTM/TC/15/2023\nPB.No.22,\nKUTTAPUZHA P.O THIRUVALLA - 689103\nPATHANAMTHITTA \nKERALA, INDIA\nTel: 9656217909, 9745647909\n\n📧 Email: karuthalsas@gmail.com\n\nYou can also reach out to us using the Contact form on our website!",
    followUp: ["Book a session", "About Karuthal", "Our programs"]
  },

  // ── BOOKING ──
  {
    id: "booking",
    keywords: ["book", "schedule", "appointment", "register", "enroll", "invite", "organise", "organize", "arrange", "plan", "host", "event", "conduct", "request", "apply", "collaborate"],
    weight: 4,
    answer: "📅 How to Book a School Mission Session\n\nTo invite us to your school:\n\n1️⃣ Call or WhatsApp us:\n   📞 9745647909 (Call)\n   📱 9656217909 (WhatsApp)\n\n2️⃣ Email us:\n   📧 karuthalsas@gmail.com\n\n3️⃣ Fill the Contact form on our website\n\nPlease share:\n• School name & location\n• Estimated number of students\n• Preferred date & time\n• Grade levels attending\n\nOur team will confirm and plan the session for you!",
    followUp: ["Contact details", "What programs do you offer?", "Session duration"]
  },

  // ── PRICING ──
  {
    id: "pricing",
    keywords: ["fee", "cost", "price", "charge", "free", "paid", "payment", "money", "budget", "affordable", "rate", "tariff", "how much"],
    weight: 3,
    answer: "💰 Program Fees\n\nFor detailed information about program fees and packages, please contact us directly:\n\n📞 9745647909 / 📱 9656217909\n📧 karuthalsas@gmail.com\n\nOur team will provide you with pricing tailored to your school's size and requirements.",
    followUp: ["Book a session", "Contact us"]
  },

  // ── SESSION FORMAT ──
  {
    id: "session_format",
    keywords: ["format", "how does", "what happens", "structure", "activity", "puppet", "magic", "music", "video", "game", "interactive", "counselor", "counselling", "how it works", "method", "approach", "conduct"],
    weight: 3,
    answer: "🎭 How Our Sessions Work\n\nEach 1.5-hour School Mission session is packed with:\n\n🎪 Puppet shows — engaging storytelling\n🪄 Magic tricks — capturing attention\n🎬 Video presentations — visual impact\n🎵 Music & songs — emotional connection\n🎮 Interactive games — participatory learning\n👨‍💼 Live student counseling — personal guidance\n\nAll activities are age-appropriate and designed to create lasting behavioral change.",
    followUp: ["Our programs", "Book a session"]
  },

  // ── STUDENTS / AGE ──
  {
    id: "target_audience",
    keywords: ["student", "age", "grade", "class", "lkg", "ukg", "standard", "level", "kindergarten", "primary", "secondary", "higher secondary", "plus one", "plus two", "+1", "+2", "12th", "children", "kids", "youth", "who can attend"],
    weight: 2,
    answer: "👨‍🎓 Who Can Attend?\n\nOur programs are designed for:\n\n• LKG & UKG (ages 3–5)\n• Classes 1 to 5 (Primary)\n• Classes 6 to 10 (Secondary)\n• Classes 11 & 12 / +1 & +2 (Higher Secondary)\n\nContent is carefully tailored for each age group to be appropriate, relatable, and impactful.\n\nBoth government and private schools across India are welcome!",
    followUp: ["Book a session", "Our programs", "Contact us"]
  },

  // ── DURATION ──
  {
    id: "duration",
    keywords: ["duration", "time", "long", "hour", "minute", "session length", "how long", "period", "1.5", "ninety", "90 minutes"],
    weight: 2,
    answer: "⏱️ Session Duration\n\nEach School Mission session lasts:\n\n🕐 1.5 Hours (90 Minutes)\n\nThis includes:\n• Awareness activities & demonstrations\n• Interactive games & multimedia\n• Live student counseling\n• Q&A and discussion\n\nThe compact format ensures maximum engagement without disrupting the school schedule.",
    followUp: ["Session format", "Book a session"]
  },

  // ── ACHIEVEMENTS / STATS ──
  {
    id: "achievements",
    keywords: ["achievement", "milestone", "statistic", "stat", "impact", "reach", "how many", "schools", "students reached", "success", "history", "track record", "experience", "decade", "years", "accomplishment"],
    weight: 2,
    answer: "🏆 Our Achievements\n\n🕰️ 10+ Years of service\n💯 100% Student engagement rate\n🏫 Schools served across Kerala & India\n👨‍🎓 Students from LKG to +2 reached\n📋 Reg No: PTM/TC/15/2023\n\nOver a decade of consistently delivering high-impact, positive change in school communities.",
    followUp: ["About Karuthal", "Our programs", "Book a session"]
  },

  // ── TEAM / COUNSELORS ──
  {
    id: "team",
    keywords: ["team", "staff", "counselor", "who conducts", "trainer", "facilitator", "expert", "professional", "who are you", "member", "employees", "all members", "who are the members"],
    weight: 2,
    answer: "👥 Our Team\n\nKaruthal's programs are conducted by experienced student counselors and child welfare specialists.\nOur leadership includes:\n• Kurian Mathew (President)\n• Mathew Abraham (Vice President)\n• Blessen David (Secretary)\n\n(Ask me about any specific member by name or role for their contact details!)",
    followUp: ["Who is the President?", "Who is the Secretary?"]
  },

  {
    id: "member_abraham_oommen",
    keywords: ["abraham oommen", "patron", "abraham", "oommen"],
    weight: 3,
    answer: "👤 ABRAHAM OOMMEN\nRole: Patron\nPhone: 9995767469",
    followUp: ["Who is the President?", "Who is the Secretary?"]
  },
  {
    id: "member_kurian_mathew",
    keywords: ["kurian mathew", "president", "kurian"],
    weight: 3,
    answer: "👤 KURIAN MATHEW\nRole: President\nPhone: +91 9447120692",
    followUp: ["Who is the Secretary?", "Who is the Vice President?"]
  },
  {
    id: "member_mathew_abraham",
    keywords: ["mathew abraham", "vice president", "vice-president"],
    weight: 3,
    answer: "👤 MATHEW ABRAHAM\nRole: Vice President\nPhone: 9961538398",
    followUp: ["Who is the President?", "Who is the Secretary?"]
  },
  {
    id: "member_blessen_david",
    keywords: ["blessen david", "blessen", "blesson", "secretary", "secreter"],
    weight: 4,
    answer: "👤 BLESSEN DAVID\nRole: Secretary\nPhone: 79941 20288",
    followUp: ["Who is the President?", "Who is the Joint Secretary?"]
  },
  {
    id: "member_vineesh",
    keywords: ["vineesh", "murikkattu", "vineesh k", "joint secretary", "joint-secretary"],
    weight: 3,
    answer: "👤 VINEESH K MURIKKATTU\nRole: Joint Secretary\nPhone: 9447809842",
    followUp: ["Who is the Secretary?", "Who is the Treasurer?"]
  },
  {
    id: "member_anoop",
    keywords: ["anoop", "anoop r v", "treasurer"],
    weight: 3,
    answer: "👤 ANOOP. R.V\nRole: Treasurer\nPhone: 90203 33554",
    followUp: ["Who is the President?", "Who is the Secretary?"]
  },
  {
    id: "member_job",
    keywords: ["job k thomas", "job thomas", "office administrator", "administrator", "admin", "executive member"],
    weight: 3,
    answer: "👤 JOB K. THOMAS\nRole: Executive Member / Office Administrator\nPhone: 9526084984",
    followUp: ["Who is the Secretary?"]
  },
  {
    id: "member_samson",
    keywords: ["samson", "baby", "samson p baby"],
    weight: 3,
    answer: "👤 SAMSON P BABY\nRole: Executive Member\nPhone: 9400183181",
    followUp: []
  },
  {
    id: "member_johnson",
    keywords: ["johnson", "samuel", "johnson samuel"],
    weight: 3,
    answer: "👤 JOHNSON SAMUEL\nRole: Executive Member\nPhone: 9446107026",
    followUp: []
  },
  {
    id: "member_arun",
    keywords: ["arun", "arun g k"],
    weight: 3,
    answer: "👤 ARUN G K\nRole: Executive Member\nPhone: 94864 45004",
    followUp: []
  },
  {
    id: "member_moncy",
    keywords: ["moncy", "moncy p m"],
    weight: 3,
    answer: "👤 MONCY P. M\nRole: Executive Member\nPhone: 9633203593",
    followUp: []
  },
  {
    id: "member_mathew_m",
    keywords: ["mathew munjannattu", "geevarughese", "mathew m"],
    weight: 3,
    answer: "👤 MATHEW MUNJANNATTU GEEVARUGHESE\nRole: Executive Member\nPhone: +91 80891 95183",
    followUp: []
  },
  {
    id: "member_biju",
    keywords: ["biju", "eapen", "biju eapen"],
    weight: 3,
    answer: "👤 BIJU EAPEN\nRole: Executive Member\nPhone: 9745383915",
    followUp: []
  },
  {
    id: "member_salu",
    keywords: ["salu", "varghese", "salu varghese"],
    weight: 3,
    answer: "👤 SALU VARGHESE\nRole: Executive Member\nPhone: 9847820405",
    followUp: []
  },
  {
    id: "member_sajan",
    keywords: ["sajan", "yohannan", "sajan yohannan"],
    weight: 3,
    answer: "👤 SAJAN YOHANNAN\nRole: Executive Member\nPhone: 97461 68687",
    followUp: []
  },
  {
    id: "member_abraham_p",
    keywords: ["abraham philipose", "philipose"],
    weight: 3,
    answer: "👤 ABRAHAM PHILIPOSE\nRole: Executive Member\nPhone: 9633135772",
    followUp: []
  },
  {
    id: "member_benny",
    keywords: ["benny", "benny p john", "benny john"],
    weight: 3,
    answer: "👤 BENNY P. JOHN\nRole: Executive Member\nPhone: 9048944345",
    followUp: []
  },
  {
    id: "member_aksa",
    keywords: ["aksa", "joy", "aksa joy"],
    weight: 3,
    answer: "👤 AKSA JOY\nRole: Executive Member\nPhone: 9495747877",
    followUp: []
  },

  // ── VOLUNTEER ──
  {
    id: "volunteer",
    keywords: ["volunteer", "join", "support", "help", "contribute", "participate", "internship", "work with", "partner", "collaborate", "sponsor", "donation", "ngo work", "donate", "fund"],
    weight: 2,
    answer: "🤝 Join / Support Karuthal\n\nInterested in supporting our mission?\n\nYou can:\n• Volunteer as a facilitator or counselor\n• Partner as a school or institution\n• Support our outreach programs\n• Sponsor awareness sessions or donate\n\nContact us to explore how we can work together:\n📞 9745647909 / 📱 9656217909\n📧 karuthalsas@gmail.com",
    followUp: ["Contact us", "About Karuthal"]
  },

  // ── TESTIMONIALS / REVIEWS ──
  {
    id: "testimonials",
    keywords: ["review", "testimonial", "feedback", "rating", "opinion", "experience", "what do people say", "response", "comment", "recommend", "satisfied", "happy with"],
    weight: 2,
    answer: "⭐ What People Say About Us\n\nSchools and parents who have experienced our School Mission sessions describe them as:\n\n• Highly engaging and impactful\n• Age-appropriate and professionally delivered\n• A must-have for every school\n• Eye-opening for students and staff alike\n\nYou can read testimonials directly on our website, or share your own experience using the 'Write a Review' tab in our Contact section!",
    followUp: ["Book a session", "Contact us"]
  },

  // ── GALLERY ──
  {
    id: "gallery",
    keywords: ["photo", "image", "gallery", "picture", "video", "media", "visual", "see", "look", "snapshot", "event photo"],
    weight: 1,
    answer: "📸 Gallery\n\nYou can view photos from our School Mission sessions in the Gallery section on our website!\n\nThe gallery showcases:\n• Live program moments\n• Student interactions\n• Puppet shows & activities\n• School visit highlights\n\nScroll down to the Gallery section on the home page to explore!",
    followUp: ["Our programs", "Book a session"]
  },

  // ── WEBSITE FEATURES ──
  {
    id: "website",
    keywords: ["website", "site", "page", "section", "navigate", "find on site", "home page", "scroll", "admin", "login", "register", "dashboard"],
    weight: 1,
    answer: "🌐 About This Website\n\nOur website has the following sections:\n\n🏠 Home — Introduction & carousel highlights\n📖 About — Our mission & milestones\n📚 Programs — Our 5 awareness programs\n🖼️ Gallery — Program photos\n💬 Testimonials — Reviews\n🤝 Volunteer — Join us\n📞 Contact — Reach out to us\n\nScroll through the page or use the navigation bar to explore!",
    followUp: ["Contact us", "Our programs"]
  },

  // ── THANK YOU ──
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thank you", "thankyou", "ok", "okay", "great", "nice", "good", "awesome", "helpful", "cool", "perfect", "got it", "understood", "clear", "alright"],
    weight: 1,
    answer: "You're welcome! 😊\n\nFeel free to ask anything else about Karuthal Society. We're always happy to help!\n\n📞 9745647909 / 📱 9656217909\n📧 karuthalsas@gmail.com",
    followUp: ["Our programs", "Book a session", "Contact us"]
  },

  // ── GOODBYE ──
  {
    id: "goodbye",
    keywords: ["bye", "goodbye", "see you", "take care", "later", "cya", "farewell", "see ya", "ttyl"],
    weight: 1,
    answer: "Goodbye! 👋 Thank you for your interest in Karuthal Social Awareness Society.\n\nDon't hesitate to reach out anytime:\n📞 9745647909 / 📱 9656217909\n📧 karuthalsas@gmail.com\n\nTogether, let's protect and empower our children! 💙",
    followUp: []
  }
];

// ─────────────────────────────────────────────────
// SMART SCORING ENGINE
// Tokenizes input, scores each KB entry by:
//   +3 per exact keyword match
//   +1 per partial keyword match (substring)
//   Multiplied by the entry's weight
// Returns the best-scoring entry above threshold.
// ─────────────────────────────────────────────────
function getAnswer(query: string, history: Message[]): { answer: string; followUp: string[] } {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/);

  // Check for context-dependent queries like "what is his number" or "role"
  if (q.includes("number") || q.includes("phone") || q.includes("contact")) {
    const lastMsg = history.length > 0 ? history[history.length - 1].content : "";
    if (lastMsg.includes("Role:") && lastMsg.includes("Phone:")) {
      const phoneMatch = lastMsg.match(/Phone:\s*([+\d\s]+)/);
      if (phoneMatch) {
        return {
          answer: `The contact number is: ${phoneMatch[1].trim()}`,
          followUp: []
        };
      }
    }
  }

  if (q.includes("role") && !q.includes("president") && !q.includes("secretary") && !q.includes("treasurer")) {
    const lastMsg = history.length > 0 ? history[history.length - 1].content : "";
    if (lastMsg.includes("Role:") && lastMsg.includes("Phone:")) {
      const roleMatch = lastMsg.match(/Role:\s*([^\n]+)/);
      if (roleMatch) {
        return {
          answer: `The role is: ${roleMatch[1].trim()}`,
          followUp: []
        };
      }
    }
  }

  let bestScore = 0;
  let bestEntry: KBEntry | null = null;

  for (const entry of KB) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q === keyword || q.includes(keyword)) {
        // Full match or contains the keyword phrase
        score += 3;
      } else if (tokens.some((t) => keyword.includes(t) && t.length > 2)) {
        // Partial token match (token is part of a keyword)
        score += 1;
      }
    }
    const weightedScore = score * entry.weight;
    if (weightedScore > bestScore) {
      bestScore = weightedScore;
      bestEntry = entry;
    }
  }

  // Only return a match if score is meaningful
  if (bestEntry && bestScore >= 3) {
    return {
      answer: bestEntry.answer,
      followUp: bestEntry.followUp || []
    };
  }

  // Fallback
  return {
    answer: "I'm sorry, I didn't quite understand that. 🤔\n\nYou can ask me about:\n• 📋 Our awareness programs\n• 📅 How to book a School Mission session\n• 📞 Contact details & location\n• 👥 Our team & volunteers\n• 🏆 Our achievements\n\nOr call us directly:\n📞 9745647909",
    followUp: ["Our programs", "Book a session", "Contact us", "About Karuthal"]
  };
}

// Chatbot Icon — robot with headphones + speech bubble
function RobotIcon() {
  return (
    <svg viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
      {/* Antenna */}
      <line x1="32" y1="4" x2="32" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="3" r="2.5" fill="white"/>

      {/* Left headphone arc */}
      <path d="M10 28 C10 14 20 8 32 8 C44 8 54 14 54 28" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Left ear cup */}
      <rect x="6" y="26" width="8" height="14" rx="4" fill="white" opacity="0.9"/>

      {/* Right ear cup */}
      <rect x="50" y="26" width="8" height="14" rx="4" fill="white" opacity="0.9"/>

      {/* Head / chat bubble body */}
      <rect x="13" y="14" width="38" height="32" rx="9" fill="white"/>

      {/* Speech bubble tail */}
      <path d="M26 46 L22 54 L34 46 Z" fill="white"/>

      {/* Inner face screen */}
      <rect x="17" y="19" width="30" height="22" rx="6" fill="url(#faceGrad)" opacity="0.15"/>

      {/* Left eye */}
      <circle cx="24" cy="30" r="4" fill="url(#faceGrad)"/>
      <circle cx="24" cy="30" r="2" fill="white"/>

      {/* Right eye */}
      <circle cx="40" cy="30" r="4" fill="url(#faceGrad)"/>
      <circle cx="40" cy="30" r="2" fill="white"/>

      {/* Smile */}
      <path d="M25 38 Q32 43 39 38" stroke="url(#faceGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      <defs>
        <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00F0FF"/>
          <stop offset="100%" stopColor="#0FA4AF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate a natural typing delay
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      setMessages((prev) => {
        const { answer, followUp } = getAnswer(userMsg.content, prev);
        return [...prev, { role: "assistant", content: answer, followUp }];
      });
      setIsTyping(false);
    }, delay);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[500px] max-h-[75vh] z-[999] flex flex-col overflow-hidden rounded-2xl border border-[#0FA4AF]/30 bg-[#001f22]/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#024950] to-[#002b2e] border-b border-[#0FA4AF]/20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Karuthal Assistant</h3>
                  <p className="text-[10px] text-[#00F0FF]">● Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#AFDDE5]/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              {/* Welcome */}
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00F0FF]/20 text-[#00F0FF] mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-[#024950]/50 border border-[#0FA4AF]/20 rounded-2xl rounded-tl-none px-4 py-2 max-w-[85%] text-sm text-[#AFDDE5] leading-relaxed whitespace-pre-line">
                  Hello! 👋 I'm the Karuthal AI Assistant. Ask me about our programs, contact details, or how to book a School Mission session!
                </div>
              </div>

              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} w-full`}>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-1 ${m.role === "user" ? "bg-[#FF5533]/20 text-[#FF5533]" : "bg-[#00F0FF]/20 text-[#00F0FF]"}`}>
                      {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 max-w-[85%] text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-[#0FA4AF]/30 border border-[#0FA4AF]/40 text-white rounded-tr-none"
                        : "bg-[#024950]/50 border border-[#0FA4AF]/20 text-[#AFDDE5] rounded-tl-none"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                  {/* Dynamic follow-up chips */}
                  {m.role === "assistant" && m.followUp && m.followUp.length > 0 && idx === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 pl-8 mt-1">
                      {m.followUp.map((q) => (
                        <button
                          key={q}
                          onClick={() => setInput(q)}
                          className="text-[10px] bg-[#0FA4AF]/10 border border-[#00F0FF]/30 text-[#00F0FF]/80 rounded-full px-2.5 py-1 hover:bg-[#0FA4AF]/25 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00F0FF]/20 text-[#00F0FF] mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="bg-[#024950]/50 border border-[#0FA4AF]/20 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#001a1d] border-t border-[#0FA4AF]/20 shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[#02393e]/50 border border-[#0FA4AF]/30 rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:border-[#00F0FF] transition-colors"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 h-8 w-8 flex items-center justify-center rounded-full bg-[#00F0FF] text-[#001f22] disabled:opacity-40 hover:bg-[#00F0FF]/80 transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
              {/* Quick prompts */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Our programs", "Contact us", "Book a session", "Who are we?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-[10px] bg-[#0FA4AF]/10 border border-[#0FA4AF]/20 text-[#AFDDE5]/80 rounded-full px-2.5 py-1 hover:bg-[#0FA4AF]/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[168px] right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#024950] to-[#00F0FF] text-white shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-shadow"
            aria-label="Open Karuthal Chatbot"
          >
            <span className="absolute inset-0 rounded-full bg-[#00F0FF] animate-ping opacity-20" />
            <RobotIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

