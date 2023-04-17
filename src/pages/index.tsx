import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  title: string;
  artist: string;
  album: string;
  icon: string;
  status: string;
  url: string;
  current: string;
  duration: string;
  image: string;
}

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await axios.get<Track>("https://np.ressonix.dev/current");
        setCurrentTrack(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTrack) {
    return <div>Loading...</div>;
  }

  const { title, artist, current, duration, image } = currentTrack;

  const progress = (parseInt(current.split(":")[0], 10) * 60 + parseInt(current.split(":")[1], 10)) / (parseInt(duration.split(":")[0], 10) * 60 + parseInt(duration.split(":")[1], 10)) * 100;

  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <div className="w-1/2">
        <div className="relative">
          <img src={image} className="w-full" alt={title} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-900 bg-opacity-75 text-white">
            <div className="font-bold text-lg">{title}</div>
            <div className="text-sm">{artist}</div>
          </div>
        </div>
        <div className="relative mt-4 h-4 rounded-full overflow-hidden bg-gray-500">
          <div className="absolute inset-0 bg-blue-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white">
          <div>{current}</div>
          <div>{duration}</div>
        </div>
      </div>
    </div>
  );
}
