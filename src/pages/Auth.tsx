
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Heart } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

// Sign In Schema
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Sign Up Schema
const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  location: z.string().optional(),
  role: z.enum(["couple", "vendor", "planner", "venue"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { login, signUp } = useAuth(); // Destructure signUp

  // Sign In Form
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign Up Form
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      role: "couple",
    },
  });

  async function onSignIn(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      await login({
        email: values.email.trim(),
        password: values.password.trim(),
        fullName: "", // Types require these, though ignored by login
        role: "couple",
      });
      // Navigation is handled by user state change or we can do it here if we want explicit redirect after success
      // But AuthContext doesn't return the user immediately on login sometimes if strictly event based?
      // Actually AuthContext listeners will update state.
      // But we generally want to redirect.
      // We can check role from the fetched profile?
      // For now, let's redirect to planner default, or logic based on email is removed.
      // Fetch user role for redirection
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        const role = profile?.role || 'couple';

        if (role === 'admin') {
          navigate("/admin");
        } else if (role === 'vendor' || role === 'planner' || role === 'venue') {
          navigate("/business");
        } else {
          navigate("/planner");
        }
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignUp(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      await signUp({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        location: values.location,
        role: values.role,
      });

      // Attempt immediate login/redirect if session is active
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (values.role === 'vendor' || values.role === 'planner' || values.role === 'venue') {
          navigate("/business");
        } else {
          navigate("/planner");
        }
      } else {
        // Fallback if email confirmation was required (though we disabled it)
        // or if session wasn't immediately available
        navigate("/auth?mode=signin");
      }
    } catch (error) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-champagne/20 blur-3xl animate-pulse delay-700" />
      </div>

      <div className="mb-8 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-8 h-8 text-rose-gold fill-rose-gold animate-pulse" />
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            2Plan<span className="text-primary">A</span>Wedding
          </h1>
        </div>
        <p className="text-muted-foreground">Your dream wedding starts here</p>
      </div>

      <Card className="w-full max-w-md border-rose-100 shadow-xl z-10 bg-white/80 backdrop-blur-sm">
        <Tabs defaultValue={defaultTab} className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="signin">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Enter your email to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-rose-gold hover:bg-rose-gold/90 text-white" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Jessica Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={signUpForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (City, State)</FormLabel>
                        <FormControl>
                          <Input placeholder="New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a...</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="couple" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Couple
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="vendor" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Vendor
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="planner" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Planner
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="venue" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Venue
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-champagne hover:bg-champagne/90 text-foreground" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground z-10">
        <Button variant="link" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </p>
    </div>
  );
};

export default Auth;
