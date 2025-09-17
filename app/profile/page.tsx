"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CropSettings = {
  scale: number;
  position: { x: number; y: number };
};

type User = {
  name: string;
  email: string;
  profilePicture: string;
  cropSettings?: CropSettings | null;
  description?: string;
  isCreator?: boolean;
};

type Comment = {
  id: number;
  comic: string;
  chapter: string;
  comment: string;
  timestamp: string;
};

type Book = {
  id: number;
  title: string;
  type: string;
  chaptersRead: number;
  totalChapters: number | string;
  lastRead: string;
  cover: string;
};

type Work = {
  id: number;
  title: string;
  type: string;
  status: "Ongoing" | "Completed";
  chapters: number;
  totalChapters: number | string;
  lastUpdated: string;
  cover: string;
  description: string;
  views: number;
  likes: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [recentComments, setRecentComments] = useState<Comment[]>([
    {
      id: 1,
      comic: "The Great Wave",
      chapter: "Chapter 5",
      comment: "This chapter was absolutely amazing! The artwork is incredible.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      comic: "Ocean Tales",
      chapter: "Chapter 12",
      comment: "I love how the story is developing. Can't wait for the next chapter!",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      comic: "Wave Chronicles",
      chapter: "Chapter 3",
      comment: "The character development in this series is top-notch.",
      timestamp: "3 days ago",
    },
  ]);

  const [recentlyRead, setRecentlyRead] = useState<Book[]>([
    {
      id: 1,
      title: "The Great Wave",
      type: "Manga",
      chaptersRead: 15,
      totalChapters: 24,
      lastRead: "2 hours ago",
      cover: "/api/placeholder/120/160",
    },
    {
      id: 2,
      title: "Ocean Tales",
      type: "Manhua",
      chaptersRead: 8,
      totalChapters: 12,
      lastRead: "1 day ago",
      cover: "/api/placeholder/120/160",
    },
    {
      id: 3,
      title: "Wave Chronicles",
      type: "Manga",
      chaptersRead: 3,
      totalChapters: 18,
      lastRead: "3 days ago",
      cover: "/api/placeholder/120/160",
    },
    {
      id: 4,
      title: "Deep Blue Stories",
      type: "Hentai",
      chaptersRead: 6,
      totalChapters: 6,
      lastRead: "1 week ago",
      cover: "/api/placeholder/120/160",
    },
  ]);

  const [creatorWorks, setCreatorWorks] = useState<Work[]>([
    {
      id: 1,
      title: "Storm Rider",
      type: "Manga",
      status: "Ongoing",
      chapters: 12,
      totalChapters: "?",
      lastUpdated: "3 days ago",
      cover: "/api/placeholder/120/160",
      description: "A thrilling adventure about a young rider who controls the power of storms.",
      views: 15420,
      likes: 892,
    },
    {
      id: 2,
      title: "Crystal Dreams",
      type: "Manhua",
      status: "Completed",
      chapters: 8,
      totalChapters: 8,
      lastUpdated: "2 weeks ago",
      cover: "/api/placeholder/120/160",
      description: "A beautiful story about dreams, crystals, and the power of imagination.",
      views: 8930,
      likes: 456,
    },
    {
      id: 3,
      title: "Digital Hearts",
      type: "Webtoon",
      status: "Ongoing",
      chapters: 6,
      totalChapters: "?",
      lastUpdated: "1 week ago",
      cover: "/api/placeholder/120/160",
      description: "A romance story set in a digital world where hearts can be programmed.",
      views: 12300,
      likes: 678,
    },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData) as User;
      setUser(parsedUser);
      setDescription(parsedUser.description || "");

      // Demo only: mark this test user as creator
      if (parsedUser.name === "test" || parsedUser.email === "test@example.com") {
        setUser((prev) =>
          prev ? { ...prev, isCreator: true } : { ...parsedUser, isCreator: true }
        );
      }
    }
  }, []);

  const handleSaveDescription = () => {
    if (user) {
      const updatedUser: User = { ...user, description };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingDescription(false);

      window.dispatchEvent(
        new CustomEvent("userDataUpdated", {
          detail: updatedUser,
        })
      );
    }
  };

  // ... the rest of your JSX stays exactly the same
}