
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export const uploadFlatlayImage = async (
  base64Data: string,
  userId: string,
  outfitId: string,
  supabaseUrl: string,
  supabaseServiceKey: string
) => {
  console.log(`📤 [DEBUG] Starting flatlay image upload for outfit ${outfitId}`);
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Convert base64 to blob
    const base64WithoutPrefix = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const binaryString = atob(base64WithoutPrefix);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'image/png' });
    
    console.log(`🔧 [DEBUG] Converted base64 to blob, size: ${blob.size} bytes`);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${userId}/${outfitId}_${timestamp}.png`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('outfit-flatlays')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error(`❌ [DEBUG] Storage upload error:`, error);
      return null;
    }

    console.log(`✅ [DEBUG] Successfully uploaded to storage:`, data.path);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('outfit-flatlays')
      .getPublicUrl(filename);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`🔗 [DEBUG] Generated public URL:`, publicUrl);

    return publicUrl;

  } catch (error) {
    console.error(`❌ [DEBUG] Exception during image upload:`, error);
    return null;
  }
};
