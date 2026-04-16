import { useEffect, useRef, useState } from 'react'
import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube'
import { progress } from '../../store/progress'

type Props = {
  lectureId: string
  videoId: string
  onWatched: (percent01: number) => void
}

export function YouTubeLockedPlayer({ lectureId, videoId, onWatched }: Props) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const lastAllowedRef = useRef<number>(0)
  const durationRef = useRef<number>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setInterval(async () => {
      const p = playerRef.current
      if (!p) return
      try {
        const duration = durationRef.current || (await p.getDuration())
        durationRef.current = duration
        if (!duration || duration <= 0) return
        const current = await p.getCurrentTime()

        // Block forward skipping beyond a small tolerance.
        if (current > lastAllowedRef.current + 2.25) {
          await p.seekTo(lastAllowedRef.current, true)
          return
        }

        // Only advance allowed time when player is actually progressing.
        if (current > lastAllowedRef.current) {
          lastAllowedRef.current = current
          const watched01 = Math.max(0, Math.min(1, current / duration))
          progress.setLectureWatch(lectureId, watched01)
          onWatched(watched01)
        }
      } catch {
        // ignore
      }
    }, 900)
    return () => window.clearInterval(id)
  }, [lectureId, onWatched])

  const initialWatch = progress.lectureWatchPercent(lectureId)
  const initialSeekSeconds = useRef<number | null>(null)
  if (initialSeekSeconds.current === null) {
    // allow resume watching up to what was previously reached
    initialSeekSeconds.current = Math.max(0, initialWatch * 60) // will be corrected after duration known
  }

  return (
    <div
      className="rounded-3xl overflow-hidden bg-black shadow-2xl relative border-4 border-white/10"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 pointer-events-none select-none" />
      <YouTube
        videoId={videoId}
        className="w-full aspect-video"
        iframeClassName="w-full h-full"
        opts={{
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            fs: 1,
            iv_load_policy: 3,
          },
        }}
        onReady={async (e: YouTubeEvent) => {
          playerRef.current = e.target
          setReady(true)
          try {
            const d = await e.target.getDuration()
            durationRef.current = d
            const watched01 = progress.lectureWatchPercent(lectureId)
            lastAllowedRef.current = watched01 * d
            if (watched01 > 0.01) {
              await e.target.seekTo(lastAllowedRef.current, true)
            }
          } catch {
            // ignore
          }
        }}
        onStateChange={async () => {
          const p = playerRef.current
          if (!p) return
          try {
            const t = await p.getCurrentTime()
            if (t < lastAllowedRef.current - 2) {
              // allow rewinding (helps review)
              return
            }
            if (t > lastAllowedRef.current + 2.25) {
              await p.seekTo(lastAllowedRef.current, true)
            }
          } catch {
            // ignore
          }
        }}
        onPlaybackRateChange={async () => {
          // hide speed control by forcing normal rate (best effort)
          const p = playerRef.current
          if (!p) return
          try {
            await p.setPlaybackRate(1)
          } catch {
            // ignore
          }
        }}
      />

      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center text-white/80">
          <span className="text-sm font-bold">Loading player…</span>
        </div>
      ) : null}
    </div>
  )
}

