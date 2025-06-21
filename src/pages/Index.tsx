
import { useState } from "react";
import { Plus, Settings, TrendingUp, Calendar, Sun, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddItemModal from "@/components/AddItemModal";

const Index = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* iOS-style Status Bar */}
      <div className="h-11 bg-white"></div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">StyleSpace</h1>
              <p className="text-base text-gray-600 font-medium">Your Personal Closet</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Settings className="h-5 w-5 text-gray-700" />
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 rounded-full h-12 w-12 p-0 shadow-lg"
              >
                <Plus className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Weather Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg rounded-2xl text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Today's Weather</h3>
                <p className="text-blue-100">Perfect for light layers</p>
                <div className="flex items-center mt-2">
                  <Sun className="h-5 w-5 mr-2" />
                  <span className="text-2xl font-bold">72°F</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Sunny</div>
                <div className="text-xs text-blue-200">San Francisco, CA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Outfits Created</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Days Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Recommendation */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Recommendation</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-500">Outfit Preview</span>
              </div>
              <h4 className="font-semibold text-gray-900">Smart Casual Look</h4>
              <p className="text-sm text-gray-600 mt-1">Perfect for today's weather and your calendar</p>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl">
              Try This Outfit
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Added new white button-down shirt</span>
                <span className="text-xs text-gray-400 ml-auto">2h ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Created "Office Meeting" outfit</span>
                <span className="text-xs text-gray-400 ml-auto">1d ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Favorited casual blazer</span>
                <span className="text-xs text-gray-400 ml-auto">2d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Modal */}
      <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Index;
