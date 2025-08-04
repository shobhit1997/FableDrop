import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("fabledrop_user");
    const savedToken = localStorage.getItem("fabledrop_access_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("fabledrop_user");
        localStorage.removeItem("fabledrop_access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (accessToken: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get user info using the access token
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      let userData;
      if (!response.ok) {
        // If API call fails, try to get user info from stored data
        const storedPayload = localStorage.getItem("fabledrop_jwt_payload");
        if (storedPayload) {
          userData = JSON.parse(storedPayload);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } else {
        userData = await response.json();
      }

      // Check if user email is authorized
      const authorizedEmails =
        process.env.REACT_APP_AUTHORIZED_EMAILS?.split(",").map((email) =>
          email.trim()
        ) || [];
      if (
        authorizedEmails.length > 0 &&
        !authorizedEmails.includes(userData.email)
      ) {
        throw new Error(
          `Access denied. Email ${userData.email} is not authorized to use this application.`
        );
      }

      const newUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        googleId: userData.id,
      };

      setUser(newUser);
      setAccessToken(accessToken);
      localStorage.setItem("fabledrop_user", JSON.stringify(newUser));
      localStorage.setItem("fabledrop_access_token", accessToken);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("fabledrop_user");
    localStorage.removeItem("fabledrop_access_token");
    localStorage.clear();
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    error,
    accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
