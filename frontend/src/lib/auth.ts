import { apiRequest } from "@/lib/api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  full_name: string | null;
}

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
}


export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response =
    await apiRequest<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

  localStorage.setItem(
    "access_token",
    response.access_token,
  );

  return response;
}


export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    },
  );
}


export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>(
      "/auth/logout",
      {
        method: "POST",
      },
    );
  } finally {
    localStorage.removeItem(
      "access_token",
    );
  }
}


export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>(
    "/auth/me",
    {
      method: "GET",
    },
  );
}