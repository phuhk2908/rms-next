import {
   Body,
   Button,
   Container,
   Heading,
   Html,
   Preview,
   Tailwind,
   Text,
} from "@react-email/components";

interface EmailTemplateProps {
   email: string;
   password: string;
}

export const EmailTemplate = ({ email, password }: EmailTemplateProps) => {
   return (
      <Html>
         <Tailwind>
            <Body className="bg-slate-50 font-sans">
               <Preview>Thông tin tài khoản của bạn</Preview>

               <Container className="mx-auto my-12 max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {/* Header */}
                  <div className="rounded-t-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-8 text-center">
                     <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                        <span className="text-4xl">🎉</span>
                     </div>
                     <Heading className="mb-2 text-2xl font-bold text-black">
                        Welcome
                     </Heading>
                     <Text className="text-black">
                        Your account is created successfully
                     </Text>
                  </div>

                  {/* Content */}
                  <div className="px-8 py-8">
                     <Text className="mb-6 text-center text-slate-600">
                        Here is your account infomation. Please do not share
                        with anyone !!!
                     </Text>

                     {/* Account Info Card */}
                     <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
                        <Text className="mb-4 text-sm font-semibold text-slate-700">
                           Your account
                        </Text>
                        <div>
                           <div className="mb-4 flex items-center justify-between gap-x-2 rounded-lg bg-white p-3">
                              <Text className="text-sm text-slate-600">
                                 Email:
                              </Text>
                              <Text className="text-sm font-semibold text-slate-900">
                                 {email}
                              </Text>
                           </div>
                           <div className="flex items-center justify-between gap-x-2 rounded-lg bg-white p-3">
                              <Text className="text-sm text-slate-600">
                                 Password:
                              </Text>
                              <Text className="font-mono text-sm font-semibold text-slate-900">
                                 {password}
                              </Text>
                           </div>
                        </div>
                     </div>

                     {/* CTA Button */}
                     <div className="mb-6 text-center">
                        <Button
                           href="https://yourwebsite.com/login"
                           className="btn-hover inline-block rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-white shadow-lg"
                        >
                           Log in now
                        </Button>
                     </div>

                     <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <Text className="text-center text-sm text-amber-800">
                           💡 <strong>Warning:</strong> Change your password as
                           soon as you log in the system for security
                        </Text>
                     </div>
                  </div>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
};

export default EmailTemplate;
