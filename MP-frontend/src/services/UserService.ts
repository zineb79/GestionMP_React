export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  dateCreation: string;
}

export interface UserForm {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: string;
}
