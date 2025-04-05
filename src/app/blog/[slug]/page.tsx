"use client";

import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { blogs } from "@/app/api/route";
import { useState } from "react";

export default function BlogDetail({ params }: any) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return notFound();

  const articleList = blog.content.find(
    (item): item is { list: string[] } =>
      typeof item === "object" && item !== null && "list" in item
  )?.list;
  const sections = blog.content.find(
    (
      item
    ): item is { sections: { id: string; title: string; body: string }[] } =>
      typeof item === "object" && item !== null && "sections" in item
  )?.sections;

  const [comments, setComments] = useState(blog.comment ? [blog.comment] : []);
  const [showForm, setShowForm] = useState(false);
  const [commentTitle, setCommentTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const handleAddComment = () => {
    if (!author.trim() || !text.trim() || !commentTitle.trim()) return;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dateObj = new Date();
    const formattedDate = `${dateObj.getDate()} ${
      months[dateObj.getMonth()]
    } ${dateObj.getFullYear()}`;

    const newComment = {
      title: commentTitle,
      text,
      author,
      authorImage: `https://github.com/${author.toLowerCase().replace(/\s+/g, "")}.png`,
      date: formattedDate,
    };

    setComments((prev) => [...prev, newComment]);
    setAuthor("");
    setText("");
    setCommentTitle("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f5ff] flex flex-col">
      <div className="flex-grow max-w-3xl mx-auto px-4 py-10 text-[#1a1a1a]">
        {/* Category */}
        <span className="text-xs font-medium text-[#6941C6] px-2 py-1 bg-[#f3ebff] rounded-full">
          {blog.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mt-4">{blog.title}</h1>
        <p className="text-sm text-[#6b6b6b] mt-2">
          {blog.date} · {blog.timeToRead}
        </p>

        {/* Image */}
        <div className="mt-6">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            width={100}
            height={50}
            className="rounded-md shadow-sm w-full h-[300px] md:h-[400px] object-cover"
          />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-4">
          <Image
            src={blog.author.image}
            alt="Author"
            width={32}
            height={32}
            className="rounded-full"
          />
          <p className="text-sm font-medium">{blog.author.name}</p>
        </div>

        {/* Article Content */}
        <div className="space-y-4 mt-6 leading-7 text-base">
          {blog.content
            .filter((item) => typeof item === "string")
            .map((para, index) => (
              <p key={index}>{para}</p>
            ))}

          {/* In this article */}
          {articleList && articleList.length > 0 && (
            <div className="bg-white border border-[#e1dbee] rounded-lg p-4">
              <p className="font-semibold text-2xl mb-2">In this article</p>
              <ul className="list-decimal list-inside pl-4 space-y-1">
                {articleList.map((item, i) => (
                  <li key={i}>
                    <a href={`#section-${i + 1}`} className="hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          {sections &&
            sections.length > 0 &&
            sections.map((section) => (
              <section id={section.id} className="mt-10" key={section.id}>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="mt-2">{section.body}</p>
              </section>
            ))}
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
              Comments
            </h2>

            {comments.map((comment, idx) => (
              <div
                key={idx}
                className="border-t border-b border-[#e1dbee] bg-white px-10 py-6 mb-6"
              >
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                  {comment.title}
                </h3>
                <p className="text-[#4a4a4a] mb-4">{comment.text}</p>

                <div className="mt-auto flex justify-end gap-2">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src={comment.authorImage} />
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs md:text-sm font-medium">
                      {comment.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {!showForm && (
              <div className="flex justify-end mt-6">
                <Button
                  variant="ghost"
                  className="text-[#6941C6] bg-white cursor-pointer"
                  onClick={() => setShowForm(true)}
                >
                  <ArrowDown className="h-4 w-4 mr-1" />
                  Add Comment
                </Button>
              </div>
            )}

            {showForm && (
              <div className="mt-6 bg-white border border-[#e1dbee] p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-[#1a1a1a]">
                  Add a Comment
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a4a4a] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Give your comment a title"
                      value={commentTitle}
                      onChange={(e) => setCommentTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d2bfff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a4a4a] mb-1">
                      Comment
                    </label>
                    <textarea
                      placeholder="Write your comment here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#d2bfff]"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a4a4a] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. George Costanza"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d2bfff]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddComment}
                    className="bg-[#6941C6] text-white hover:bg-[#5a35a4] cursor-pointer"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keep Reading Section */}
        {blog.keepReading?.length > 0 && (
          <div className="mt-20 space-y-10">
            <h2 className="text-2xl font-semibold text-[#1a1a1a]">
              Keep reading
            </h2>
            {blog.keepReading.map((item, i) => (
              <div className="flex gap-4" key={i}>
                <div className="relative w-[120px] h-[90px] md:w-[160px] md:h-[120px] flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="rounded-md object-cover"
                    sizes="(max-width: 768px) 120px, 160px"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm text-[#6b6b6b] mt-1">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Author Card */}
        <div className="mt-5 bg-white border border-[#e1dbee] p-6 rounded-md flex items-center gap-6">
          <Image
            src={blog.author.image}
            alt={blog.author.name}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg text-[#1a1a1a]">
              Written by {blog.author.name}
            </h3>
            <p className="text-sm text-[#4a4a4a] mt-1">{blog.author.bio}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e1dbee] py-10 mt-16 text-center text-sm text-[#6b6b6b]">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
        <p className="font-semibold">Copyright © 2025. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
