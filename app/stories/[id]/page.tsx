// @ts-nocheck
import React from 'react';
import {getAllStories, getStory} from "@/lib/getAllStories";
import {notFound} from "next/navigation";
import Story from "@/components/Story";

interface StoryPageProps {
  params: {
    id: string;
  }
}

const StoryPage = ({ params: { id }}: StoryPageProps) => {
  const decodedId = decodeURIComponent(id);
  const story = getStory(decodedId);

  if(!story) {
    return notFound();
  }

  return <Story story={story} />
};

export default StoryPage;
// by Rokas with ❤️

export async function getStaticParams() {
  const stories = getAllStories();

  const paths = stories.map((story) => ({
    id: story.story
  }));

  return paths;
}
