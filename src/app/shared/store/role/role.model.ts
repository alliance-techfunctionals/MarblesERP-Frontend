export interface Role {
  id: number;
  role: string;
  description: string;
  name: string;
}

export function createRoleModel({
  id = 0,
  role = '',
  description = '',
  name = 'dummy'
}: Partial<Role>) {
  return {
    id,
    role,
    description,
    name
  } as Role;
}

