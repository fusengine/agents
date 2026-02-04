---
name: faq-accordion
description: FAQ section with accordion component
when-to-use: Creating FAQ pages with expandable Q&A sections
keywords: faq, accordion, questions, answers, collapsible
priority: medium
related: design-patterns.md, forms-guide.md
---

# FAQ Accordion Template

## Dependencies

```bash
npx shadcn@latest add accordion
```

## Component

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

## Usage

```tsx
const faqs = [
  {
    question: "How do I get started?",
    answer: "Sign up for a free account and follow the onboarding guide."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel anytime from your account settings."
  }
];

<FAQSection faqs={faqs} />
```
