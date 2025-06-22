import { ILogger, inject, LogLevel, observable, IContainer, Registration } from "aurelia";
import { LocalStorageKeys } from "../../common/local-storage-keys";

interface LogLevelOption {
    value: LogLevel;
    name: string;
}

@inject(ILogger, IContainer)
export class Settings {
    @observable public allowConsoleLogging: boolean = true;
    @observable public allowConsoleInfo: boolean = true;
    @observable public allowConsoleWarn: boolean = true;
    @observable public allowConsoleError: boolean = true;

    public readonly logLevels: LogLevelOption[];

    @observable
    public selectedLogLevel: LogLevel;

    public constructor(
        private readonly logger: ILogger,
        private readonly container: IContainer
    ) {
        // --- Initialize Log Level Options ---
        this.logLevels = [
            { value: LogLevel.trace, name: 'Trace' },
            { value: LogLevel.debug, name: 'Debug' },
            { value: LogLevel.info, name: 'Info' },
            { value: LogLevel.warn, name: 'Warn' },
            { value: LogLevel.error, name: 'Error' },
            { value: LogLevel.fatal, name: 'Fatal' },
            { value: LogLevel.none, name: 'None' },
        ];

        // --- Load saved log level from localStorage ---
        const savedLevel = localStorage.getItem(LocalStorageKeys.LOG_LEVEL);
        // Default to 'Info' if nothing is saved
        this.selectedLogLevel = savedLevel ? (JSON.parse(savedLevel) as LogLevel) : LogLevel.info;

        // Load your other settings...
        this.allowConsoleLogging = JSON.parse(localStorage.getItem(LocalStorageKeys.ALLOW_CONSOLE_LOGGING) || 'true');
        this.allowConsoleInfo = JSON.parse(localStorage.getItem(LocalStorageKeys.ALLOW_CONSOLE_INFO) || 'true');
        this.allowConsoleWarn = JSON.parse(localStorage.getItem(LocalStorageKeys.ALLOW_CONSOLE_WARN) || 'true');
        this.allowConsoleError = JSON.parse(localStorage.getItem(LocalStorageKeys.ALLOW_CONSOLE_ERROR) || 'true');
    }

    // This "changed" handler is triggered automatically by the @observable
    public selectedLogLevelChanged(newValue: LogLevel): void {
        if (newValue === undefined || newValue === null) return;

        // 1. Update the logger configuration through the container
        // Note: This affects new logger instances, existing ones may not change
        const loggerConfig = this.container.get(ILogger);

        // 2. Save the new setting for the next page load
        localStorage.setItem(LocalStorageKeys.LOG_LEVEL, JSON.stringify(newValue));

        // 3. Log a confirmation message so the user can see the effect
        this.logger.info(`Log level changed to: ${this.logLevels.find(l => l.value === newValue)?.name}`);

        // 4. You might need to refresh the page or reinitialize loggers for full effect
        console.log('Note: Log level change may require page refresh to take full effect');
    }

    // Console logging toggle methods
    allowConsoleLoggingChanged(newValue: boolean): void {
        localStorage.setItem(LocalStorageKeys.ALLOW_CONSOLE_LOGGING, JSON.stringify(newValue));
        this.toggleConsoleMethod('log', newValue);
    }

    allowConsoleInfoChanged(newValue: boolean): void {
        localStorage.setItem(LocalStorageKeys.ALLOW_CONSOLE_INFO, JSON.stringify(newValue));
        this.toggleConsoleMethod('info', newValue);
    }

    allowConsoleWarnChanged(newValue: boolean): void {
        localStorage.setItem(LocalStorageKeys.ALLOW_CONSOLE_WARN, JSON.stringify(newValue));
        this.toggleConsoleMethod('warn', newValue);
    }

    allowConsoleErrorChanged(newValue: boolean): void {
        localStorage.setItem(LocalStorageKeys.ALLOW_CONSOLE_ERROR, JSON.stringify(newValue));
        this.toggleConsoleMethod('error', newValue);
    }

    private originalConsoleMethods = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    };

    private toggleConsoleMethod(method: keyof Console, enabled: boolean): void {
        if (enabled) {
            // Restore original method
            (console as any)[method] = this.originalConsoleMethods[method as keyof typeof this.originalConsoleMethods];
        } else {
            // Replace with no-op function
            (console as any)[method] = () => { };
        }
    }
}