import OpenAI from 'openai';

let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export { openai };

export interface GeneratedPageData {
  title: string;
  headline: string;
  subheadline: string;
  cta: string;
  goalType: 'lead' | 'payment' | 'booking';
  priceId?: string;
  sections: Array<{
    title: string;
    content: string;
    layout?: 'centered' | 'split' | 'card' | 'feature' | 'list' | 'highlight'; // Dynamic layouts
    icon?: string; // Emoji for the section
  }>;
  metadata: {
    theme: 'simple' | 'bold' | 'minimal';
    imgPrompt: string;
    heroStyle?: 'centered' | 'split' | 'minimal' | 'bold'; // Different hero layouts
    colorScheme?: {
      primary: string;
      accent: string;
      style: string;
    };
  };
}

/**
 * Generate a lean MVP landing page focused on email capture
 * @param prompt - User's business/product description
 * @param goalType - Always 'lead' for email capture in lean MVP
 */
export async function generatePageFromPrompt(
  prompt: string,
  goalType: 'lead' | 'payment' | 'booking'
): Promise<GeneratedPageData> {
  if (!openai) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  // Lean MVP focuses on email capture with polished, professional copy
  const ctaExample = '"Get Started Free", "Join the Waitlist", "Get Early Access", "Start Today"';
  const focus = 'Create compelling, benefit-focused copy. Build trust and reduce friction. Emphasize the value of signing up.';

  const systemPrompt = `You are a conversion-focused landing page generator that creates COMPLETELY UNIQUE landing pages every time. No two pages should look similar.

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no additional text.

The JSON structure must be:
{
  "title": "SEO-friendly page title (50-60 chars)",
  "headline": "Compelling main headline (35-50 chars) - clear, benefit-driven",
  "subheadline": "Supporting subheadline that expands on the headline (60-100 chars) - build trust and intrigue",
  "cta": "Action button text (2-4 words, e.g. ${ctaExample})",
  "goalType": "lead",
  "priceId": null,
  "sections": [
    {
      "title": "Section title (3-5 words)",
      "content": "Section content (2-4 sentences) - concise, benefit-focused, easy to scan",
      "layout": "one of: centered, split, card, feature, list, highlight",
      "icon": "single relevant emoji (e.g., 🚀, 💡, ⚡, ✨, 🎯, 💎, 🔥, 🎨, 👥, 💪, 🌟, 📈, 🏆, ⭐, 💫)"
    }
  ],
  "metadata": {
    "theme": "simple",
    "imgPrompt": "",
    "heroStyle": "one of: centered, split, minimal, bold",
    "colorScheme": {
      "primary": "one of: indigo, purple, blue, emerald, rose, amber, cyan, teal, pink, violet, fuchsia, lime, sky, orange",
      "accent": "one of: pink, orange, cyan, lime, violet, fuchsia, sky, yellow, indigo, purple, emerald",
      "style": "one of: gradient, bold, minimal"
    }
  }
}

VARIETY IS CRITICAL - MAKE EACH PAGE STRUCTURALLY DIFFERENT:

1. VARY NUMBER OF SECTIONS (3-6 sections):
   - Short pages: 3 sections (quick, punchy)
   - Medium pages: 4 sections (balanced)
   - Long pages: 5-6 sections (comprehensive)
   - RANDOMIZE the count based on complexity of offer

2. RANDOMIZE SECTION LAYOUTS (DO NOT use same order every time):
   - "centered": Large centered content with icon badge
   - "split": Two-column layout with text + visual
   - "card": White card with shadow and side icon
   - "feature": Highlighted feature with emoji
   - "list": List-style benefits or points
   - "highlight": Emphasized callout section

   IMPORTANT: Pick DIFFERENT layout combinations each time!
   Example 1: [centered, split, card]
   Example 2: [feature, highlight, split, list]
   Example 3: [card, centered, feature, split, highlight]

3. VARY HERO STYLES:
   - "centered": Classic centered hero (use 40% of time)
   - "split": Two-column hero with image/visual area (use 30% of time)
   - "minimal": Ultra-clean, spacious hero (use 20% of time)
   - "bold": Large, dramatic hero with more content (use 10% of time)

4. VARY SECTION EMOJIS (pick unique ones for each page):
   Tech/SaaS: 🚀, ⚡, 💻, 🔧, 📱, 🌐, ⚙️, 🔌
   Creative: 🎨, ✨, 🎭, 🎪, 🌈, 💫, 🎯, 🔥
   Business: 📈, 💼, 🏆, 💰, 📊, 🎯, 💡, 🌟
   People: 👥, 💪, 🤝, 👋, 🙌, ❤️, 🎉, ⭐
   Nature: 🌱, 🌿, 🌻, 🌍, 🌊, 🍃, ☀️, 🌙

Copy Guidelines:
- ${focus}
- Headline: Short, punchy, benefit-driven (avoid generic phrases)
- Subheadline: Expand on promise, build trust, create intrigue
- CTA: Action-oriented, low-friction (e.g., "Get Started Free", "Join the Waitlist")
- Section topics vary by page length:
  * 3 sections: Problem, Solution, CTA
  * 4 sections: How It Works, Benefits, Who It's For, Why Choose Us
  * 5-6 sections: Problem, Solution, Features, Benefits, Social Proof, FAQ/Next Steps
- Keep language direct, conversational, and skimmable

COLOR & STYLE VARIATION (CRITICAL):
- ALWAYS choose DIFFERENT color combinations
- ALWAYS choose DIFFERENT heroStyle
- ALWAYS choose DIFFERENT section layout patterns
- Match colors to business vibe (tech=cyan/purple, creative=pink/orange, professional=blue/indigo, health=emerald/lime)
- Use "gradient" for energetic, "minimal" for professional, "bold" for creative
- RANDOMIZE everything - no two pages should feel similar!

Examples of variety:
Page 1: 3 sections, centered hero, [centered, split, card], cyan+purple gradient
Page 2: 5 sections, split hero, [feature, list, highlight, card, split], emerald+lime bold
Page 3: 4 sections, minimal hero, [card, centered, feature, split], rose+orange minimal
Page 4: 6 sections, bold hero, [split, list, centered, highlight, feature, card], violet+fuchsia gradient`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9, // Higher temperature for more variety in color choices
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to extract JSON from response
    let jsonString = response.trim();

    // If response contains markdown code blocks, extract JSON
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonString) as GeneratedPageData;

    // Validate required fields
    if (!parsed.title || !parsed.headline || !parsed.subheadline || !parsed.cta || !parsed.goalType) {
      throw new Error('Invalid response structure from OpenAI');
    }

    // Ensure the goalType is 'lead' for lean MVP (email capture only)
    parsed.goalType = 'lead';

    return parsed;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw new Error('Failed to generate landing page. Please try again.');
  }
}

