import React from 'react';
import Link from "next/link";

const Header = ({}) => {
  return (
    <header className={'relative p-16 text-center'}>
      <Link prefetch={false} href={'/'}>
        <h1 className={'text-6xl font-black'}>Story Teller AI</h1>
        <div className={'flex space-x-5 text-3xl lg:text-5xl justify-center whitespace-nowrap'}>
          <h2>Bringing your stories to life</h2>
          <div className={'relative'}>
            <div className={'absolute bg-purple-500 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0' +
              ' md:-bottom-0 md:-right-3 -rotate-1 h-'} />
              <p className={'relative text-white'}>To life!</p>
          </div>
        </div>
      </Link>

      <div className={''}>

      </div>
    </header>
  );
};

export default Header;
// by Rokas with ❤️
