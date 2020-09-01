export interface Read<T> {
    retrieve(): Promise<T[]>
    findById(id: string): Promise<T>
    find(query: any): Promise<T>
}