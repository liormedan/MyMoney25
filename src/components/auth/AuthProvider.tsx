import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/lib/store";
import { profileServices } from "@/lib/services";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Create profile if it doesn't exist
          let profile = await profileServices.get(user.uid);
          if (!profile) {
            profile = await profileServices.create({
              id: user.uid,
              email: user.email || "",
              name: user.displayName || "",
            });
          }
          setUser(profile);

          // Only navigate to dashboard if we're on login or root
          if (location.pathname === "/login" || location.pathname === "/") {
            navigate("/dashboard");
          }
        } else {
          setUser(null);
          if (!location.pathname.includes("/login")) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, setUser, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        טוען...
      </div>
    );
  }

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
