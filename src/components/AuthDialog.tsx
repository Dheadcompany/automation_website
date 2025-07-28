import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgotPassword">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, sendPasswordResetEmail } = useAuth();
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      onOpenChange(false);
      setEmail("");
      setPassword("");
    }

    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await sendPasswordResetEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setResetEmailSent(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setAuthMode("login");
        setEmail("");
        setPassword("");
        setError(null);
        setResetEmailSent(false);
      }, 300);
    }
  }, [open]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      onOpenChange(false);
      setEmail("");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center">VAS Testing Portal</DialogTitle>
          <DialogDescription className="text-center">
            Access your professional testing report dashboard
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={authMode === 'login' ? 'default' : 'outline'}
            onClick={() => setAuthMode('login')}
            className={authMode === 'login' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Login
          </Button>
          <Button
            variant={authMode === 'signup' ? 'default' : 'outline'}
            onClick={() => setAuthMode('signup')}
            className={authMode === 'signup' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Sign Up
          </Button>
        </div>

        {authMode === 'login' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your testing report account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setAuthMode('forgotPassword')}
                  className="p-0 h-auto text-green-600 hover:text-green-700"
                >
                  Forgot Password?
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {authMode === 'forgotPassword' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email to receive a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resetEmailSent ? (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700">Password reset email sent! Check your inbox.</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setAuthMode('login')}
                  className="p-0 h-auto text-green-600 hover:text-green-700"
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {authMode === 'signup' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Account</CardTitle>
              <CardDescription>
                Join the VAS testing report platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-sm text-gray-500 mt-4">
          Professional testing report platform for VDL Technologies
        </div>
      </DialogContent>
    </Dialog>
  );
};
