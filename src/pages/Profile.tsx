
import { useState } from "react";
import { Settings, Camera, Heart, Share, Bell, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [sharing, setSharing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-black">Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
                >
                  <Camera className="h-4 w-4 text-white" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">Sarah Anderson</h2>
                <p className="text-gray-600">Fashion Enthusiast</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>127 Items</span>
                  <span>•</span>
                  <span>23 Outfits</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-gray-600">Wardrobe Items</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-gray-600">Saved Outfits</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Notifications</span>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Share className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Share Analytics</span>
                </div>
                <Switch checked={sharing} onCheckedChange={setSharing} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
              <Heart className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Favorite Items</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
              <Settings className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-gray-900">App Settings</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
              <HelpCircle className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Help & Support</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto text-red-600">
              <LogOut className="h-5 w-5 text-red-600 mr-3" />
              <span>Sign Out</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
