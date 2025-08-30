// __tests__/base-entity-mapper.spec.ts
import { BaseEntityMapper } from './base.mapper';

type DomainModel = { id: number; name: string };
type EntityDatabaseModel = { id: number; fullName: string };

class TestEntityMapper extends BaseEntityMapper<
  DomainModel,
  EntityDatabaseModel
> {
  toDomain(entity: EntityDatabaseModel): DomainModel {
    return { id: entity.id, name: entity.fullName };
  }

  toEntityDatabase(domain: DomainModel): EntityDatabaseModel {
    return { id: domain.id, fullName: domain.name };
  }
}

describe('BaseEntityMapper', () => {
  let mapper: TestEntityMapper;

  beforeEach(() => {
    mapper = new TestEntityMapper();
  });

  describe('toDomainAll', () => {
    it('маппит массив entity-database в массив domain', () => {
      const entities: EntityDatabaseModel[] = [
        { id: 1, fullName: 'Alice' },
        { id: 2, fullName: 'Bob' },
      ];

      const result = mapper.toDomainAll(entities);

      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });
  });

  describe('toEntityDatabaseAll', () => {
    it('маппит массив domain в массив entity-database', () => {
      const domains: DomainModel[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const result = mapper.toEntityDatabaseAll(domains);

      expect(result).toEqual([
        { id: 1, fullName: 'Alice' },
        { id: 2, fullName: 'Bob' },
      ]);
    });
  });
});
