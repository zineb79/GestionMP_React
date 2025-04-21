export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  service: string;
  dateCreation: string;
  status: 'actif' | 'inactif';
}

export interface UserForm {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: string;
  service: string;
}
