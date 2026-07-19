export interface AuthUser {
  user_id: number;
  nombre_usuario: string;
  rol: number; 
  cnd: number | null;
  cndnm: string
  ar: number | null;
  arnm: string
}

export interface LoginResponse {
  access_token: string | null;
  user: AuthUser | null;
}