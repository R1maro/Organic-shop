"use client";

import { useState } from 'react';

export function SearchButton() {
    const [searchActive, setSearchActive] = useState<boolean>(false);

    return (
        <div className={`search-container  ${searchActive ? "search-active" : ""}`}>
      <span className="search" onClick={() => setSearchActive(!searchActive)}>
        <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 22 22"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
            <input type="text" className="search-input" placeholder="Search..." />
        </div>
    );
}