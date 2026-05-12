---
name: organization-person
description: Organization and person schema for E-E-A-T
---

# Organization & Person Schema (E-E-A-T)

**JSON-LD for Organization and Person entities (critical for E-E-A-T 2026).**

## Why Organization/Person Schema Matters

- **E-E-A-T Signals**: Establishes authority and trust
- **Knowledge Panel**: Google Knowledge Graph eligibility
- **Brand Recognition**: Logo, social profiles displayed
- **AI/GEO**: LLMs extract entity data

---

## Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AgencySEO",
  "url": "https://example.com",
  "logo": "https://example.com/logo.jpg",
  "description": "Professional SEO services. 15 years experience, 500+ clients. E-E-A-T compliant strategies for 2026.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+33-1-23-45-67-89",
    "contactType": "Customer Service",
    "areaServed": "FR",
    "availableLanguage": ["French", "English"]
  },
  "sameAs": [
    "https://facebook.com/agencyseo",
    "https://twitter.com/agencyseo",
    "https://linkedin.com/company/agencyseo"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Rue de la Paix",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
}
```

---

## Person Schema (Author Bio)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jean Dupont",
  "url": "https://example.com/author/jean-dupont",
  "image": "https://example.com/images/author-jean.jpg",
  "jobTitle": "Senior SEO Consultant",
  "description": "15+ years SEO experience. Specialized in technical SEO and E-E-A-T compliance. Certified Google Analytics & Search Console expert.",
  "worksFor": {
    "@type": "Organization",
    "name": "AgencySEO"
  },
  "sameAs": [
    "https://twitter.com/jeandupont",
    "https://linkedin.com/in/jeandupont",
    "https://github.com/jeandupont"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "École Polytechnique"
  },
  "knowsAbout": ["SEO", "Technical SEO", "E-E-A-T", "Core Web Vitals"]
}
```
