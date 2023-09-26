import React, { useState, useEffect } from 'react';
import HTMLFlipBook from "react-pageflip";

function FlipBook({ images, isFullScreen, isSinglePage }) {
    const [dimensions, setDimensions] = useState({
        width: 300,  // Fixed width when not in full screen
        height: 500  // Fixed height when not in full screen
    });

    useEffect(() => {
        if (isFullScreen) {
            const handleResize = () => {
                setDimensions({
                    width: isSinglePage ? window.innerWidth : window.innerWidth * 0.5,
                    height: window.innerHeight
                });
            };
            handleResize();

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [isFullScreen, isSinglePage]);

    return (
        <div className={"flex justify-center items-center h-screen"}>
            <HTMLFlipBook width={dimensions.width} height={dimensions.height}>
                {images.map((image, index) => (
                    <img
                        className=""
                        key={index}
                        src={image}
                        alt={`Page ${index + 1}`}
                        style={{ objectFit: 'cover', width: isSinglePage ? '100%' : '50%' }}
                    />
                ))}
            </HTMLFlipBook>
        </div>
    );
}

export default FlipBook;

// Example usage in a different component or page
// <FlipBook images={yourImageArray} isFullScreen={yourFullScreenState} isSinglePage={yourSinglePageState} />
