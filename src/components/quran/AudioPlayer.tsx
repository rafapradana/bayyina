
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title: string;
  onEnded?: () => void;
  className?: string;
}

const AudioPlayer = ({ src, title, onEnded, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = new Audio(src);
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
    
    // Clean up on unmount
    return () => {
      audio.pause();
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src, onEnded, toast]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
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

  const jumpBackward = () => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, audioRef.current.currentTime - 5);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const jumpForward = () => {
    if (!audioRef.current) return;
    
    const newTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div className={cn(
      "p-4 rounded-lg glass-card space-y-2",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium truncate max-w-[200px]">{title}</h3>
        <div className="text-xs text-muted-foreground">
          {formatTime(progress)} / {formatTime(duration)}
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
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={jumpBackward}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
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
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={jumpForward}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-[72px]" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
};

export default AudioPlayer;
