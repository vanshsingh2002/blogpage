"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowDown } from "lucide-react";
import React from "react";
import { blogs } from "@/lib/data/blogs";

const DESKTOP_POSTS_PER_PAGE = 9;
const MOBILE_POSTS_PER_PAGE = 3;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(MOBILE_POSTS_PER_PAGE);
  const [search, setSearch] = useState("");

  const filteredPosts = blogs.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const postsPerPage = isMobile ? visiblePosts : DESKTOP_POSTS_PER_PAGE;
  const totalPages = Math.ceil(filteredPosts.length / DESKTOP_POSTS_PER_PAGE);

  const currentPosts = isMobile
    ? filteredPosts.slice(0, visiblePosts)
    : filteredPosts.slice(
        (currentPage - 1) * DESKTOP_POSTS_PER_PAGE,
        currentPage * DESKTOP_POSTS_PER_PAGE
      );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + MOBILE_POSTS_PER_PAGE);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    visiblePages.push(1);

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!visiblePages.includes(i)) {
        visiblePages.push(i);
      }
    }

    if (totalPages > 1 && !visiblePages.includes(totalPages)) {
      visiblePages.push(totalPages);
    }

    return visiblePages.sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();
  const hasMorePosts = isMobile && visiblePosts < filteredPosts.length;

  return (
    <>
      <section className="bg-[#faf7ff] text-center py-12 px-4 md:py-16">
        <div className="max-w-3xl mx-auto">
          <span className="bg-[#f3ebff] text-[#6c3ea3] text-xs md:text-sm font-medium px-2 md:px-3 py-1 rounded-full">
            {isMobile ? "Pricing plans" : "Our blog"}
          </span>

          <h1 className="text-3xl md:text-5xl font-semibold text-[#43267e] mt-3 md:mt-4">
            Resources and insights
          </h1>

          <p className="text-[#8257c0] mt-4 md:mt-6 text-sm md:text-xl">
            The latest industry news, interviews, technologies, and resources.
          </p>

          <div className="mt-6 relative max-w-xs md:max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8257c0]"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </section>

      <main className="bg-[#faf7ff] py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px] justify-center mb-12">
            {currentPosts.map((post, index) => (
              <BlogCard
                key={index}
                title={post.title}
                description={post.description}
                author={post.author.name}
                date={post.date}
                category={post.category}
                imageUrl={post.imageUrl}
                slug={post.slug}
              />
            ))}
          </div>

          {!isMobile && (
            <Pagination>
              <PaginationContent>
                {visiblePages.map((page, index) => (
                  <React.Fragment key={page}>
                    {index > 0 && page - visiblePages[index - 1] > 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}
              </PaginationContent>
            </Pagination>
          )}

          {isMobile && hasMorePosts && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="px-6 py-3 w-full bg-[#ece5f6] text-[#8a43ed]"
              >
                <ArrowDown />
                Load More
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
