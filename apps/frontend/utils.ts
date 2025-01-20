import { EducationStage, InstitutionType } from '@sapira/database';

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
