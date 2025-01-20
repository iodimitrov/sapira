export type EducationStage = 'ELEMENTARY' | 'PRIMARY' | 'UNITED' | 'HIGH';

export type InstitutionType =
  | 'NATURAL_MATHEMATICAL'
  | 'TECHNOLOGICAL'
  | 'LINGUISTICAL'
  | 'MATHEMATICAL'
  | 'HUMANITARIAN'
  | 'ART'
  | 'SU'
  | 'OU';

export type MessageType = 'ASSIGNMENT' | 'MESSAGE';

export type MessageStatus = 'CREATED' | 'PUBLISHED';

export type AssignmentType = 'HOMEWORK' | 'CLASSWORK' | 'EXAM';

export type UserRole = 'ADMIN' | 'PARENT' | 'STUDENT' | 'TEACHER' | 'VIEWER';

export type GradeType = 'YEAR' | 'TURM_1' | 'TURM_2' | 'ONGOING';

export type ContractType = 'PART_TIME' | 'FULL_TIME';

export type UserStatus = 'UNVERIFIED' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
