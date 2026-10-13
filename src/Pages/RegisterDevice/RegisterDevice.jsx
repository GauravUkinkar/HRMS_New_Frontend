
import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterDevice.scss";

const USER_API = import.meta.env.VITE_USER_BACKEND_URL;

const RegisterDevice = () => {
  const [enrollmentCode, setEnrollmentCode] = useState(
    new URLSearchParams(window.location.search).get("code") || ""
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const registerDevice = async (e) => {
    e.preventDefault();

    if (!enrollmentCode.trim()) {
      toast.error("Please enter your enrollment code.");
      return;
    }

    if (!USER_API) {
      toast.error("Backend URL is not configured.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      // 1. Fetch registration options
      const optionsResponse = await fetch(
        `${USER_API}AuthController/passkey/register/options/${encodeURIComponent(
          enrollmentCode.trim()
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const optionsData = await optionsResponse.json().catch(() => ({}));

      if (!optionsResponse.ok) {
        throw new Error(
          optionsData.responseMessage ||
            optionsData.message ||
            "Unable to get registration options."
        );
      }

      if (!optionsData.challengeId || !optionsData.options?.publicKey) {
        throw new Error("Invalid registration options received from server.");
      }

      // 2. Ask the browser to create the passkey
      const credential = await startRegistration({
        optionsJSON: optionsData.options.publicKey,
      });

      // 3. Verify the generated credential with Spring Boot
      const verifyResponse = await fetch(
        `${USER_API}AuthController/passkey/register/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            challengeId: optionsData.challengeId,
            credential,
          }),
        }
      );

      const verifyData = await verifyResponse.json().catch(() => ({}));

      if (!verifyResponse.ok) {
        throw new Error(
          verifyData.responseMessage ||
            verifyData.message ||
            `Registration verification failed (${verifyResponse.status}).`
        );
      }

      setStatus("Device registered successfully.");
      toast.success("Your device has been registered successfully!");
    } catch (error) {
      console.error("Passkey registration error:", error);

      if (error.name === "NotAllowedError") {
        toast.info("Registration was cancelled or timed out.");
      } else {
        toast.error(error.message || "Device registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-device-page">
      <div className="register-device-card">
        <div className="register-device-icon">🔐</div>

        <h2>Register Your Device</h2>

        <p>
          Register this computer for secure access to Pandoza HRMS.
          You do not need to log in before registering.
        </p>

        <form onSubmit={registerDevice}>
          <label htmlFor="enrollmentCode">Enrollment Code</label>

          <input
            id="enrollmentCode"
            type="text"
            value={enrollmentCode}
            onChange={(e) => setEnrollmentCode(e.target.value)}
            placeholder="Enter your enrollment code"
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering Device..." : "Register This Device"}
          </button>
        </form>

        {status && <p className="registration-success">{status}</p>}

        <small>
          Complete the verification prompt displayed by your browser.
        </small>
      </div>
    </div>
  );
};

export default RegisterDevice;
