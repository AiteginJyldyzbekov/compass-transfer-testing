import { Role, ActivityStatus } from '@entities/users/enums';
import type { GetUserSelfProfileTerminalDTO } from '@entities/users/interface';

export const mockTerminalProfile: GetUserSelfProfileTerminalDTO = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'terminal001@compass.local',
  role: Role.Terminal,
  phoneNumber: null,
  fullName: 'Терминал №001',
  avatarUrl: null,
  online: true,
  lastActive: new Date().toISOString(),
  status: ActivityStatus.Active,
  locationId: '550e8400-e29b-41d4-a716-446655440201', // ID локации терминала
  profile: {
    terminalId: 'TERM-001',
    ipAddress: '192.168.1.100',
    deviceModel: 'PayPoint Pro',
    osVersion: 'Linux Ubuntu 20.04',
    appVersion: '2.1.5',
    browserInfo: 'Chrome 120.0.0.0',
    screenResolution: '1920x1080',
    deviceIdentifier: 'DEVICE-001-UNIQUE-ID',
  },
};
