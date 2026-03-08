import { initializeDatabase } from './db/client';
import contentBootstrapService from './services/content-bootstrap.service';

let initializationPromise: Promise<void> | null = null;

export function initializeApiDependencies(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    initializeDatabase();
    contentBootstrapService.ensureSeedContent();
    void contentBootstrapService.refreshExternalArticlesIfNeeded();
  })();

  return initializationPromise;
}
