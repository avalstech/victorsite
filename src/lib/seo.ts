export const site = {
  name: "Victor Udoka Anene",
  title: "Victor Udoka Anene | Product Manager • Fullstack • AWS",
  description:
    "Victor Udoka Anene helps startups and teams ship products faster with product leadership, fullstack engineering, and AWS architecture. Book a call, hire Victor, or download the CV.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  twitter: "@",
  ogImage: "/og.svg"
};

export function jsonLdPerson() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: ["Senior Product Manager", "Fullstack Engineer", "AWS Consultant"],
    sameAs: [
      "https://www.linkedin.com/in/anenevictor"
    ]
  };
}
