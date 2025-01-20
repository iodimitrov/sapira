import type {
  AssignmentType,
  EducationStage,
  InstitutionType,
  MessageStatus,
  MessageType,
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
