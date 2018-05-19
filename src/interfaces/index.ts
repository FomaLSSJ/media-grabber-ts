export interface Platform {
    name: string,
    domains: string[],
    validator: Function,
    resolver: Function
}