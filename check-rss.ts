import { RSS_CORPUS } from "./rss-corpus.js";

async function checkFeed(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();

    const isXML = text.includes("<rss") || text.includes("<feed");

    return res.ok && isXML;
  } catch {
    return false;
  }
}

for (const source of RSS_CORPUS) {
  const ok = await checkFeed(source.url);
  console.log(`${ok ? "✅" : "❌"} ${source.publisher} - ${source.name}`);
}
