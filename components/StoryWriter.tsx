'use client';

import React, {useState} from 'react';
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {TextDecoder} from "node:util";
import {ReadableStreamDefaultReader} from "node:stream/web";
import {Frame} from "@gptscript-ai/gptscript";

const storiesPath = 'public/stories'

const StoryWriter = ({}) => {
  const [story, setStory] = useState<string>('');
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState<string>("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState<string>('');
  const [events, setEvents] = useState<Frame[]>([]);

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const response = await fetch('/api/run-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story: story,
        pages: pages,
        path: storiesPath,
      }),
    })

    if(response.ok && response.body) {
      console.log("Streaming started");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      handleStream(reader, decoder);
    } else {
      setRunFinished(true);
      setRunStarted(false);
      console.error('Failed to run script');
    }
  }

  async function handleStream (reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) {
    // manage the stream from the api
    while(true) {
      const { done, value } = await reader.read();
      if(done) break; // breaks out of the loop if the stream is done

      const chunk = decoder.decode(value, { stream: true });
      // We split chunk into events by event
      const eventData = chunk.split('\n\n').filter((line) => line.startsWith("event: ")).map((line) => line.replace(/^event: /, ""));
      eventData.forEach((data) => {
        try {
          const parsedData = JSON.parse(data);

          if(parsedData.type === 'callProgress') {
            setProgress(
              parsedData.output[parsedData.output.length - 1].content
            );
            setCurrentTool(parsedData.tool?.description || "");
          } else if (parsedData === "callStart") {
            setCurrentTool(parsedData.tool?.description || "");
          } else if (parsedData.type === "runFinish") {
            setRunFinished(true);

            setRunStarted(false);
          } else {
            setEvents((prevEvents) => [...prevEvents, parsedData]);
          }
        } catch(error) {
          console.error("Failed to parse jsn", error);
        }
      })
    }
  }

  return (
    <div className={'flex flex-col container'}>
      <section className={'flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2'}>
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className={'flex-1 text-black'}
          placeholder={'Write a story about a robot and a human becoming friends....'}
        />

        <Select
          onValueChange={(value) => setPages(parseInt(value))}
        >
          <SelectTrigger >
            <SelectValue placeholder={'How many pages the story should be?'} />
          </SelectTrigger>
          <SelectContent className={'w-full'}>
            {Array.from({length: 10}, (_, i) => (
              <SelectItem key={i} value={`${i + 1}`}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className={'w-full'}
          disabled={!story || !pages || runStarted}
          onClick={runScript}
          size={'lg'}
        >
            Generate Story
        </Button>
      </section>

      <section className={'flex-1 pb-5 mt-5'}>
        <div className={'flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono' +
          ' p-10 h-96 overflow-y-scroll'}>
            <div>
              {runFinished === null && (
                <>
                  <p className={'animate-pulse mr-5'}>Im waiting for you to Generate story above...</p>
                  <br />
                </>
              )}
              <span className={'mr-5'}>
                {">>"}
              </span>
              {progress}
            </div>

        {/*  current tool */}
          {currentTool && (
            <div className={'py-10'}>
              <span className={'mr-5'}>{"--- [Current Tool] ---"}</span>
            </div>
          )}

        {/*  Render Events  */}

        {runStarted && (
          <div>
            <span className={'mr-5 animate-in'}>
              {"--- [AI Storyteller Has Started] ---"}
            </span>
            <br />
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export default StoryWriter;
// by Rokas with ❤️
