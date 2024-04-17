export interface IWireitScript {
    allowUsuallyExcludedPaths?: boolean;
    clean?: boolean | 'if-file-deleted';
    command?: string;
    dependencies?: string[];
    env?: Record<string, string>;
    files?: string[];
    output?: string[];
    packageLogs?: string[];
    service?: boolean;
}
