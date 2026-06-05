import { useState } from "react";
import { apiFetch } from "../../utils/api";

export default function useForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendOtp = async (email) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiFetch("/forgot-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Gagal mengirim OTP"
                );
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (email, code) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiFetch("/forgot-password/verify-otp",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        code,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                data.message || "OTP tidak valid"
                );
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiFetch("/forgot-password/reset-password",
            {
                method: "POST",
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Gagal mengubah password");
        }

        return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendOtp,
        verifyOtp,
        resetPassword,
        isLoading,
        error,
    };
}