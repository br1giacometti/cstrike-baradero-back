export default abstract class BaseGuidRepository<T, IdType = string> {
  abstract insert(entity: T): Promise<T>;
  abstract findById(id: IdType): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract delete(id: IdType): Promise<T>;
  abstract update(id: IdType, entity: Partial<T>): Promise<T>;
}
