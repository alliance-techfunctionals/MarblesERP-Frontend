import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, updateEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { Role } from './role.model';

const roleStore = createStore(
  { name: 'role', },
  withEntities<Role, 'id'>({ idKey: 'id' }),
);

const rolesStateHistory = entitiesStateHistory(roleStore, {
  maxAge: 2
});

rolesStateHistory.destroy();

export class RoleStoreService {
  // select All Users Data
  roles$ = roleStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Role[]> {
    return this.roles$;
  }

  selectById(id: number): Observable<Role | undefined> {
    return roleStore.pipe(selectEntity(id));
  }

  upsertRoles(roles: Role[]): void {
    roleStore.update(upsertEntities(roles))
  }

  addRole(role: Role): void {
    roleStore.update(addEntities([role]));
  }

  updateRole(role: Role): void {
    roleStore.update(
      updateEntities(role.id, role)
    );
  }

  deleteRole(id: number): void {
    roleStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.roles$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): Role | undefined {
    return roleStore.query(getEntity(id))
  }

  upsertById(role: Role): void {
    roleStore.update(addEntities(role));

  }

  deleteById(id: number): void {
    roleStore.update(deleteEntities(id));

  }


}

