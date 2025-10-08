

export interface Notification {
    id: number;
    message: string;
    tickerDetails: string;
    tickerCount: number;
    alert: string;
    viewed: any;
    userId:number;
    createdAt:Date;
    alertName: string;
    alertType: string;
    alertFieldName: string;
    alertoperator: string;
    alertthreshold: number;
  }
