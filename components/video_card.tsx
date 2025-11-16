"use client";

interface VideoCardProps {
  src: string;
  videoRef: React.Ref<HTMLVideoElement>;
}

export default function VideoCard({ src, videoRef }: VideoCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[300px] h-[500px] rounded-xl overflow-hidden shadow-xl border-4 border-blue-300">
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
