export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const TOKEN_STORAGE_KEY = "token";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  solvedProblems?: number;
  totalProblems?: number;
}

export interface UserActivity {
  date: string;
  count: number;
}

export interface UserContest {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  status: string;
  isRegistered?: boolean;
  problems?: number;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatarFile?: File | null;
}

export interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const clearStoredToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const fetchWithAuth = async <T>(path: string, token: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
};

export const fetchUserProfile = (token: string) =>
  fetchWithAuth<UserProfile>("/api/user/profile", token);

export const fetchUserCalendar = (token: string) =>
  fetchWithAuth<UserActivity[]>("/api/user/calendar", token);

export const fetchUserContests = (token: string) =>
  fetchWithAuth<UserContest[]>("/api/user/contest/allcontest", token);

export const fetchUserHistory = (token: string) =>
  fetchWithAuth<any[]>("/api/user/history?limit=10", token);

export const updateUserProfile = async (
  token: string,
  input: UpdateProfileInput
) => {
  const formData = new FormData();

  if (input.name !== undefined) {
    formData.append("name", input.name);
  }

  if (input.bio !== undefined) {
    formData.append("bio", input.bio);
  }

  if (input.avatarFile) {
    formData.append("avatar", input.avatarFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/user/updateProfile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = (await response.json()) as
    | UpdateProfileResponse
    | { message?: string };

  if (!response.ok) {
    throw new Error(payload.message || "Failed to update profile");
  }

  return payload as UpdateProfileResponse;
};
