import Aurelia, { LogLevel, Registration } from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';
import { App } from './app';
import { LocalStorageKeys } from './common/local-storage-keys';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'formiojs/dist/formio.full.css';
// import tailwind
import { DecisionTreeIcon } from './components/decision-tree-icon';
// Function to get saved log level from localStorage
function getSavedLogLevel(): LogLevel {
  const savedLevel = localStorage.getItem(LocalStorageKeys.LOG_LEVEL);
  return savedLevel ? (JSON.parse(savedLevel) as LogLevel) : LogLevel.info;
}

Aurelia
  .register(
    RouterConfiguration.customize({ useUrlFragmentHash: true }),
    // Add logging configuration
    {
      register(container) {
        // Get the saved log level and store it in the container for reference
        const logLevel = getSavedLogLevel();

        // Register the log level as a singleton so other parts of your app can access it
        container.register(
          Registration.instance('savedLogLevel', logLevel)
        );

        // Note: Aurelia 2's logging system doesn't have a global configuration
        // like v1 did. The log level is primarily controlled per-logger instance.
        // For runtime log level changes, you'll need to handle this in your
        // Settings component or create a custom logging service.
      }
    }
  )

  .register(DecisionTreeIcon)
  .app(App)
  .start();