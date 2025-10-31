
import { useCallback } from 'react';

// This is a mock knowledge base to simulate a VectorDB for the RAG pattern.
// In a real application, this would be an API call to a vector search service.
const knowledgeBase = [
  {
    question: "What is the Pythagorean theorem?",
    keywords: ["pythagorean", "theorem", "a^2", "b^2", "c^2", "right triangle"],
    answer: "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides. The formula is a² + b² = c²."
  },
  {
    question: "How do you find the area of a circle?",
    keywords: ["area", "circle", "pi", "radius", "πr²"],
    answer: "The area of a circle is calculated using the formula A = πr², where 'A' is the area, 'π' (pi) is a constant approximately equal to 3.14159, and 'r' is the radius of the circle."
  },
  {
    question: "What is the quadratic formula?",
    keywords: ["quadratic", "formula", "ax^2", "bx", "roots", "equation"],
    answer: "The quadratic formula is used to find the roots (or solutions) of a quadratic equation in the form ax² + bx + c = 0. The formula is x = [-b ± sqrt(b² - 4ac)] / 2a."
  }
];

export const useKnowledgeBase = () => {
  const searchKB = useCallback((query: string): string | null => {
    const lowerCaseQuery = query.toLowerCase();
    for (const entry of knowledgeBase) {
      if (entry.keywords.some(keyword => lowerCaseQuery.includes(keyword))) {
        return entry.answer;
      }
    }
    return null;
  }, []);

  return { searchKB };
};
