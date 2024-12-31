import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("שגיאה בהתחברות. אנא בדוק את פרטי ההתחברות שלך.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError("שגיאה בהתחברות עם Google");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="w-full py-6 bg-white border-b">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary">MyMoney</h1>
          <p className="text-sm text-muted-foreground mt-1">ניהול תקציב חכם</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold">התחברות</h2>
            <p className="text-sm text-gray-600 mt-2">
              ברוכים הבאים למערכת ניהול התקציב
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            התחבר עם Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                או המשך עם אימייל
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="הזן את הסיסמה שלך"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "מתחבר..." : "התחבר"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-gray-600"
              onClick={() => navigate("/register")}
            >
              אין לך חשבון? הירשם כאן
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t">
        <div className="max-w-md mx-auto text-center text-sm text-muted-foreground">
          <p className="mb-2">
            השימוש במערכת כפוף ל
            <Button variant="link" className="px-1 h-auto">
              תנאי השימוש
            </Button>
            ול
            <Button variant="link" className="px-1 h-auto">
              מדיניות הפרטיות
            </Button>
          </p>
          <p>© {new Date().getFullYear()} MyMoney. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}
