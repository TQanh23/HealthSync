import { AUTH_LOGIN, AUTH_REGISTER  } from "./apiConfig";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
};

class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status = 0, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string; 
  gender: string;
  heightCm: number;
  weightKg: number;
};

export type RegisterResponse = {
  userId: string;
  message: string;
};

async function requestJson<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const init: RequestInit = {
    headers: {
      "Content-Type": "application/json", 
      ...(opts.headers || {}),
    },
    ...opts,
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    throw new ApiError(data?.message || res.statusText || "Request failed", res.status, data);
  }

  return data as T;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  return requestJson<LoginResponse>(AUTH_LOGIN, { method: "POST", body: JSON.stringify(body) });
}
export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  return requestJson<RegisterResponse>(AUTH_REGISTER, { method: "POST", body: JSON.stringify(body) });
}

export default { login, register };
