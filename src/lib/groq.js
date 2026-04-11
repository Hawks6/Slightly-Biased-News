import Groq from "groq-sdk";

/**
 * Shared Groq SDK singleton. All agents that call Groq should import from here.
 */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_avoid_init_error",
});

export default groq;
