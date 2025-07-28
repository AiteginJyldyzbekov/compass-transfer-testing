import { Role, ActivityStatus } from '@entities/users/enums';
import type { GetUserSelfProfileOperatorDTO } from '@entities/users/interface';

export const mockOperatorProfile: GetUserSelfProfileOperatorDTO = {
  id: 'operator-001',
  email: 'operator@compass.local',
  role: Role.Operator,
  phoneNumber: '+996 555 456 789',
  fullName: 'Петрова Анна Сергеевна',
  avatarUrl: null,
  online: true,
  lastActive: new Date().toISOString(),
  status: ActivityStatus.Active,
  locationId: null,
  profile: {
    employeeId: 'OP-1753279926423',
    department: 'Служба поддержки клиентов',
    position: 'Старший оператор call-центра',
    hireDate: '2022-03-20T00:00:00Z',
  },
};
