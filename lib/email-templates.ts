// lib/email-templates.ts
export const getVerificationEmailTemplate = (
   verificationUrl: string,
   companyName: string = "Your Company Name",
) => {
   return `<!doctype html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Email Verification</title>
      <link
         href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
         rel="stylesheet"
      />
      <style>
         /* General Reset */
         body,
         a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
         }
         img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
         }
         body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: "Inter", "Arial", sans-serif;
         }

         /* Main Styles */
         .wrapper {
            background-color: #f4f4f7;
            padding: 20px 0;
         }
         .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
         }
         .header {
            padding: 40px;
            text-align: center;
            background-color: oklch(0.5417 0.179 288.0332);
         }
         .header img {
            width: 60px;
         }
         .content {
            padding: 40px 30px;
         }
         .content h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 20px;
         }
         .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin: 0 0 24px;
         }
         .button-container {
            text-align: center;
         }
         .button {
            background-color: oklch(0.5417 0.179 288.0332);
            border-radius: 6px;
            color: #ffffff;
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            padding: 14px 28px;
            text-decoration: none;
            border: none;
            cursor: pointer;
         }
         .link-fallback {
            padding-top: 20px;
            font-size: 12px;
            color: #6b7280;
            word-break: break-all;
         }
         .footer {
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
         }
         .footer a {
            color: oklch(0.5417 0.179 288.0332);
            text-decoration: none;
         }

         /* Responsive Styles */
         @media screen and (max-width: 600px) {
            .wrapper {
               padding: 0;
            }
            .container {
               width: 100% !important;
               max-width: 100% !important;
               border-radius: 0;
            }
            .content,
            .footer {
               padding: 30px 20px !important;
            }
            .header {
               padding: 30px 20px !important;
            }
            .content h1 {
               font-size: 22px !important;
            }
         }
      </style>
   </head>
   <body
      style="
         margin: 0 !important;
         padding: 0 !important;
         background-color: #f4f4f7;
      "
   >
      <!-- Main Wrapper -->
      <div class="wrapper">
         <!-- Container -->
         <div class="container">
            <!-- Header Section -->
            <div class="header">
               <!-- You can replace this with your logo -->
               <img
                  src="https://placehold.co/120x120/ffffff/4f46e5?text=Fuofuo"
                  alt="Company Logo"
                  style="
                     width: 60px;
                     height: auto;
                     display: block;
                     margin: 0 auto;
                  "
               />
            </div>

            <!-- Content Section -->
            <div class="content">
               <h1>Verify Your Email Address</h1>
               <p>
                  Thanks for signing up for ${companyName}! To complete
                  your registration, please click the button below to verify
                  your email address.
               </p>

               <!-- Call to Action Button -->
               <div class="button-container">
                  <a href="${verificationUrl}" target="_blank" class="button"
                     >Verify Email Now</a
                  >
               </div>

               <p style="margin-top: 24px">
                  This link will expire in 24 hours. If you did not sign up for
                  an account, you can safely ignore this email.
               </p>

               <!-- Fallback Link -->
               <div class="link-fallback">
                  If the button above doesn't work, copy and paste this link
                  into your browser:<br />
                  <a
                     href="${verificationUrl}"
                     target="_blank"
                     style="color: oklch(0.5417 0.179 288.0332); text-decoration: underline"
                     >${verificationUrl}</a
                  >
               </div>
            </div>

            <!-- Footer Section -->
            <div class="footer">
               <p>&copy; 2025 ${companyName}. All rights reserved.</p>
               <p>[Your Company Address], [City], [Country]</p>
               <p>
                  If you have any questions, feel free to
                  <a href="mailto:support@yourcompany.com"
                     >contact our support team</a
                  >.
               </p>
            </div>
         </div>
         <!-- /Container -->
      </div>
      <!-- /Main Wrapper -->
   </body>
</html>`;
};
