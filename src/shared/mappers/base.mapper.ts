/**
 * Маппер сущностей `domain` и `entity-database`
 * `domain` - класс который находиться в слое `domain/entity`
 * `entity-database` - класс который находиться в слое `infrastructure/database`
 */
export abstract class BaseEntityMapper<DomainModel, EntityDatabaseModel> {
  /**
   * Маппинг структуры `entity` в `domain`
   */
  abstract toDomain(entities: EntityDatabaseModel): DomainModel;
  /**
   * Маппинг структуры `domain` в `entity-database`
   */
  abstract toEntityDatabase(domainModel: DomainModel): EntityDatabaseModel;

  public toDomainAll(entityModel: EntityDatabaseModel[]): DomainModel[] {
    return entityModel.map((entity) => {
      return this.toDomain(entity);
    });
  }

  public toEntityDatabaseAll(
    domainEntities: DomainModel[],
  ): EntityDatabaseModel[] {
    return domainEntities.map((entity) => {
      return this.toEntityDatabase(entity);
    });
  }
}
