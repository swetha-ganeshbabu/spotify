"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Badge from "./ui/Badge";
import { Song, Mood } from "@/lib/types";
import { formatDuration, formatDate } from "@/lib/utils";

interface SongHeaderProps {
  song: Song;
  mood: Mood;
}

export default function SongHeader({ song, mood }: SongHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="shrink-0"
      >
        <Image
          src={song.album_art}
          alt={`${song.title} album art`}
          width={240}
          height={240}
          className="rounded-lg shadow-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/240x240/282828/B3B3B3?text=No+Art";
          }}
          priority
        />
      </motion.div>

      <div className="flex flex-col gap-2 text-center md:text-left">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm uppercase tracking-wider text-spotify-light"
        >
          Song Analysis
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold"
        >
          {song.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-spotify-light"
        >
          {song.artist}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-2 justify-center md:justify-start text-sm text-spotify-light"
        >
          <span>{song.album}</span>
          <span className="text-white/30">|</span>
          <span>{formatDate(song.release_date)}</span>
          <span className="text-white/30">|</span>
          <span>{formatDuration(song.duration_ms)}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start"
        >
          <Badge className="bg-white/20 text-white">{mood.primary}</Badge>
          <Badge>{mood.secondary}</Badge>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-spotify-light/70 mt-1 max-w-lg"
        >
          {mood.mood_description}
        </motion.p>
      </div>
    </div>
  );
}
