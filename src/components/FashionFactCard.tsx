
import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface FashionFact {
  id: string;
  title: string;
  fact: string;
  category: string;
}

const FashionFactCard = () => {
  const [currentFact, setCurrentFact] = useState<FashionFact | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomFact = async () => {
    try {
      setIsLoading(true);
      
      // Get a random fact from the database
      const { data, error } = await supabase
        .from('fashion_facts')
        .select('*')
        .limit(1)
        .order('id', { ascending: false }); // This will be randomized by offset
      
      if (error) throw error;
      
      // Get total count first, then fetch random one
      const { count } = await supabase
        .from('fashion_facts')
        .select('*', { count: 'exact', head: true });
      
      if (count && count > 0) {
        const randomOffset = Math.floor(Math.random() * count);
        
        const { data: randomData, error: randomError } = await supabase
          .from('fashion_facts')
          .select('*')
          .range(randomOffset, randomOffset)
          .limit(1);
        
        if (randomError) throw randomError;
        
        if (randomData && randomData.length > 0) {
          setCurrentFact(randomData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching fashion fact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomFact();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Lightbulb className="h-5 w-5 text-purple-600 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-purple-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-purple-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentFact) return null;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-purple-900 text-sm">
                {currentFact.title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchRandomFact}
                className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-purple-700 leading-relaxed">
              {currentFact.fact}
            </p>
            <div className="mt-2">
              <span className="inline-block bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                {currentFact.category}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FashionFactCard;
