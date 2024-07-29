import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, selectAllEntitiesApply, updateEntities, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { UserModel } from './user.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const userStore = createStore(
  { name: 'user', },
  withEntities<UserModel, 'id'>({ idKey: 'id' }),
);

const usersStateHistory = entitiesStateHistory(userStore, {
  maxAge: 2
});

usersStateHistory.destroy();

export class UserStoreService {
  // select All Users Data
  users$ = userStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<UserModel[]> {
    return this.users$;
  }

  selectById(id: number): Observable<UserModel | undefined> {
    return userStore.pipe(selectEntity(id));
  }

  selectByRoleId(id: number = 2000): Observable<UserModel[]> {
    return userStore.pipe(
      selectAllEntitiesApply({
        filterEntity: (e) => e.roleId === id,
      })
    );
  }

  upsertUsers(users: UserModel[]): void {
    userStore.update(upsertEntities(users))
  }

  addTodo(user: UserModel): void {
    userStore.update(addEntities([user]));
  }

  updateUser(user: UserModel): void {
    userStore.update(
      updateEntities(user.id, user)
    );
  }

  deleteUser(id: number): void {
    userStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.users$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): UserModel | undefined {
    return userStore.query(getEntity(id))
  }

  upsertById(user: UserModel): void {
    userStore.update(addEntities(user));

  }

  deleteById(id: number): void {
    userStore.update(deleteEntities(id));

  }

  resetUserStore(): void{
    userStore.update(setEntities([]));
  }

}

