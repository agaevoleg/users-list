export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number,
  gender: 'male' | 'female';
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
}

export interface UsersData {
  total: number;
  limit: number;
  skip: number;
  users: User[];
}