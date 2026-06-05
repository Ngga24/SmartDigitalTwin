const BASE_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  // PERBAIKAN 1: Hanya pasang Content-Type JSON jika body BUKAN FormData
  const headers = {
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Interceptor jika token expired (401)
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      // PERBAIKAN 2: Jika '/auth' masih 404, cek Swagger/Postman kamu!
      // Ganti '/auth' di bawah ini dengan endpoint refresh token yang benar (misal: '/authentications')
      const refreshRes = await fetch(`${BASE_URL}/auth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();

        // Ambil token baru (tambahkan opsional chaining ?. untuk menghindari crash)
        const newAccessToken = refreshData.data?.accessToken || refreshData.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // Lakukan request ulang ke endpoint awal dengan token baru
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders,
        });
      } else {
        // Jika refresh token juga gagal/expired, hapus session dan reload ke login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload();
      }
    }
  }

  return response;
};