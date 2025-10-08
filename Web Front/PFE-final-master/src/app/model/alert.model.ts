export class Alert {
  id?: number;
  name!: string;
  userId!: number;
  fieldName!: string;
  operator!: string;
  threshold!: number;
  emailNotification!: boolean;
  triggerFrequency!:number;
  type!: string;
  active!:boolean;
}
