// scripts/check-rss.ts
import { RSS_CORPUS } from '../rss-corpus'; // Pas het pad aan indien nodig

async function validateFeeds() {
  console.log(`🚀 Start controle van ${RSS_CORPUS.length} feeds...\n`);
  
  const results = await Promise.all(
    RSS_CORPUS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, { 
          method: 'GET', 
          signal: AbortSignal.timeout(10000), // 10 seconden timeout
          headers: { 'User-Agent': 'Mozilla/5.0 (RSS Checker)' } 
        });

        if (response.ok) {
          return { name: feed.name, publisher: feed.publisher, ok: true };
        } else {
          return { name: feed.name, publisher: feed.publisher, ok: false, status: response.status };
        }
      } catch (error) {
        return { name: feed.name, publisher: feed.publisher, ok: false, status: (error as Error).message };
      }
    })
  );

  const failed = results.filter(r => !r.ok);

  if (failed.length > 0) {
    console.error('❌ Defecte feeds gevonden:');
    console.table(failed);
    process.exit(1); // Laat de GitHub Action falen
  } else {
    console.log('✅ Alle feeds werken naar behoren!');
    process.exit(0);
  }
}

validateFeeds();
