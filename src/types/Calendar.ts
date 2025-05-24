export type Calendar = {
    id: string,
    name: string,
    access: 'writer' | 'reader',
    primary: boolean,
    provider: string,
    lastUpdated: Date,
}