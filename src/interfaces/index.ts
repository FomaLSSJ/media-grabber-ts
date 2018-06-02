export interface Platform {
    name: string,
    domains: string[],
    validator: Function,
    resolver: Function
}

export interface DownloadDoc {
    platform: string,
    description: string,
    url: string,
    file: string,
    status: boolean
}
