/**
 * LUMIQ Evening Agent
 * Runs at 7:00 PM daily
 * Finds today's most uplifting real news story
 * Pairs it with a thematically matched quote
 * Posts to LinkedIn + X + Instagram
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── 1. FIND TODAY'S POSITIVE NEWS ────────────────────────────────────────────

async function findPositiveNews() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  // Use Claude with web search to find real news
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [
      {
        role: "user",
        content: `Today is ${today}.

Search the web RIGHT NOW for the most genuinely uplifting, real news story from today or the past 24 hours.

Look for stories in these categories (in order of preference):
1. Scientific or medical breakthroughs that help humanity
2. Environmental wins — species saved, pollution reduced, clean energy milestones
3. Remarkable acts of human kindness at scale
4. Young people doing extraordinary things
5. Communities overcoming adversity together
6. Technology being used for genuine good

AVOID: celebrity gossip, political wins/losses, sports scores, anything divisive.

Find ONE real story. Verify it is real. Then respond ONLY with this exact JSON, no markdown:
{
  "headline": "The real headline",
  "source": "Publication name",
  "summary": "2-3 sentences explaining what happened and why it matters",
  "why_it_matters": "One sentence on the broader impact",
  "category": "science|environment|humanity|youth|community|technology",
  "quote": "A real, accurate quote from a real person that connects thematically — could be from the story itself or a relevant thinker",
  "quote_author": "Full name",
  "quote_author_role": "Who they are",
  "caption_linkedin": "Full LinkedIn post weaving together the news + quote + reflection. Warm, professional, hopeful. 180-220 words. Include hashtags.",
  "caption_x": "Tweet: news hook + quote snippet + 1 punchy insight. Max 240 chars. Include 2-3 hashtags.",
  "caption_instagram": "Instagram caption: emotional hook, news summary, quote, closing thought. 120-160 words. Include hashtags.",
  "visual_prompt": "Description of a beautiful visual for this post — what colors, imagery, mood, text overlay style"
}`,
      },
    ],
  });

  // Extract the final text response (after web search tool use)
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text response from evening agent");

  const raw = textBlock.text.trim();

  // Strip any accidental markdown fences
  const clean = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean);
}

// ── 2. SAVE TO CONTENT STORE ─────────────────────────────────────────────────

function savePost(data) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filePath = path.join("content", "posts", `${dateStr}-evening.json`);

  const post = {
    date: dateStr,
    type: "evening_news",
    generated_at: new Date().toISOString(),
    ...data,
  };

  fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  console.log(`✅ Saved evening post → ${filePath}`);
  return post;
}

// ── 3. POST TO PLATFORMS ─────────────────────────────────────────────────────

async function postToX(caption) {
  if (!process.env.X_BEARER_TOKEN) {
    console.log("⚠️  X credentials not set — skipping");
    return null;
  }
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
    console.log(`✅ Posted to X — ${result.data.id}`);
    return result.data.id;
  }
  console.error("❌ X failed:", result);
  return null;
}

async function postToLinkedIn(caption) {
  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
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
    console.log(`✅ Posted to LinkedIn — ${result.id}`);
    return result.id;
  }
  console.error("❌ LinkedIn failed:", result);
  return null;
}

async function postToInstagram(caption) {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    console.log("⚠️  Instagram credentials not set — saving for manual post");
    return null;
  }
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const containerRes = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }),
    }
  );
  const container = await containerRes.json();
  if (!container.id) { console.error("❌ Instagram container failed:", container); return null; }

  const publishRes = await fetch(
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
  const result = await publishRes.json();
  if (result.id) { console.log(`✅ Posted to Instagram — ${result.id}`); return result.id; }
  console.error("❌ Instagram publish failed:", result);
  return null;
}

// ── 4. UPDATE PORTAL FEED ────────────────────────────────────────────────────

function updatePortalFeed(post) {
  const feedPath = path.join("content", "feed.json");
  let feed = [];
  if (fs.existsSync(feedPath)) {
    feed = JSON.parse(fs.readFileSync(feedPath, "utf8"));
  }
  feed.unshift({
    date: post.date,
    type: "evening_news",
    headline: post.headline,
    source: post.source,
    summary: post.summary,
    why_it_matters: post.why_it_matters,
    category: post.category,
    quote: post.quote,
    quote_author: post.quote_author,
    quote_author_role: post.quote_author_role,
  });
  feed = feed.slice(0, 60);
  fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2));
  console.log("✅ Portal feed updated");
}

// ── 5. MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌆 LUMIQ Evening Agent starting...");
  console.log(`📅 Date: ${new Date().toDateString()}\n`);

  try {
    console.log("🔍 Searching for today's most positive news...");
    const post = await findPositiveNews();

    console.log(`\n📰 Story: ${post.headline}`);
    console.log(`📡 Source: ${post.source}`);
    console.log(`💬 Quote: "${post.quote}" — ${post.quote_author}\n`);

    const saved = savePost(post);

    console.log("📤 Posting to social platforms...");
    const [xId, liId, igId] = await Promise.allSettled([
      postToX(post.caption_x),
      postToLinkedIn(post.caption_linkedin),
      postToInstagram(post.caption_instagram),
    ]);

    updatePortalFeed(saved);

    console.log("\n🌟 Evening agent complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`X:         ${xId.value ?? "skipped"}`);
    console.log(`LinkedIn:  ${liId.value ?? "skipped"}`);
    console.log(`Instagram: ${igId.value ?? "skipped"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (err) {
    console.error("❌ Evening agent failed:", err.message);
    process.exit(1);
  }
}

main();
