"use client";

import {
  Card,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  slug: string; // ✅ Accept slug directly
}

export function BlogCard({
  title,
  description,
  author,
  date,
  category,
  imageUrl,
  slug,
}: BlogCardProps) {
  return (
    <Card className="w-full h-full flex flex-col group hover:shadow-md transition-shadow">
      {/* Responsive Image Container */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 30vw"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs md:text-sm font-medium text-[#6941C6] mb-2">
          {category}
        </span>

        <div className="flex items-center justify-between gap-2">
          <Link href={`/blog/${slug}`} className="text-sm md:text-base font-semibold line-clamp-2">
            {title}
          </Link>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        <p className="text-xs mt-2 md:text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage
              src={`https://github.com/${author.toLowerCase().replace(/\s+/g, "")}.png`}
              alt={author}
            />
            <AvatarFallback>
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs md:text-sm font-medium">{author}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
