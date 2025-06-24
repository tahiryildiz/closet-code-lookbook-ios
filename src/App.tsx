
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Wardrobe from "@/pages/Wardrobe";
import Outfits from "@/pages/Outfits";
import SavedOutfits from "@/pages/SavedOutfits";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wardrobe"
                element={
                  <ProtectedRoute>
                    <Wardrobe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/outfits"
                element={
                  <ProtectedRoute>
                    <Outfits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-outfits"
                element={
                  <ProtectedRoute>
                    <SavedOutfits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
