import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className={'flex-1 grid grid-cols-1 lg:grid-cols-2'}>
        <div className={'bg-purple-500 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-10'}>
          <Image
            height={250}
            width={250}
            src={'https://static.vecteezy.com/system/resources/previews/011/148/863/original/cartoon-illustration-magic-hat-halloween-free-png.png'} alt={'image'}/>
          <Button className={'px-20 bg-purple-700 p-10 text-xl'} asChild>
            <Link href={'/stories'}>Explore Stories Library</Link>
          </Button>
        </div>

        <StoryWriter />
      </section>
    </main>
  );
}
