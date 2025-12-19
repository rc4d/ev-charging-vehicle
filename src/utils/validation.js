export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== "string") return false;

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Indian mobile: exactly 10 digits, starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(digitsOnly);
}

export function validateOTP(otp) {
  if (!otp || typeof otp !== "string") return false;

  const digitsOnly = otp.replace(/\D/g, "");
  return digitsOnly.length === 4;
}

export function validateName(name) {
  if (!name || typeof name !== "string") return false;

  const trimmedName = name.trim();
  // At least 2 characters, only letters and spaces
  return trimmedName.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmedName);
}

export function formatPhone(phone) {
  if (!phone) return "";

  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 6)
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
    3,
    6
  )}-${digitsOnly.slice(6, 10)}`;
}

export function getValidationError(field, value) {
  switch (field) {
    case "email":
      if (!value) return "Email is required";
      if (!validateEmail(value)) return "Please enter a valid email address";
      return "";
    case "phone":
      if (!value) return "Phone number is required";
      if (!validatePhone(value))
        return "Please enter a valid Indian mobile number (10 digits starting with 6-9)";
      return "";
    case "otp":
      if (!value) return "OTP is required";
      if (!validateOTP(value)) return "Please enter a valid 4-digit OTP";
      return "";
    case "name":
      if (!value) return "Name is required";
      if (!validateName(value))
        return "Please enter a valid name (letters only, min 2 characters)";
      return "";
    default:
      return "";
  }
}
