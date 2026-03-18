import { RSS_CORPUS } from "./rss-corpus";

async function checkFeed(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "rss-checker/1.0"
      }
    });

    const text = await res.text();

    const isXML = text.includes("<rss") || text.includes("<feed");

    return {
      ok: res.ok && isXML,
      status: res.status,
    };
  } catch (err) {
    return {
      ok: false,
      status: "error",
    };
  }
}

async function run() {
  for (const source of RSS_CORPUS) {
    const result = await checkFeed(source.url);

    if (result.ok) {
      console.log(`✅ ${source.publisher} - ${source.name}`);
    } else {
      console.log(
        `❌ ${source.publisher} - ${source.name} (${source.url}) -> ${result.status}`
      );
    }
  }
}

run();
