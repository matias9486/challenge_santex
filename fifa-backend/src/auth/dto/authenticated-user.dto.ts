export interface AuthenticatedUserDto {
  id: string;
  fullName: string;
  roles: string[]; // Para los Guards!
  token: string;
}
