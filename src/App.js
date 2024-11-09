import './App.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import React from 'react';

const BookList = React.memo(({ booksData, currentBook, onBookClick }) => (
  <div className='bookContainer'>
    {booksData.map((book) => (
      <button
        className={`bookBtn ${currentBook?.id === book.id ? 'selected' : ''}`}
        key={book.id}
        onClick={() => onBookClick(book)}
      >
        {book.title}
      </button>
    ))}
  </div>
));

const ChapterList = React.memo(({ chapters, currentChapter, onChapterClick }) => (
  <div className='chapterContainer'>
    {chapters.map((chapter, index) => (
      <button
        key={chapter}
        onClick={() => onChapterClick(chapter)}
        className={`chapterBtn ${currentChapter === chapter ? 'selected' : ''}`}
      >
        {index + 1}
      </button>
    ))}
  </div>
));

const ChapterDisplay = React.memo(({ chapterData, currentPageIndex, onNextPage, onPreviousPage }) => (
  <div className="chapter-container">
    <div className="image-container">
      {currentPageIndex > 0 && (
        <div className="nav-button left" onClick={onPreviousPage}>
          &#9664; {/* Left arrow */}
        </div>
      )}
      <img
        src={chapterData.pages[currentPageIndex].image.file}
        alt={`Page ${currentPageIndex + 1}`}
        className="chapter-image"
      />
      {currentPageIndex < chapterData.pages.length - 1 && (
        <div className="nav-button right" onClick={onNextPage}>
          &#9654; {/* Right arrow */}
        </div>
      )}
    </div>
  </div>
));

function App() {
  const [booksData, setBooksData] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch('http://52.195.171.228:8080/books/');
        const result = await response.json();
        setBooksData(result);

        // Set the first book and chapter as the current ones initially
        if (result.length > 0) {
          setCurrentBook(result[0]);
          if (result[0].chapter_ids.length > 0) {
            fetchChapterData(result[0].chapter_ids[0]);
            setCurrentChapter(result[0].chapter_ids[0]);
          }
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchdata();
  }, []);

  const fetchChapterData = useCallback(async (chapterId) => {
    try {
      const response = await fetch(`http://52.195.171.228:8080/chapters/${chapterId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setChapterData(result);
      setCurrentPageIndex(0); // Reset page index when new chapter is loaded
    } catch (error) {
      console.log('Error fetching chapter data:', error);
    }
  }, []);

  const handleBookClick = useCallback((book) => {
    setCurrentBook(book);
    setCurrentChapter(book.chapter_ids[0]); // Set the first chapter of the selected book
    fetchChapterData(book.chapter_ids[0]); // Fetch data for the first chapter
  }, [fetchChapterData]);

  const handleChapterClick = useCallback((chapterId) => {
    setCurrentChapter(chapterId);
    fetchChapterData(chapterId);
  }, [fetchChapterData]);

  const handleNextPage = useCallback(() => {
    if (chapterData && currentPageIndex < chapterData.pages.length - 1) {
      setCurrentPageIndex((prevIndex) => prevIndex + 1);
    }
  }, [chapterData, currentPageIndex]);

  const handlePreviousPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prevIndex) => prevIndex - 1);
    }
  }, [currentPageIndex]);
  console.log("");
  const currentChapters = useMemo(() => currentBook?.chapter_ids || [], [currentBook]);

  return (
    <div className='container'>
      {booksData ? (
        <>
          <BookList booksData={booksData} currentBook={currentBook} onBookClick={handleBookClick} />
          {currentBook && (
            <ChapterList
              chapters={currentChapters}
              currentChapter={currentChapter}
              onChapterClick={handleChapterClick}
            />
          )}
          {chapterData && (
            <ChapterDisplay
              chapterData={chapterData}
              currentPageIndex={currentPageIndex}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
            />
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
