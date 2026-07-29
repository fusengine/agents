---
name: seo-entity
description: Use when optimizing entity-based / semantic SEO — Knowledge Graph resolution, salience scoring, about/sameAs/knowsAbout schema.
user-invocable: false
related-skills: seo, seo-schema, seo-geo, seo-content
---

<objective>
Covers entity-based/semantic SEO 2026: building an entity map (person/concept/organization/product) that inventories every entity a topic should cover, understanding NLP salience scoring (0-1, relative — entities on a page compete for a total that sums to ~1.0) and passage-level ranking, and wiring `about` (Wikidata URI), `sameAs`, and `knowsAbout` schema to resolve identity against the Knowledge Graph (~8 billion entities). Includes the Google Cloud Natural Language API validation step to confirm the primary entity wins salience before publishing. Distinct from seo-schema (general JSON-LD types/templates) and seo-content (topical coverage, answer capsules).
</objective>

# Entity-Based / Semantic SEO 2026

Google parses meaning at query, document and **passage** level. It extracts entities via NLP, resolves them against the Knowledge Graph (~8 billion entities), maps relationships, and indexes content **by concept, not by keyword**. TF-IDF / keyword density is obsolete — optimize for embeddings and topical coverage instead.

## Entity Map (start here)

Strategic inventory that drives everything else. For the target topic, list every entity the site should cover:

| Entity | Type | Relates to | Page covering it |
|--------|------|-----------|------------------|
| RankBrain | concept | Google, ranking | /guides/rankbrain |
| Google | organization | search engine | /about |

Types: person, concept, organization, product. Breadth of entity coverage + internal linking density + publishing consistency = topical authority.

## Salience (0–1, relative)

- NLP scores each entity's prominence; scores across all entities on a page **sum to ~1.0** — entities compete for share.
- Entity in the **H1 + first 100 words** = max salience.
- Repetition does NOT raise salience. **Clear writing in proper context does.**
- Example: a passage can score RankBrain 0.584 vs Google 0.231 even when "Google" is the grammatical subject — salience distribution reveals the real topical focus.

## Passage-Level Ranking

Google scores **per passage, not per page**. Each passage is judged on entity salience, relationship clarity, and topical relevance. A page ranks for broad topic queries when its entity signals are clear and unambiguous — not just for the exact keyword.

## Schema Linking (resolve identity, don't make Google guess)

- `about` → **Wikidata URI** of the page's primary entity (the node in the Knowledge Graph).
- `sameAs` on author/organization → LinkedIn, Wikipedia, Wikidata profiles.
- `knowsAbout` on author/organization → entities they have demonstrated expertise in.

```json
{
  "@type": "Article",
  "about": { "@type": "Thing", "name": "Knowledge Graph",
    "sameAs": "https://www.wikidata.org/wiki/Q3882486" },
  "author": { "@type": "Person", "name": "Jane Doe",
    "sameAs": ["https://www.linkedin.com/in/janedoe",
      "https://en.wikipedia.org/wiki/Jane_Doe"],
    "knowsAbout": ["semantic SEO", "NLP"] }
}
```

## Validation (before publishing)

Send content to the **Google Cloud Natural Language API** (free tier). It returns identified entities, types, salience scores, and Knowledge Graph links. Use it to confirm the primary entity actually wins salience; rewrite passages if salience drifts off-topic.

## Related

- `seo-schema` — JSON-LD types and templates
- `seo-geo` — entity signals drive AI citations
- `seo-content` — topical coverage and answer capsules
