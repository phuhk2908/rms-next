export function generateEmployeeCode() {
   const year = new Date().getFullYear(); 

   const randomLetter = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
   );

   const randomNumber = Math.floor(100 + Math.random() * 900);

   return `EMP-${year}${randomLetter}${randomNumber}`;
}
