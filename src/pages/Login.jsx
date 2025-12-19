import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ThemeToggle from "../components/common/ThemeToggle";
import {
  validateEmail,
  validatePhone,
  validateOTP,
  getValidationError,
  formatPhone,
} from "../utils/validation";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginType, setLoginType] = useState("phone"); // 'phone' or 'email'
  const [credential, setCredential] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("credential"); // 'credential' or 'otp'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialChange = (e) => {
    const value = e.target.value;
    setCredential(loginType === "phone" ? formatPhone(value) : value);
    setError("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setOtp(value);
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validate credential
    const rawCredential =
      loginType === "phone" ? credential.replace(/\D/g, "") : credential;
    const validationError = getValidationError(loginType, rawCredential);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!validateOTP(otp)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    // Simulate OTP verification
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    // Check for invalid OTP (0000 is always invalid for testing)
    if (otp === "0000") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    const rawCredential =
      loginType === "phone" ? credential.replace(/\D/g, "") : credential;
    const result = login(rawCredential, loginType);

    if (result.success) {
      if (result.isNewUser) {
        navigate("/profile-setup");
      } else {
        navigate("/home");
      }
    }
  };

  const handleBack = () => {
    setStep("credential");
    setOtp("");
    setError("");
  };

  const switchLoginType = () => {
    setLoginType((prev) => (prev === "phone" ? "email" : "phone"));
    setCredential("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-gray-50 to-primary/5 dark:from-gray-900 dark:via-gray-900 dark:to-primary/10 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              EV Charge
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Smart charging for your electric vehicle
            </p>
          </div>

          {/* Login Card */}
          <div className="card">
            {step === "credential" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Welcome Back
                </h2>

                <form onSubmit={handleSendOtp}>
                  {/* Login Type Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
                    <button
                      type="button"
                      onClick={() => loginType !== "phone" && switchLoginType()}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        loginType === "phone"
                          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => loginType !== "email" && switchLoginType()}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        loginType === "email"
                          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Email
                    </button>
                  </div>

                  {/* Credential Input */}
                  <Input
                    label={
                      loginType === "phone" ? "Phone Number" : "Email Address"
                    }
                    type={loginType === "phone" ? "tel" : "email"}
                    placeholder={
                      loginType === "phone" ? "123-456-7890" : "you@example.com"
                    }
                    value={credential}
                    onChange={handleCredentialChange}
                    error={error}
                    leftIcon={
                      loginType === "phone" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      )
                    }
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    className="mt-6"
                  >
                    Send OTP
                  </Button>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Enter OTP
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We sent a verification code to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {credential}
                  </span>
                </p>

                <form onSubmit={handleVerifyOtp}>
                  {/* OTP Input */}
                  <Input
                    label="Verification Code"
                    type="text"
                    inputMode="numeric"
                    placeholder="0000"
                    value={otp}
                    onChange={handleOtpChange}
                    error={error}
                    maxLength={4}
                    className="text-center"
                    helperText="Enter the 4-digit code (any code works for demo)"
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    className="mt-6"
                  >
                    Verify & Continue
                  </Button>

                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        /* put resend function here */
                      }}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
