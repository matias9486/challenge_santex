import { AuthUser } from "./auth-user.interface";

export interface AuthResponse {
    id: string;
    fullName: string;
    roles: string[];
    token: string;
}