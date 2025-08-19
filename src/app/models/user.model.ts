export interface User {
  id: number;
  username: string;
  name: string;     // <-- Add this field
  email: string;
  role: 'user' | 'admin';
  active: boolean;
}
