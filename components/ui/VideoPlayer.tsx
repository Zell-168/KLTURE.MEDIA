import React from 'react';

interface VideoPlayerProps {
  url?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, className = "" }) => {
  if (!url) return null;

  const cleanUrl = url.trim();
  let embedUrl: string | null = null;
  let isError = false;

  // Helper to extract YouTube ID
  const getYouTubeId = (link: string) => {
    // Matches:
    // youtube.com/watch?v=ID
    // youtu.be/ID
    // youtube.com/embed/ID
    // youtube.com/v/ID
    // youtube.com/shorts/ID
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  // 1. YouTube
  const ytId = getYouTubeId(cleanUrl);
  if (ytId) {
    // Rel=0 ensures related videos are from the same channel (as of 2018 behavior change) or hidden.
    // origin is important for some security contexts.
    embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&origin=${window.location.origin}`;
  }
  
  // 2. Facebook
  else if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
    // For Facebook, we use the plugins/video.php endpoint.
    // We encode the whole URL.
    const encoded = encodeURIComponent(cleanUrl);
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&t=0`;
  }
  
  // 3. Vimeo
  else if (cleanUrl.includes('vimeo.com')) {
      const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      if (vimeoMatch && vimeoMatch[1]) {
          embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
  }

  // 4. Google Drive
  else if (cleanUrl.includes('drive.google.com')) {
    embedUrl = cleanUrl.replace('/view', '/preview').replace('/sharing', '/preview');
  }

  // 5. Fallback logic
  else {
      // If the URL is explicitly an embed URL already, use it.
      if (cleanUrl.includes('/embed/') || cleanUrl.includes('player.')) {
          embedUrl = cleanUrl;
      } 
      // If it looks like a YouTube link but failed regex, flag error to avoid showing raw watch page in iframe
      else if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
          isError = true;
      }
      // Otherwise, try using it directly (e.g. mp4 link or other embeddable source)
      else {
          embedUrl = cleanUrl;
      }
  }

  if (isError) {
       return (
        <div className={`w-full pt-[56.25%] relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md group flex items-center justify-center ${className}`}>
             <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-medium">
                Invalid Video URL
             </div>
        </div>
      );
  }

  return (
    <div className={`relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-md group ${className}`}>
      {embedUrl ? (
        <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{ border: 0 }}
        ></iframe>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
            Video unavailable
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;