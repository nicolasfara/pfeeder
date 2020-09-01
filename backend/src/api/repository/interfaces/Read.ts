export interface Read<T> {
    retrieve(): Promise<T[]>
    findById(id: string): Promise<T>
    findOne(query: any): Promise<T>
    findMany(query: any): Promise<T[]>
}