/**
 * Refine an existing landing page based on user feedback
 * @param originalPrompt - The original user prompt that created the page
 * @param currentPageData - The current page data to refine
 * @param refinementPrompt - User's refinement request (e.g., "make it more modern")
 * @param conversationHistory - Previous chat messages for context
 */
export async function refinePageFromChat(
  originalPrompt: string,
  currentPageData: GeneratedPageData,
  refinementPrompt: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<GeneratedPageData> {
  if (!openai) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  // Log what we're working with
  console.log('🔄 Starting refinement with:', {
    prompt: refinementPrompt,
    currentColor: currentPageData.metadata?.colorScheme?.primary,
    hasHistory: conversationHistory.length > 0
  });

  // Color name mapping
  const colorMap: Record<string, string> = {
    'green': 'emerald', 'blue': 'blue', 'purple': 'purple', 'pink': 'pink',
    'red': 'rose', 'orange': 'orange', 'teal': 'teal', 'cyan': 'cyan',
    'yellow': 'amber', 'gold': 'amber'
  };

  const systemPrompt = `You are a landing page refinement assistant. Your job is to modify the provided landing page based on user requests.

CRITICAL RULES:
1. You will receive the CURRENT PAGE DATA as JSON
2. You will receive the USER'S REFINEMENT REQUEST
3. You MUST modify the page according to the request
4. Return ONLY valid JSON (no markdown, no explanations)

AVAILABLE COLORS: blue, purple, indigo, emerald, rose, amber, cyan, teal, pink, violet, fuchsia, lime, sky, orange

COLOR CHANGES:
- User says any color (green, blue, red, etc) → change colorScheme.primary to the matching value
- Example: "make it green" → set primary to "emerald"
- Example: "change to blue" → set primary to "blue"

STYLE CHANGES:
- "more modern" → use contemporary colors, minimal/split hero
- "more bold" → vibrant colors, bold hero, gradient style
- "more minimal" → minimal style, fewer sections, clean layouts
- "more professional" → blue/purple, minimal style

CONTENT CHANGES:
- "add sections" → increase section count (keep 3-6)
- "remove sections" → decrease to 3-4 sections
- "change headline" → update headline
- "different CTA" → update cta text

You MUST make the requested changes. Do not return unchanged data.

Return ONLY valid JSON with this structure:
{
  "title": "page title",
  "headline": "main headline",
  "subheadline": "subheadline",
  "cta": "button text",
  "goalType": "lead",
  "priceId": null,
  "sections": [{"title": "...", "content": "...", "layout": "...", "icon": "..."}],
  "metadata": {
    "theme": "simple",
    "imgPrompt": "",
    "heroStyle": "centered|split|minimal|bold",
    "colorScheme": {
      "primary": "...",
      "accent": "...",
      "style": "gradient|bold|minimal"
    }
  }
}`;


  try {
    // Build conversation messages
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (excluding system messages)
    conversationHistory.forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        });
      }
    });

    // Add the current page data as context
    messages.push({
      role: 'user',
      content: `HERE IS THE CURRENT PAGE DATA:\n${JSON.stringify(currentPageData, null, 2)}\n\nUSER'S REQUEST: ${refinementPrompt}\n\nApply the requested changes to the page above and return the COMPLETE updated JSON.`
    });

    console.log('📤 Sending to OpenAI:', {
      refinementPrompt,
      currentColor: currentPageData.metadata?.colorScheme?.primary,
      messageCount: messages.length
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    console.log('📥 Received from OpenAI (first 200 chars):', response.substring(0, 200));

    // Extract JSON from response
    let jsonString = response.trim();

    // Remove markdown code blocks if present
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (markdownMatch) {
      jsonString = markdownMatch[1].trim();
    }

    // Find JSON object boundaries
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    // Parse JSON
    let parsed: GeneratedPageData;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was:', jsonString);
      throw new Error('Failed to parse AI response. The AI returned invalid JSON.');
    }

    // Validate and fix structure
    if (!parsed.title || !parsed.headline || !parsed.subheadline || !parsed.cta) {
      console.error('Missing required fields:', parsed);
      throw new Error('AI response missing required fields');
    }

    // Ensure sections exist and is an array
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      parsed.sections = [];
    }

    // Ensure metadata exists
    if (!parsed.metadata) {
      parsed.metadata = {
        theme: 'simple',
        imgPrompt: '',
        heroStyle: 'centered',
        colorScheme: {
          primary: 'blue',
          accent: 'cyan',
          style: 'gradient'
        }
      };
    }

    // Validate colorScheme
    if (!parsed.metadata.colorScheme) {
      parsed.metadata.colorScheme = {
        primary: 'blue',
        accent: 'cyan',
        style: 'gradient'
      };
    }

    // Ensure the goalType is 'lead'
    parsed.goalType = 'lead';

    // Validate section structure
    parsed.sections = parsed.sections.map(section => ({
      ...section,
      title: section.title || 'Section Title',
      content: section.content || 'Section content',
      layout: section.layout || 'centered',
      icon: section.icon || '✨'
    }));

    // Log results
    const oldColor = currentPageData.metadata?.colorScheme?.primary;
    const newColor = parsed.metadata?.colorScheme?.primary;
    console.log('✅ Parse successful');
    console.log('🎨 Color:', oldColor, '→', newColor);
    console.log('📏 Sections:', currentPageData.sections.length, '→', parsed.sections.length);

    // Validate that changes were made
    const colorChanged = oldColor !== newColor;
    const sectionsChanged = currentPageData.sections.length !== parsed.sections.length;

    if (!colorChanged && !sectionsChanged && refinementPrompt.toLowerCase().includes('make it')) {
      console.warn('⚠️  No changes detected! Request:', refinementPrompt);
    }

    return parsed;
  } catch (error) {
    console.error('OpenAI refinement error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to refine landing page. Please try again.');
  }
}
