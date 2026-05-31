/**
 * LUMIQ Morning Agent
 * Runs at 7:00 AM daily
 * Finds an inspiring quote, pairs it with today's theme, posts to LinkedIn + X + Instagram
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── 1. GENERATE MORNING QUOTE POST ──────────────────────────────────────────

async function generateMorningPost() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `You are the voice of LUMIQ — a warm, optimistic learning portal that believes understanding is a human right.

Today is ${today}.

Your task: Create a morning inspiration post.

1. Pick a powerful, real quote from a thinker, scientist, artist, leader, or philosopher — someone whose words genuinely moved the world. The quote must be REAL and accurately attributed.

2. Choose a theme this quote speaks to (curiosity / resilience / growth / kindness / courage / creativity / learning).

3. Write a 2–3 sentence reflection that connects the quote to TODAY — how someone reading this on a ${new Date().toLocaleDateString("en-US", { weekday: "long" })} morning can carry this thought into their day.

4. Write 5 relevant hashtags.

Respond ONLY with this exact JSON, no markdown, no extra text:
{
  "quote": "The actual quote text",
  "author": "Full name",
  "author_role": "Brief description e.g. 'Physicist & Nobel Laureate'",
  "theme": "Single word theme",
  "reflection": "2-3 sentence warm reflection connecting quote to today",
  "caption_linkedin": "Full LinkedIn post — quote, attribution, reflection, hashtags. Professional but warm. 150-200 words.",
  "caption_x": "Tweet version — quote + 1 punchy line + hashtags. Max 240 chars.",
  "caption_instagram": "Instagram caption — quote, author, warm reflection, hashtags. Visual and emotional. 100-150 words.",
  "visual_prompt": "Description of a simple, beautiful visual for this post — warm colors, what imagery, what text overlay"
}`,
      },
    ],
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
}

// ── 2. SAVE TO CONTENT STORE ─────────────────────────────────────────────────

function savePost(type, data) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filePath = path.join("content", "posts", `${dateStr}-${type}.json`);

  const post = {
    date: dateStr,
    type,
    generated_at: new Date().toISOString(),
    ...data,
  };

  fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  console.log(`✅ Saved ${type} post → ${filePath}`);
  return post;
}

// ── 3. POST TO PLATFORMS ─────────────────────────────────────────────────────

async function postToX(caption) {
  if (!process.env.X_BEARER_TOKEN || !process.env.X_API_KEY) {
    console.log("⚠️  X credentials not set — skipping");
    return null;
  }

  // X API v2 - post tweet
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: caption }),
  });

  const result = await response.json();
  if (result.data?.id) {
    console.log(`✅ Posted to X — tweet ID: ${result.data.id}`);
    return result.data.id;
  } else {
    console.error("❌ X post failed:", result);
    return null;
  }
}

async function postToLinkedIn(caption) {
  if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_PERSON_URN) {
    console.log("⚠️  LinkedIn credentials not set — skipping");
    return null;
  }

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_URN}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: caption },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  const result = await response.json();
  if (result.id) {
    console.log(`✅ Posted to LinkedIn — post ID: ${result.id}`);
    return result.id;
  } else {
    console.error("❌ LinkedIn post failed:", result);
    return null;
  }
}

async function postToInstagram(caption) {
  // Instagram requires image — we log the caption + visual prompt for manual posting
  // or use a scheduling tool like Buffer which handles image creation
  if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
    console.log("⚠️  Instagram credentials not set — saving caption for manual post");
    return null;
  }

  // Instagram Graph API - create media container then publish
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

  // For text-only or image posts via Instagram Graph API
  const containerResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        // image_url: process.env.TODAY_IMAGE_URL, // add when image gen is wired up
      }),
    }
  );

  const container = await containerResponse.json();
  if (!container.id) {
    console.error("❌ Instagram container failed:", container);
    return null;
  }

  const publishResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }),
    }
  );

  const result = await publishResponse.json();
  if (result.id) {
    console.log(`✅ Posted to Instagram — post ID: ${result.id}`);
    return result.id;
  } else {
    console.error("❌ Instagram publish failed:", result);
    return null;
  }
}

// ── 4. UPDATE PORTAL FEED ────────────────────────────────────────────────────

function updatePortalFeed(morningPost) {
  const feedPath = path.join("content", "feed.json");
  let feed = [];

  if (fs.existsSync(feedPath)) {
    feed = JSON.parse(fs.readFileSync(feedPath, "utf8"));
  }

  // Add to front, keep last 30 days
  feed.unshift({
    date: morningPost.date,
    type: "morning_quote",
    quote: morningPost.quote,
    author: morningPost.author,
    author_role: morningPost.author_role,
    theme: morningPost.theme,
    reflection: morningPost.reflection,
  });

  feed = feed.slice(0, 60); // keep 30 days × 2 posts
  fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2));
  console.log("✅ Portal feed updated");
}

// ── 5. MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌅 LUMIQ Morning Agent starting...");
  console.log(`📅 Date: ${new Date().toDateString()}\n`);

  try {
    // Generate post content
    console.log("🤖 Generating morning quote post...");
    const post = await generateMorningPost();

    console.log(`\n✨ Quote: "${post.quote}"`);
    console.log(`👤 Author: ${post.author} — ${post.author_role}`);
    console.log(`🎯 Theme: ${post.theme}\n`);

    // Save to content store
    const saved = savePost("morning", post);

    // Post to all platforms
    console.log("\n📤 Posting to social platforms...");
    const [xId, linkedInId, igId] = await Promise.allSettled([
      postToX(post.caption_x),
      postToLinkedIn(post.caption_linkedin),
      postToInstagram(post.caption_instagram),
    ]);

    // Update portal feed
    updatePortalFeed(saved);

    console.log("\n🌟 Morning agent complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`X:         ${xId.value ?? "skipped"}`);
    console.log(`LinkedIn:  ${linkedInId.value ?? "skipped"}`);
    console.log(`Instagram: ${igId.value ?? "skipped"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (err) {
    console.error("❌ Morning agent failed:", err.message);
    process.exit(1);
  }
}

main();
