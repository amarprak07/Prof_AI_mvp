// import { useState } from 'react';
// import { Link } from 'wouter';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Eye, EyeOff, ArrowLeft, Mail, User, Lock } from 'lucide-react';
// // import logoPath from "../assets/icon.png";

// export default function SignUp() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle signup logic here
//     console.log('Signup form submitted:', formData);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 flex items-center justify-center p-4" data-testid="signup-page">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
//       <div className="relative w-full max-w-md">
//         {/* Back to Home Link */}
//         <Link href="/">
//           <Button 
//             variant="ghost" 
//             className="absolute -top-16 left-0 text-white/70 hover:text-white hover:bg-white/10 transition-all"
//             data-testid="back-to-home"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Button>
//         </Link>

//         <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
//           <CardHeader className="text-center space-y-4">
//             <div className="flex justify-center">
//               <img 
//                 // src={logoPath} 
//                 alt="Professor AI Logo" 
//                 className="h-12 w-auto"
//                 data-testid="signup-logo"
//               />
//             </div>
//             <CardTitle className="text-2xl font-bold text-white">
//               Join Professor AI
//             </CardTitle>
//             <CardDescription className="text-white/70">
//               Start your personalized learning journey today
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Full Name Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="fullName" className="text-white/90 font-medium">
//                   Full Name
//                 </Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
//                   <Input
//                     id="fullName"
//                     name="fullName"
//                     type="text"
//                     placeholder="Enter your full name"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
//                     data-testid="input-full-name"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-white/90 font-medium">
//                   Email Address
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
//                     data-testid="input-email"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-white/90 font-medium">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Create a strong password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
//                     data-testid="input-password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
//                     data-testid="toggle-password-visibility"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword" className="text-white/90 font-medium">
//                   Confirm Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
//                     data-testid="input-confirm-password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
//                     data-testid="toggle-confirm-password-visibility"
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button 
//                 type="submit"
//                 className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-accent via-primary to-accent bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/30 text-white border-0"
//                 data-testid="button-create-account"
//               >
//                 Create Account
//               </Button>
//             </form>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t border-white/20" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-transparent px-2 text-white/70">Or continue with</span>
//               </div>
//             </div>

//             {/* Social Signup Options */}
//             <div className="grid grid-cols-2 gap-4">
//               <Button 
//                 variant="outline" 
//                 className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
//                 data-testid="button-google-signup"
//               >
//                 <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
//                   <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 Google
//               </Button>
//               <Button 
//                 variant="outline" 
//                 className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
//                 data-testid="button-github-signup"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                 </svg>
//                 GitHub
//               </Button>
//             </div>

//             {/* Sign In Link */}
//             <div className="text-center">
//               <p className="text-white/70">
//                 Already have an account?{' '}
//                 <Link href="/signin">
//                   <span className="text-accent hover:text-accent/80 font-medium cursor-pointer transition-colors">
//                     Sign in
//                   </span>
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }