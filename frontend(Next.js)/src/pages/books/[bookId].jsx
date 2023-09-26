import { useRouter } from 'next/router';
import {useEffect, useRef, useState} from 'react';
import api from '@/axiosHandler';
import Modal from 'react-modal';
import PDFReader from "@/components/PDFReader";
import NavBar from "@/components/NavBar";
import React from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';



import {
    FaStar,
    FaStickyNote,
    FaRegComment,
    FaPenAlt,
    FaPencilAlt,
    FaCommentAlt,
    FaRegStar,
    FaWindowClose, FaUserAlt
} from 'react-icons/fa';
import {FaExpand, FaHeading, FaHeart, FaX, FaXing} from "react-icons/fa6";
import FlipBook from "@/components/FlipBook";
import HTMLFlipBook from "react-pageflip";
import {Page} from "react-pdf";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "@/components/Footer";


function BookDetail() {
    const router = useRouter();
    const { bookId } = router.query;
    const [height, setHeight] = useState(700);  // Initial height value
    const [width, setWidth] = useState(500);    // Initial width value

    const [book, setBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showMore, setShowMore] = useState(false); // For the 'read more' functionality
    const filledStars = Math.floor(book?.average_rating || 0);
    const halfStar = book?.average_rating % 1 !== 0;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);
    const [showNotes, setShowNotes] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [bookNote, setBookNote] = useState('');
    const [bookReview, setBookReview] = useState('');


    const [isFullScreen, setIsFullScreen] = useState(false);

    const [bookPages, setBookPages] = useState([]);
    const lastFetchedPageRef = useRef(0);
    const [bookRating, setBookRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFavourtie, setisFavourite] = useState(false);
    const [isEndOfBook, setIsEndOfBook] = useState(false);
    const [reviewAdded, setReviewAdded] = useState(false);
    const [notesAdded, setNotesAdded] = useState(false);

    const [pagesFetched, setPagesFetched] = useState(false);


    const [isTwoPage, setIsTwoPage] = useState(false);

    useEffect(() => {
        // Handle window resize events
        const handleResize = () => {
            setIsTwoPage(window.innerWidth > 820);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            // Cleanup the event listener when the component unmounts
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    useEffect(() => {
        const updateDimensions = () => {
            if (isFullScreen) {
                setHeight(window.innerHeight*0.85);
                setWidth(window.innerWidth*0.4);
                console.log(window.innerWidth,window.innerHeight);
            } else {
                setHeight(500); // default height
                setWidth(300);  // default width
            }
        };

        // Call immediately to set initial values
        updateDimensions();

        // Optional: Update dimensions upon window resize
        const handleResize = () => {
            updateDimensions();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            // Cleanup event listener on component unmount
            window.removeEventListener('resize', handleResize);
        };
    }, [isFullScreen]);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        // Don't scroll if it's the first load


        // Scroll to the last loaded image after fetching new pages
        const lastImage = document.getElementById('last-loaded-image');
           lastImage?.scrollIntoView({ behavior: 'auto' });

    }, [bookPages]);

    useEffect(() => {
        if (bookId) {
            api.get(`/books/${bookId}/`).then(response => {
                setBook(response.data);
                setBookNote(response.data.user_note);
                fetchPages(currentPage);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [bookId]);

    const handleNotesClick = () => {

        setShowNotes(!showNotes);
    };
    const handleReviewClick = () => {

        setShowReview(!showReview);

    };
    const handleSaveNote = () => {
        if (bookId) {
            api.post(`/book-notes/${bookId}/`, {
                user: localStorage.getItem("user_id"),  // Replace this with the current logged-in user's ID
                text: bookNote
            }).then(response => {
                setNotesAdded(true);
                console.log('Note saved successfully!', response.data);
            }).catch(error => {
                console.error('Failed to save note:', error);
            });
        }
    };

    const handleReview = () => {
        if (bookId) {
            api.post(`/book-review/${bookId}/`, {
                user: localStorage.getItem("user_id"),  // Replace this with the current logged-in user's ID
                comment: bookReview,
                rating: bookRating
            }).then(response => {
                setReviewAdded(true);
                console.log('Note saved successfully!', response.data);
                // if (typeof window !== 'undefined') {
                //     window.location.reload();
                // }
            }).catch(error => {
                console.error('Failed to save note:', error);
            });
        }
    };

    const handleStarClick = (star) => {
        setBookRating(star);
    };

    const handleFavoriteClick = async () => {
        try {
            const response = await api.post(`/books/${book.id}/toggle_favorite/`);
            console.log(response.data.status);
            setisFavourite(true);
            // You can also update the book's state here to reflect the changes immediately.
        } catch (error) {
            console.error("An error occurred while toggling favorite status:", error);
        }
    };

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const startPage = lastFetchedPageRef.current + 1;
            const response = await api.get(`/book-pages/${bookId}/`, { params: { current_page: startPage } });
            const data = response.data;

            setBookPages(prevBookPages => [...prevBookPages, ...data.page_images]);

            if (data.page_images.length < 10) {
                setIsEndOfBook(true);
            }

            lastFetchedPageRef.current += data.page_images.length; // Update last fetched page ref
        } catch (error) {
            console.error("Failed to fetch book pages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [ref, inView] = useInView({
        threshold: 0,
    });


    const [delay, setDelay] = useState(0);  // Initial delay is 0 milliseconds

    useEffect(() => {
        if (inView && !pagesFetched) {
            console.log("Fetching pages...");
            // Introducing a delay using setTimeout
            setTimeout(() => {
                fetchPages();
                setPagesFetched(true);
            }, delay);

            // If you want to increase the delay for subsequent calls, you can update the delay
            setDelay(5000);  // For example, increase delay to 5 seconds
        }
    }, [inView, pagesFetched, delay]);


    if (!book) return <div>Loading...</div>;







    const handlePageChange = (e) => {
        const newCurrentPage = e.data;  // Assuming the event provides the current page number
        setCurrentPage(newCurrentPage);
        console.log("Current Page:", newCurrentPage);

        if (!isEndOfBook && newCurrentPage >= bookPages.length - 2) {
            console.log("Fetching more pages...");
            fetchPages(newCurrentPage + 3);  // adjusted to fetch from page 11 if the current page is 9
        }
    };

    // function ShowBook({ images, width, height }) {
    //     return (
    //
    //     );
    // }


    const ShowBook = React.memo(({ images, width, height }) => (
        <HTMLFlipBook
            key={images.length}
            autoSize={true}
            showPageCorners={true}
            size="fixed"
            width={width}
            height={height}
            onFlip={handlePageChange}
            startPage={currentPage}
            className="shadow-2xl my-auto mx-auto w-full"
        >
            {images.map((image, index) => (
                <img className="w-1/2" key={index} src={image} alt={`Page ${index + 1}`} style={{ objectFit: 'cover' }} />
            ))}
        </HTMLFlipBook>
    ));
    ShowBook.displayName = 'ShowBook';

    return (
        <div className={"bg-gold text-black"}>
        <div className={" min-h-screen w-full text-slate-700 px-8 "}>
            <NavBar/>
            {showModal && (
                <div className={`h-screen ${isFullScreen ? "bg-black" : "bg-black/80"} backdrop-blur fixed inset-0 w-full z-50 flex flex-col`}>
                    <button className={"absolute top-4 right-2 p-2 px-2 py-2 bg-gold rounded-full z-50"} onClick={()=>setShowModal(false)}><FaX/></button>
                    <button className={"lg:hidden absolute top-14 right-2 p-2 px-2 py-2 bg-gold rounded-full z-50"} onClick={() => setIsFullScreen(!isFullScreen)}><FaExpand/></button>

                    {isLoading ? (
                        <div className="flex-1 h-screen flex justify-center items-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <div className="flex-1 flex justify-center items-center overflow-y-hidden relative h-full w-full mx-auto my-auto ">
                            <div className={`w-full flex justify-center items-center relative  ${isFullScreen ? "h-screen w-full" : "w-4/5 mx-auto"}`} >
                                <div className={"w-full "}>
                                    {isTwoPage ? (
                                        <>
                                            {/* Other components and notifications for the two-page view. */}
                                            <ShowBook images={bookPages} width={width} height={height} />
                                            {/*{isEndOfBook && <div className="notification">You have reached the end of the book!</div>}*/}
                                        </>
                                    ) : (

                                        <div className="h-[90vh] overflow-y-scroll">
                                            {bookPages.map((page, index) => (
                                                <img
                                                    key={page}
                                                    src={page}
                                                    alt={`Page ${index + 1}`}
                                                    id={index === bookPages.length - 1 ? 'last-loaded-image' : ''} // Add id only to the last image
                                                    className={`mx-auto object-contain ${isFullScreen ? "w-11/12" : "w-1/3"} mt-4`}
                                                />
                                            ))}
                                            <div className={"flex justify-center"}>
                                            <button onClick={fetchPages} className="mt-4 p-2 bg-blue-500 text-white rounded ">Load More</button>
                                            </div>
                                        </div>


                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="hidden lg:flex justify-center space-x-4 p-4 bg-darkergold">
                        <button className={"p-2 px-3 py-2 bg-gold shadow-2xl rounded-full"} onClick={() => setIsFullScreen(!isFullScreen)}>{isFullScreen ? "Exit Full Screen" : "Go Full Screen"}</button>
                        <button className={"p-2 px-3 py-2 bg-gold shadow-2xl rounded-full hidden lg:block"} onClick={()=>setIsTwoPage(true)}>2 Page View</button>
                        <button className={"p-2 px-3 py-2 bg-gold shadow-2xl rounded-full hidden lg:block"} onClick={()=>setIsTwoPage(false)}>1 Page View</button>
                    </div>
                </div>
            )}



            <div className="flex flex-col lg:flex-row bg-white/50 h-full p-2">
                <div className="flex-shrink-0 p-2 flex flex-col items-center border border-slate-400 rounded w-full lg:w-[300px]">
                    <img src={book.cover_image} alt={book.title} className={"w-[200px] h-[300px] object-cover hover:scale-95 transition-all duration-200 shadow-2xl"}/>
                    <button className=" hover:bg-blue-700 mt-4 bg-blue-950 w-full text-white py-2 px-4 rounded" onClick={()=>{setShowModal(true)}}>Read Now</button>
                   <div className={"flex items-center justify-center space-x-4 w-full"}>
                    <button className={`hover:text-blue-800 mt-4 flex flex-col items-center space-y-2 border rounded border-slate-500 p-1 w-1/2 ${isFavourtie?"bg-red-500":""}`} onClick={handleFavoriteClick}><FaHeart /> Favourite</button>
                    <button className="hover:text-blue-800 mt-4 flex flex-col items-center space-y-2 border rounded border-slate-500 p-1 w-1/2" onClick={handleReviewClick}><FaCommentAlt /> Review</button>
                   </div>
                    {showReview && (
                        <div className="mt-4 flex flex-col w-full">
                            <textarea
                                value={bookReview}
                                onChange={(e) => setBookReview(e.target.value)}
                                placeholder="Add your Review for this book..."
                                className={"min-h-[100px] h-fit"}
                            />
                            <div className="flex justify-center py-4 ">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => handleStarClick(star)}
                                    >
            {star <= bookRating ? (
                <FaStar className="text-amber-400 cursor-pointer" />
            ) : (
                <FaRegStar className="text-amber-400 cursor-pointer" />
            )}
        </span>
                                ))}
                            </div>
                            <button className="hover:text-blue-800 mt-2 bg-blue-950 w-full text-white py-2 px-4 rounded" onClick={handleReview}>{reviewAdded?"Review Added":"Save Review"}</button>

                        </div>
                    )}
                    <button className="hover:text-blue-800 mt-4 flex flex-col items-center space-y-2 border rounded border-slate-500 p-1 w-full" onClick={handleNotesClick}><FaPencilAlt /> Notes</button>
                    {showNotes && (
                        <div className="mt-4 flex flex-col w-full">
                            <textarea
                                value={bookNote}
                                onChange={(e) => setBookNote(e.target.value)}
                                placeholder="Add your note for this book..."
                                className={"min-h-[100px] h-fit"}
                            />
                            <button className="hover:bg-blue-700 mt-2 bg-blue-950 w-full text-white py-2 px-4 rounded" onClick={handleSaveNote}>{notesAdded?"Saved":"Save Note"}</button>

                        </div>
                    )}
                </div>

                <div className=" lg:pl-8 flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold">Title: {book.title}</h1>
                    <p className="text-xl">by: <span className={"font-bold"}>{book.author}</span></p>
                    <div className={"flex"}>
                        {[...Array(filledStars)].map((_, i) => <FaStar key={i} className="text-amber-400" />)}
                        {halfStar && <span style={{ position: 'relative' }}>
            <FaRegStar className="text-amber-400" />
        </span>}
                        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={i + filledStars} className="text-gray-400" />)}
                    </div>
                    <p className={` text-md  `} >Description: {book.description}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className={"p-4 border rounded flex flex-col items-center border-slate-400"}><strong>Publish Date:</strong> {book.published_year}</div>
                        <div className={"p-4 border rounded flex flex-col items-center border-slate-400"}><strong>Publisher:</strong> {book.publisher}</div>
                        <div className={"p-4 border rounded flex flex-col items-center border-slate-400"}> <strong>Language:</strong> {book.language_title}</div>
                        <div className={"p-4 border rounded flex flex-col items-center border-slate-400"}><strong>Category:</strong> {book.category_name}</div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2"><FaRegComment /><span> Reviews</span></h2>
                        {book.reviews && book.reviews.map(review => (
                            <div key={review.username} className="mb-4">
                                <p className={"flex items-center space-x-2"}><FaUserAlt/><strong>{review.username}</strong></p>
                                <p className={"border rounded p-4 border-slate-400"}>{review.comment}</p>
                            </div>
                        ))}

                        {book.notes && book.notes.map(note => (
                            <div key={note.id} className="mb-4">
                                <p><strong>{note.user}</strong></p>
                                <p>{note.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    <Footer/>
    </div>
    );
}

export default BookDetail;
