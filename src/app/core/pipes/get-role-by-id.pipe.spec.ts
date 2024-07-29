import { GetRoleByIdPipe } from "./get-role-by-id.pipe";

describe('GetRoleByIdPipe', () => {
  it('create an instance', () => {
    const pipe = new GetRoleByIdPipe();
    expect(pipe).toBeTruthy();
  });
});
