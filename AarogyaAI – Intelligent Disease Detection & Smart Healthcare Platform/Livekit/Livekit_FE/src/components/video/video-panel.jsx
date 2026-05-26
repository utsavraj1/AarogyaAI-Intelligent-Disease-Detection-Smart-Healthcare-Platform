import { cn } from "@/lib/utils";
import VideoTile from "./video-tile";

const VideoPanel = ({
  spotlit,
  thumbnails,
  all,
  handleTileClick,
  gridCols,
}) => {
  const VideoPane = (
    <>
      {spotlit ? (
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="relative min-h-0 flex-1">
            <VideoTile participant={spotlit} isLocal={spotlit.isLocal} isSpotlit onClick={() => handleTileClick(spotlit)} />
          </div>
          {thumbnails.length > 0 && (
            <div className="flex shrink-0 gap-2 sm:overflow-x-auto">
              {thumbnails.map((p) => (
                <div key={p.sid || p.identity} className="w-32 shrink-0 sm:w-36">
                  <VideoTile participant={p} isLocal={p.isLocal} isSpotlit={false} onClick={() => handleTileClick(p)} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={cn("grid min-h-0 flex-1 gap-2 overflow-y-auto", gridCols(all.length))}>
          {all.map((p) => (
            <div key={p.sid || p.identity} className="aspect-video min-h-0 min-w-0 overflow-hidden">
              <VideoTile
                participant={p}
                isLocal={p.isLocal}
                isSpotlit={false}
                onClick={() => handleTileClick(p)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return VideoPane;
}

export default VideoPanel