import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(API_ROUTES.LOGOUT, {
        method: "POST",
      });

      if (response.ok) {
        // Redirect to the login page after successful logout
        navigate("/auth/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  useEffect(() => {
    handleLogout();
  }, [] );

  return (
    <div className=""></div>
  );
}
