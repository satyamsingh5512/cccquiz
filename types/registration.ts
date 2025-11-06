export interface Registration {
  _id?: string;
  name: string;
  rollNumber: string;
  email: string;
  phone?: string;
  event: string;
  registeredAt: Date;
  registeredBy: string; // Admin who registered them
}
