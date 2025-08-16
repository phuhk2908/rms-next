export function generateSecurePassword() {
   const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
   const numberChars = "0123456789";
   const specialChars = "!@#$%^&*";

   const allChars =
      uppercaseChars + lowercaseChars + numberChars + specialChars;

   let password = "";

   password +=
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
   password +=
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
   password += numberChars[Math.floor(Math.random() * numberChars.length)];
   password += specialChars[Math.floor(Math.random() * specialChars.length)];

   for (let i = 0; i < 4; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
   }

   const shuffledPassword = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

   return shuffledPassword;
}
