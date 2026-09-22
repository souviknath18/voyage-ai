const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api/v1";


function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}


function setAccessToken(
  token: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "access_token",
    token,
  );
}


function clearAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    "access_token",
  );
}


let refreshPromise:
  Promise<string | null> | null =
  null;


async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response =
        await fetch(
          `${API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

      if (!response.ok) {
        clearAccessToken();
        return null;
      }

      const data: {
        access_token: string;
        token_type: string;
      } = await response.json();

      setAccessToken(
        data.access_token,
      );

      return data.access_token;
    } catch (error) {
      console.error(
        "Token refresh failed:",
        error,
      );

      clearAccessToken();

      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken =
    getAccessToken();

  const headers = new Headers(
    options.headers,
  );

  headers.set(
    "Content-Type",
    "application/json",
  );

  if (
    accessToken &&
    !headers.has("Authorization")
  ) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  let response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
      credentials: "include",
    },
  );

  /*
   * Access token may have expired.
   *
   * Do not attempt refresh when the
   * refresh endpoint itself returns 401.
   */
  if (
    response.status === 401 &&
    endpoint !== "/auth/refresh"
  ) {
    const newAccessToken =
      await refreshAccessToken();

    if (newAccessToken) {
      const retryHeaders =
        new Headers(
          options.headers,
        );

      retryHeaders.set(
        "Content-Type",
        "application/json",
      );

      retryHeaders.set(
        "Authorization",
        `Bearer ${newAccessToken}`,
      );

      response = await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        },
      );
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.detail ??
        "Something went wrong",
    );
  }

  return response.json();
}


export async function apiBlobRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<Blob> {
  const accessToken =
    getAccessToken();

  const headers = new Headers(
    options.headers,
  );

  if (
    accessToken &&
    !headers.has("Authorization")
  ) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  let response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
      credentials: "include",
    },
  );

  if (response.status === 401) {
    const newAccessToken =
      await refreshAccessToken();

    if (newAccessToken) {
      const retryHeaders =
        new Headers(
          options.headers,
        );

      retryHeaders.set(
        "Authorization",
        `Bearer ${newAccessToken}`,
      );

      response = await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        },
      );
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.detail ??
        "Something went wrong",
    );
  }

  return response.blob();
}


export interface PlaceImage {
  provider: string;
  provider_image_id: string;
  url: string;
  thumbnail_url: string;
  alt: string;
  photographer_name: string;
  photographer_url: string;
  attribution_url: string;
}


export async function getDestinationImageFromApi(
  destination: string,
  country?: string | null,
): Promise<PlaceImage | null> {
  const params = new URLSearchParams({
    destination,
  });

  if (country) {
    params.set(
      "country",
      country,
    );
  }

  return apiRequest<PlaceImage | null>(
    `/images/destination?${params.toString()}`,
  );
}


export async function getPlaceImageFromApi(
  placeName: string,
  destination: string,
  country?: string | null,
): Promise<PlaceImage | null> {
  const params = new URLSearchParams({
    place_name: placeName,
    destination,
  });

  if (country) {
    params.set(
      "country",
      country,
    );
  }

  return apiRequest<PlaceImage | null>(
    `/images/place?${params.toString()}`,
  );
}


export interface PlaceImageBatchRequestItem {
  key: string;
  place_name: string;
  destination: string;
  country?: string | null;
}

export interface PlaceImageBatchItem {
  key: string;
  image: PlaceImage | null;
}

export interface PlaceImageBatchResponse {
  images: PlaceImageBatchItem[];
}

export async function getPlaceImagesBatch(
  places: PlaceImageBatchRequestItem[],
): Promise<PlaceImageBatchResponse> {
  return apiRequest<PlaceImageBatchResponse>(
    "/images/places/batch",
    {
      method: "POST",
      body: JSON.stringify({
        places,
      }),
    },
  );
}