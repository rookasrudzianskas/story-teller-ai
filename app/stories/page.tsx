import React from 'react';
import {Story} from "@/types/stories";
import {getAllStories} from "@/lib/getAllStories";
import Link from "next/link";
import Image from "next/image";
import {BookOpen} from "lucide-react";

export const revalidate = 0;

const Stories = ({}) => {
  const stories: Story[] = getAllStories();

  return (
    <div className={'p-10 max-w-7xl mx-auto'}>
      {stories.length === 0 && <p>No stories found.</p>}
      <div className={'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'}>
        {stories.map((story, index) => (
          <Link key={index} className={'border rounded-lg cursor-pointer hover:shadow-lg hover:border-purple-500' +
            ' transition-all' +
            ' duration-300 ease-in-out'} href={`/stories/${story.story}`}>
            <div className={'relative'}>
              <p className={'absolute flex items-center top-0 right-0 bg-white text-purple-500 font-bold p-3' +
                ' rounded-lg m-2 text-sm'}>
                <BookOpen className={'w-4 h-4 mr-1'} />
                {story.pages.length === 1 ? `${story.pages.length} Page` : `${story.pages.length} Pages`}
              </p>
              <Image
                src={story.pages[0].png}
                alt={story.story}
                width={500}
                height={500}
                className={'w-full object-contain rounded-t-lg'}
              />
            </div>
            <h2 className={'text-lg p-5 first-letter:text-3xl font-light text-center'}>{story.story}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stories;
// by Rokas with ❤️
