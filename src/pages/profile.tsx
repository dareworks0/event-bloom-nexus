
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCode } from "@/components/ui/qr-code";
import { Layout } from "@/components/layout/layout";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParallaxBackground } from "@/components/gyro/ParallaxBackground";
import { Button } from "@/components/ui/button";
import { Edit, User, MapPin, Calendar, DollarSign, Activity, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login?redirect=/profile");
    } else if (user) {
      // Short timeout to allow transitions to complete
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate]);

  if (isLoading || pageLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  // Generate QR code that redirects to user's profile
  const qrCodeUrl = `https://www.eventfaqs.com/profile/${user.id}`;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ParallaxBackground className="text-center mb-8 p-6 rounded-xl bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/80 dark:to-gray-900/50 shadow-md animate-entrance">
          <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg hover-scale transition-all">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="text-2xl bg-primary text-white">
              {user.name?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <Badge variant="outline" className="mt-2 capitalize bg-primary/10 text-primary border-primary/20">
            <User className="w-3 h-3 mr-1" /> {user.role}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 animate-fade-in"
            onClick={() => navigate("/edit-profile")}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        </ParallaxBackground>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover-scale transition-all animate-fade-in shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {user.gender && (
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                    <p className="font-medium">{user.gender}</p>
                  </div>
                </div>
              )}
              
              {user.city && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">City</h3>
                    <p className="font-medium">{user.city}</p>
                  </div>
                </div>
              )}
              
              {user.age && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Age</h3>
                    <p className="font-medium">{user.age} years</p>
                  </div>
                </div>
              )}
              
              {user.budget && (
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                    <p className="font-medium">${user.budget}</p>
                  </div>
                </div>
              )}
              
              {user.interests && user.interests.length > 0 && (
                <div className="flex">
                  <Activity className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interests</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="hover-scale transition-all">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {!user.gender && !user.city && !user.age && !user.budget && (!user.interests || user.interests.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <p>No profile information available yet.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate("/edit-profile")}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Complete Your Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all animate-fade-in shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
              <CardTitle>Profile QR Code</CardTitle>
              <CardDescription>
                Scan this code to view more event information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <div className="p-4 bg-white rounded-lg shadow-inner">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
