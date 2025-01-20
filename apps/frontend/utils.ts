import type {
  AssignmentType,
  EducationStage,
  InstitutionType,
  MessageStatus,
  MessageType,
  UserRole,
  UserStatus,
} from '@sapira/database';

export const getInstitutionType = (
  type: InstitutionType | string | undefined,
): string | undefined => {
  switch (type) {
    case 'TECHNOLOGICAL':
      return 'Технологично';
    case 'MATHEMATICAL':
      return 'Математичска';
    case 'NATURAL_MATHEMATICAL':
      return 'Природоматематичска';
    case 'HUMANITARIAN':
      return 'Хуманитарна';
    case 'ART':
      return 'Художествена';
    case 'LINGUISTICAL':
      return 'Езикова';
    case 'SU':
      return 'СУ';
    case 'OU':
      return 'ОУ';
    default:
      return undefined;
  }
};

export const getEducationStage = (
  stage: EducationStage | string | undefined,
): string | undefined => {
  switch (stage) {
    case 'ELEMENTARY':
      return 'Начално училище';
    case 'PRIMARY':
      return 'Основно училище';
    case 'UNITED':
      return 'Обединено училище';
    case 'HIGH':
      return 'Гимназия';
    case 'SECONDARY':
      return 'Гимназия';
    default:
      return undefined;
  }
};

export const getMessageStatus = (
  status: MessageStatus | string | undefined,
): string | undefined => {
  switch (status) {
    case 'CREATED':
      return 'Създадено';
    case 'PUBLISHED':
      return 'Изпратено';
    default:
      return undefined;
  }
};

export const getMessageType = (
  type: MessageType | string | undefined,
): string | undefined => {
  switch (type) {
    case 'ASSIGNMENT':
      return 'Заданиe';
    case 'MESSAGE':
      return 'Съобщениe';
    default:
      return undefined;
  }
};

export const getAssignmentType = (
  type: AssignmentType | string | undefined,
): string | undefined => {
  switch (type) {
    case 'HOMEWORK':
      return 'Домашно';
    case 'CLASSWORK':
      return 'Работа в клас';
    case 'EXAM':
      return 'Контролно';
    default:
      return undefined;
  }
};

export const getUserStatus = (
  status: UserStatus | string | undefined,
): string | undefined => {
  switch (status) {
    case 'UNVERIFIED':
      return 'Непотвърден';
    case 'ACTIVE':
      return 'Активен';
    case 'INACTIVE':
      return 'Неактивен';
    case 'BLOCKED':
      return 'Блокиран';
    default:
      return undefined;
  }
};

export const getUserRole = (
  role: UserRole | string | undefined,
): string | undefined => {
  switch (role) {
    case 'ADMIN':
      return 'Админ';
    case 'PARENT':
      return 'Родител';
    case 'STUDENT':
      return 'Ученик';
    case 'TEACHER':
      return 'Учител';
    case 'VIEWER':
      return 'Посетител';
    default:
      return undefined;
  }
};

export const getGradeName = (
  name: string | number | undefined,
  short = false,
): string | undefined => {
  switch (name) {
    case 'BAD':
    case 2:
      return short ? 'сл.' : 'слаб';
    case 'AVERAGE':
    case 3:
      return short ? 'ср.' : 'среден';
    case 'GOOD':
    case 4:
      return short ? 'доб.' : 'добър';
    case 'VERY_GOOD':
    case 5:
      return short ? 'мн. доб.' : 'мн. добър';
    case 'EXCELLENT':
    case 6:
      return short ? 'отл.' : 'отличен';
    default:
      return undefined;
  }
};
