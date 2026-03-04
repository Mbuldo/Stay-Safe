import { initializeDatabase } from '../db/client';
import articlesService from '../services/articles.service';
import resourcesService from '../services/resources.service';
import externalArticlesService from '../services/external-articles.service';
import { defaultArticles, nairobiResources } from '../data/default-content';

async function seed() {
  console.log('Seeding Stay-Safe content...');
  initializeDatabase();

  let articleCount = 0;
  let resourceCount = 0;

  for (const article of defaultArticles) {
    articlesService.upsertArticleBySlug(article);
    articleCount += 1;
  }

  if (resourcesService.countResources() === 0) {
    for (const resource of nairobiResources) {
      resourcesService.createResource(resource);
      resourceCount += 1;
    }
  }

  const importedExternal = await externalArticlesService.refreshFromMedlinePlus(4);

  console.log('Seed complete');
  console.log(`- Base articles upserted: ${articleCount}`);
  console.log(
    `- Nairobi resources created: ${resourceCount || 'skipped (already present)'}`
  );
  console.log(`- External MedlinePlus articles upserted: ${importedExternal}`);
}

seed()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
