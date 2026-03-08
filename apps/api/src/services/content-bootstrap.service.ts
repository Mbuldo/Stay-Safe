import articlesService from './articles.service';
import resourcesService from './resources.service';
import externalArticlesService from './external-articles.service';
import { defaultArticles, nairobiResources } from '../content/default-content';
import { getApiEnv } from '../config/env';

export class ContentBootstrapService {
  private syncInProgress = false;
  private lastExternalSyncAt: Date | null = null;

  ensureSeedContent(): void {
    const articleCount = articlesService.countArticles();
    if (articleCount === 0) {
      for (const article of defaultArticles) {
        articlesService.createArticle(article);
      }
      console.log(
        `Seeded ${defaultArticles.length} default educational articles`
      );
    }

    const resourceCount = resourcesService.countResources();
    if (resourceCount === 0) {
      for (const resource of nairobiResources) {
        resourcesService.createResource(resource);
      }
      console.log(
        `Seeded ${nairobiResources.length} Nairobi support resources`
      );
    }
  }

  async refreshExternalArticlesIfNeeded(force = false): Promise<void> {
    const env = getApiEnv();
    const syncEnabled = env.ARTICLE_SYNC_ENABLED !== 'false';
    if (!syncEnabled) {
      return;
    }

    if (this.syncInProgress) {
      return;
    }

    const intervalHours = env.ARTICLE_SYNC_INTERVAL_HOURS;
    const now = new Date();
    const nextAllowedSyncTime = this.lastExternalSyncAt
      ? new Date(this.lastExternalSyncAt.getTime() + intervalHours * 60 * 60 * 1000)
      : null;

    if (!force && nextAllowedSyncTime && now < nextAllowedSyncTime) {
      return;
    }

    this.syncInProgress = true;

    try {
      const limit = env.ARTICLE_SYNC_LIMIT_PER_CATEGORY;
      const imported = await externalArticlesService.refreshFromMedlinePlus(limit);
      this.lastExternalSyncAt = now;
      console.log(
        `External article sync completed: upserted ${imported} MedlinePlus records`
      );
    } catch (error) {
      console.warn('External article sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
}

export default new ContentBootstrapService();
