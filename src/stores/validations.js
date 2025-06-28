export const fullNameRules = () => ([
  v => !!v || "Full name is required",
  v => (v?.length >= 3) || "Full name must be at least 3 characters",
  v => /^[^\d]+$/.test(v) || "Full name cannot contain digits"
]);

export const emailRules = (usersArray = []) => ([
  v => !!v || "Email is required",
  v => /.+@.+\..+/.test(v) || "Email must be valid",
  v => !usersArray.some(user => user.email === v) || "Email already exists"
]);

export const usernameRules = (usersArray = []) => ([
  v => !!v || "Username is required",
  v => v.length <= 10 || "Username must be 10 characters or less",
  v => !usersArray.some(user => user.username === v) || "Username already exists"
]);

export const passwordRules = () => ([
  v => !!v || "Password is required",
  v => v.length >= 6 || "Password must be at least 6 characters"
]);

export const confirmPasswordRules = (passwordValue) => ([
  v => !!v || "Confirm password is required",
  v => v === passwordValue || "Passwords must match"
]);

export const upiRules =  () => {
        v => !!v || 'UPI ID is required',
        v => /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{2,256}$/.test(v) || 'Invalid UPI ID format'
}

const pincodeRules = (v) => /^\d{6}$/.test(v) || 'Invalid Pincode';


export default {
  fullNameRules,
  emailRules,
  usernameRules,
  passwordRules,
  confirmPasswordRules,
  upiRules,
  pincodeRules
};
