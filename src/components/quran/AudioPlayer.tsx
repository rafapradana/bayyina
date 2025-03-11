import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useQuran, AVAILABLE_QARIS } from "@/context/QuranContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  src: { [key: string]: string } | string; // Support both legacy string and new object format
  title: string;
  onEnded?: () => void;
  className?: string;
}

const AudioPlayer = ({ src, title, onEnded, className }: AudioPlayerProps) => {
  const { selectedQari, setSelectedQari, getQariName } = useQuran();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Get current audio source based on selected qari
  const getAudioSource = (): string => {
    if (typeof src === 'string') {
      console.log('Using legacy audio format (string):', src);
      return src; // Legacy format support
    }
    
    const audioSrc = src[selectedQari] || Object.values(src)[0]; // Use selected qari or first available
    console.log(`Using audio for qari ${selectedQari}:`, audioSrc);
    return audioSrc;
  };

  // Lazy initialize audio only when play is pressed
  const initializeAudio = () => {
    if (audioLoaded) return true;
    
    try {
      setIsLoading(true);
      const audioSource = getAudioSource();
      console.log('Initializing audio with source:', audioSource);
      
      if (!audioSource) {
        console.error('No valid audio source found');
        toast({
          title: "Gagal memuat audio",
          description: "Tidak ada sumber audio yang valid ditemukan.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      const audio = new Audio(audioSource);
      audioRef.current = audio;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setProgress(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        if (onEnded) onEnded();
      };
      
      const handleError = () => {
        setIsLoading(false);
        toast({
          title: "Gagal memuat audio",
          description: "Terjadi kesalahan saat memuat audio. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      };
      
      // Set up event listeners
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);
      
      // Set initial volume
      audio.volume = volume;
      
      setAudioLoaded(true);
      return true;
    } catch (error) {
      console.error("Error initializing audio:", error);
      toast({
        title: "Gagal memuat audio",
        description: "Terjadi kesalahan saat memuat audio. Silakan coba lagi nanti.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Change audio source when qari changes
  useEffect(() => {
    if (!audioLoaded) return;
    
    // Clean up old audio
    if (audioRef.current) {
      const oldAudio = audioRef.current;
      oldAudio.pause();
      oldAudio.src = "";
      oldAudio.load();
    }
    
    // Reset state
    setIsPlaying(false);
    setProgress(0);
    setAudioLoaded(false);
    audioRef.current = null;
    
    // Show success toast when changing qari
    toast({
      title: "Qari diubah",
      description: `Murottal beralih ke ${getQariName(selectedQari)}`,
      variant: "default",
    });
  }, [selectedQari, getQariName, toast]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        audio.src = "";
        audio.load();
        
        // Clean up event listeners
        const events = ["canplay", "timeupdate", "ended", "error"];
        events.forEach(event => {
          audio.removeEventListener(event, () => {});
        });
      }
    };
  }, []);

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!audioLoaded && !initializeAudio()) return;
    
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    audioRef.current.volume = isMuted ? 0 : newVolume;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioRef.current.volume = newMuteState ? 0 : volume;
  };

  const handleQariChange = (qariId: string) => {
    setSelectedQari(qariId);
  };

  return (
    <div className={cn(
      "p-4 rounded-lg glass-card space-y-2",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium truncate max-w-[200px]">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-md text-xs flex items-center gap-1">
                {getQariName(selectedQari)}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AVAILABLE_QARIS.map((qari) => (
                <DropdownMenuItem 
                  key={qari.id}
                  className={cn(
                    qari.id === selectedQari && "bg-primary/10 font-medium"
                  )}
                  onClick={() => handleQariChange(qari.id)}
                >
                  {qari.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="w-full">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="my-2"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
        
        <div className="flex items-center justify-center">
          <Button
            disabled={isLoading}
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10 border-primary/30 bg-primary/10 hover:bg-primary/20",
              isPlaying && "bg-primary/20"
            )}
            onClick={togglePlay}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 text-primary" />
            ) : (
              <Play className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
        
        <div className="w-[72px]" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
};

export default AudioPlayer;
