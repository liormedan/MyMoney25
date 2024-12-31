import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const navigate = useNavigate();
  const signUpWithEmail = useAuthStore((state) => state.signUpWithEmail);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signUpWithEmail(email, password, name);
      navigate("/login");
    } catch (error) {
      setError("שגיאה בהרשמה. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      dir="rtl"
    >
      <Card className="w-full max-w-md p-8 space-y-6 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">הרשמה</h1>
          <p className="text-sm text-gray-600 mt-2">
            צור חשבון חדש במערכת ניהול התקציב
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם מלא</Label>
            <Input
              id="name"
              placeholder="הזן את שמך המלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              placeholder="הזן את האימייל שלך"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              type="password"
              placeholder="הזן סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "נרשם..." : "הרשמה"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-gray-600"
            onClick={() => navigate("/login")}
          >
            יש לך כבר חשבון? התחבר כאן
          </Button>
        </div>
      </Card>
    </div>
  );
}
