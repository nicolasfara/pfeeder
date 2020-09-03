export interface Read<T> {
    retrieve(): Promise<T[]>
    findById(id: string, populate?: string): Promise<T>
    findOne(query: any, projection?: string): Promise<T>
    findMany(query: any, projection?: string): Promise<T[]>
}