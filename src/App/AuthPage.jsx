import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter} from '../components/ui/card';
import { doSignInWithEmailAndPassword } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

export default function AuthPage() {
  const { userLoggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [redirect, setRedirect] = useState(false); // <-- Ensure this is defined here

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin 
      ? `${import.meta.env.VITE_API_URL}/api/auth/login` 
      : `${import.meta.env.VITE_API_URL}/api/auth/register`;
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      if (isLogin) {
        // Handle login
        if (data.token) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("token", data.token);
          setRedirect(true);
        } else {
          alert("Invalid credentials");
        }
      } else {
        // Handle signup: Show success and redirect to login
        if (data.success) {
          alert("Account created successfully. Please log in.");
          setIsLogin(true); // Switch to login view
        } else {
          alert(data.message || "Signup failed");
        }
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} failed:`, error);
    }
  };
  

  // Redirect if login/signup is successful
  if (redirect) {
    return <Navigate to="/dashboard" />; // Redirect to the dashboard page
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
