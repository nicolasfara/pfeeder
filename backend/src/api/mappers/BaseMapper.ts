export interface BaseMapper<T, Z> {
    mapSingleDocument(document: Z): T
    mapArrayDocument(document: Z[]): T[]
}