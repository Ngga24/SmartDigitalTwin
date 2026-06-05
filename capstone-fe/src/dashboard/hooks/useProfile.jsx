import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function useProfile() {
const [profile, setProfile] = useState({
full_name: "",
phone: "",
birth_date: "",
gender: "",
});

const [profileImage, setProfileImage] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [successMsg, setSuccessMsg] = useState("");

const fetchProfile = async () => {
try {
setLoading(true);
setError(null);


  const res = await apiFetch("/profiles", {
    method: "GET",
  });

  const result = await res.json();

  console.log("PROFILE RESPONSE:", result);

  if (!res.ok) {
    throw new Error(
      result.message || "Gagal memuat profil"
    );
  }

  const profileData = result.data;

  setProfile({
    full_name: profileData.fullname || "",
    phone: profileData.phone || "",
    birth_date: profileData.birthdate
      ? profileData.birthdate.split("T")[0]
      : "",
    gender: profileData.gender || "",
  });

  if (profileData.profileimage) {
    const imageUrl =
      `${BASE_URL}/${profileData.profileimage}`;

    setProfileImage(imageUrl);

    localStorage.setItem(
      "profileImage",
      imageUrl
    );
  }

  setError(null);
} catch (err) {
  console.error("Fetch Profile Error:", err);
  setError(err.message);
} finally {
  setLoading(false);
}


};

const updateProfile = async (formData) => {
try {
setLoading(true);
setError(null);
setSuccessMsg("");


  const response = await apiFetch("/profiles", {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  console.log("UPDATE RESPONSE:", result);

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal update profil"
    );
  }

  setSuccessMsg(
    result.message ||
      "Profile updated successfully!"
  );

  await fetchProfile();

  return result;
} catch (err) {
  console.error(
    "Update Profile Error:",
    err
  );

  setError(err.message);
  throw err;
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchProfile();
}, []);

return {
profile,
setProfile,
profileImage,
setProfileImage,
loading,
error,
successMsg,
updateProfile,
fetchProfile,
};
}
