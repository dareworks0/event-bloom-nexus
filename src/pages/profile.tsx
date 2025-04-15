
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCode } from "@/components/ui/qr-code";
import { Layout } from "@/components/layout/layout";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login?redirect=/profile");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  // Generate QR code that redirects to eventfaqs.com
  const qrCodeUrl = "https://www.eventfaqs.com/";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="text-2xl bg-primary">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <Badge variant="outline" className="mt-2 capitalize">
            {user.role}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.gender && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p>{user.gender}</p>
                </div>
              )}
              {user.city && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">City</h3>
                  <p>{user.city}</p>
                </div>
              )}
              {user.age && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Age</h3>
                  <p>{user.age} years</p>
                </div>
              )}
              {user.budget && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                  <p>${user.budget}</p>
                </div>
              )}
              {user.interests && user.interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Interests</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile QR Code</CardTitle>
              <CardDescription>
                Scan this code to view more event information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <QRCode value={qrCodeUrl} size={200} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
