import { cn } from "@/lib/utils";
import VideoTile from "./video-tile";

const VideoPane = ({
  spotlit,
  thumbnails,
  all,
  handleTileClick,
  gridCols,
  isMobile,
}) => {
  // ── MOBILE spotlight mode ─────────────────────────────────────────────
  if (isMobile && spotlit) {
    return (
      <div className="flex flex-col gap-3">
        <div className="aspect-[4/3] w-full">
          <VideoTile
            participant={spotlit}
            isLocal={spotlit.isLocal}
            isSpotlit
            onClick={() => handleTileClick(spotlit)}
          />
        </div>

        {thumbnails.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {thumbnails.map((p) => (
              <div key={p.sid || p.identity} className="aspect-video w-full">
                <VideoTile
                  participant={p}
                  isLocal={p.isLocal}
                  isSpotlit={false}
                  onClick={() => handleTileClick(p)}
                  compact
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── MOBILE grid mode ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {all.map((p, i) => (
          <div
            key={p.sid || p.identity}
            className={cn(
              "aspect-video w-full",
              all.length === 1 && "col-span-2 aspect-[16/9]",
              all.length % 2 === 1 && i === 0 && "col-span-2 aspect-[16/9]"
            )}
          >
            <VideoTile
              participant={p}
              isLocal={p.isLocal}
              isSpotlit={false}
              onClick={() => handleTileClick(p)}
            />
          </div>
        ))}
      </div>
    );
  }

  // ── DESKTOP spotlight mode ────────────────────────────────────────────
  if (spotlit) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3">
        {/* Main spotlight tile */}
        <div className="min-h-0 flex-1">
          <div className="h-full w-full overflow-hidden rounded-2xl">
            <VideoTile
              participant={spotlit}
              isLocal={spotlit.isLocal}
              isSpotlit
              onClick={() => handleTileClick(spotlit)}
            />
          </div>
        </div>

        {/* Thumbnails row */}
        {thumbnails.length > 0 && (
          <div className="shrink-0 overflow-x-auto overflow-y-hidden pb-1">
            <div className="flex gap-3">
              {thumbnails.map((p) => (
                <div
                  key={p.sid || p.identity}
                  className="aspect-video w-[180px] shrink-0 lg:w-[200px] xl:w-[220px]"
                >
                  <VideoTile
                    participant={p}
                    isLocal={p.isLocal}
                    isSpotlit={false}
                    onClick={() => handleTileClick(p)}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── DESKTOP grid mode ─────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "grid flex-1 gap-2 overflow-y-auto content-start",
        gridCols(all.length)
      )}
    >
      {all.map((p) => (
        <div key={p.sid || p.identity} className="aspect-video w-full">
          <VideoTile
            participant={p}
            isLocal={p.isLocal}
            isSpotlit={false}
            onClick={() => handleTileClick(p)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoPane;