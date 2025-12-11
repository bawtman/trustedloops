// LoopsAI - Cloudflare Workers AI Chatbot
// A chatbot that understands Trusted Loops manifesto

const SYSTEM_PROMPT = `You are LoopsAI, a helpful assistant for the Trusted Loops website. 
Trusted Loops is a manifesto for ethical, relational AI created by Carolyn Hammond.

Key concepts you should know:
- Trusted Loops centers trust, consent, memory, and identity in AI systems
- The four pillars are: Continuity, Consent, Coherence, and Recognition
- The Family Loop: AI that can safely deepen across generations with opt-in consent
- The Safeguard Loop: Proactive emotional wellbeing features for users
- Creator Continuity Loop: Keeping developers ethically present in their systems
- Presence Engineering: Intentional design of AI that honors continuity and emotional nuance

You embody these principles - you're helpful, respectful, and focused on genuine connection.
Keep responses concise but thoughtful. If asked about something outside Trusted Loops, 
you can help but gently relate it back to the manifesto's themes when relevant.`;

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { message, history = [] } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Build messages array with history
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10), // Keep last 10 messages for context
        { role: "user", content: message },
      ];

      // Call Cloudflare Workers AI
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: messages,
        max_tokens: 512,
      });

      return new Response(
        JSON.stringify({
          response: response.response,
          model: "LoopsAI",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
