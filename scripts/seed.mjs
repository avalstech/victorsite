import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json" assert { type: "json" };
import { generateClient } from "aws-amplify/data";

Amplify.configure(outputs, { ssr: true });
const client = generateClient();

const html = (s) => s.replace(/\n/g, "<br/>");

async function upsert(model, obj) {
  return client.models[model].upsert(obj);
}

async function main() {
  console.log("Seeding…");

  await upsert("SiteSettings", {
    id: "global",
    homeHeroTitle: "I build products that convert, scale, and ship.",
    homeHeroSubtitle: "Senior Product Manager and Fullstack/AWS Engineer.",
    skills: ["Product Strategy", "Roadmaps", "Experimentation", "Next.js", "TypeScript", "AWS", "DynamoDB", "Lambda"],
    values: ["Clarity over hype", "Systems > heroics", "Outcomes > output", "Security by default"],
    badges: ["AWS (Serverless)", "Product Leadership", "Delivery Excellence"],
    mediaMentions: ["LinkedIn thought leadership", "Startup collaborations", "Community workshops"],
    timeline: [
      { year: "2018", title: "Started building", text: "Self-taught, shipping and learning in public." },
      { year: "2021", title: "Product leadership", text: "Owning roadmaps, metrics, and delivery outcomes." },
      { year: "2024", title: "AWS + Fullstack", text: "Production systems with security-first architecture." }
    ]
  });

  await upsert("Service", {
    id: "svc-product",
    name: "Product Management (Fractional PM)",
    category: "Product",
    shortDescription: "Roadmap, PRDs, discovery, metrics, and stakeholder alignment.",
    priceRange: "$2,500–$12,000 / month",
    features: ["Discovery & user research plan", "PRD + roadmap", "Experiment design", "KPI system", "Weekly exec updates"],
    isActive: true
  });

  await upsert("Service", {
    id: "svc-fullstack",
    name: "Fullstack Delivery",
    category: "Engineering",
    shortDescription: "Next.js apps, APIs, data flows, and production hardening.",
    priceRange: "$5,000–$25,000 / project",
    features: ["Next.js 14 App Router", "Auth + RBAC", "CRUD + workflows", "Performance + SEO", "CI/CD setup"],
    isActive: true
  });

  await upsert("Service", {
    id: "svc-aws",
    name: "AWS Architecture & DevOps",
    category: "AWS",
    shortDescription: "Serverless architecture, security, and scalable deployments.",
    priceRange: "$3,000–$20,000 / engagement",
    features: ["Amplify Gen2 or CDK", "DynamoDB design", "IaC + IAM", "Observability", "Cost optimization"],
    isActive: true
  });

  await upsert("Testimonial", {
    id: "t1",
    name: "Founder, Seed-stage SaaS",
    title: "Startup Founder",
    quote: "Victor brought clarity to our roadmap and shipped the MVP with real metrics and clean AWS architecture.",
    isActive: true
  });

  await upsert("BlogPost", {
    id: "p1",
    slug: "strategy-begins-what-not-to-build",
    title: "Strategy begins the moment you decide what not to build",
    excerpt: "Focus is a product decision. The fastest teams win by subtracting.",
    bodyHtml: "<p><b>Focus</b> is a product decision. The fastest teams win by subtracting.</p><p>Pick one metric, one persona, one path to value. Then ship with ruthless clarity.</p>",
    status: "PUBLISHED",
    category: "Product Strategy",
    tags: ["strategy", "focus", "roadmap"],
    featured: true,
    seoTitle: "Strategy begins the moment you decide what not to build",
    seoDescription: "A practical framework for prioritization and product focus."
  });

  await upsert("BlogPost", {
    id: "p2",
    slug: "shipping-is-testing",
    title: "Shipping is testing",
    excerpt: "If you want certainty, ship. Feedback is a function of exposure.",
    bodyHtml: "<p>If you want certainty, ship.</p><p>Use small releases, clear hypotheses, and fast loops.</p>",
    status: "PUBLISHED",
    category: "Execution",
    tags: ["shipping", "experiments"],
    featured: true
  });

  await upsert("CaseStudy", {
    id: "c1",
    slug: "ai-personalized-learning-mvp",
    title: "AI Personalized Learning Platform MVP",
    summary: "Built an education platform MVP with interactive materials, user feedback loops, and scalable AWS-first architecture.",
    industry: "EdTech",
    tags: ["mvp", "education", "product"],
    techStack: ["Next.js", "TypeScript", "AWS", "DynamoDB"],
    status: "PUBLISHED",
    featured: true,
    metrics: [{ label: "MVP Delivery", value: "6 weeks" }, { label: "Feedback Loop", value: "Weekly" }],
    sections: [
      { title: "Problem", bodyHtml: "<p>Users needed an upskilling platform with personalization and engagement.</p>" },
      { title: "Approach", bodyHtml: "<p>Designed PRD, shipped MVP, measured engagement, iterated weekly.</p>" },
      { title: "Outcome", bodyHtml: "<p>Improved clarity, retention signals, and a roadmap grounded in real usage.</p>" }
    ]
  });

  await upsert("Talk", {
    id: "talk1",
    title: "From ambiguity to shipped: product systems that scale",
    eventName: "Startup Builders Meetup",
    location: "Online",
    date: "2025-11-15",
    summary: "A practical playbook to reduce rework, align stakeholders, and ship measurable outcomes.",
    videoUrl: "",
    slidesUrl: ""
  });

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
