
import { apiRequest } from "@/lib/api";

import type {
  UserSettingsResponse,
  UserSettingsUpdate,
} from "@/types/settings";


/**
 * Fetch settings for the authenticated user.
 *
 * Backend:
 * GET /api/v1/user-settings
 */
export async function getUserSettings():
  Promise<UserSettingsResponse> {
  return apiRequest<UserSettingsResponse>(
    "/user-settings",
    {
      method: "GET",
      cache: "no-store",
    },
  );
}


/**
 * Update settings for the authenticated user.
 *
 * Backend:
 * PATCH /api/v1/user-settings
 *
 * Only supplied fields are updated.
 */
export async function updateUserSettings(
  payload: UserSettingsUpdate,
): Promise<UserSettingsResponse> {
  return apiRequest<UserSettingsResponse>(
    "/user-settings",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}
