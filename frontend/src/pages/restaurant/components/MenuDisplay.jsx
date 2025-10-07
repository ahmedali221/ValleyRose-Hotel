import React, { useState, useEffect } from 'react';
import { restaurantMainMenuService } from '../../../services';

const MenuDisplay = () => {
  const [menuPdfUrl, setMenuPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Will be updated from API
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchMainMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const menuData = await restaurantMainMenuService.getMainMenu();
        console.log('Menu data received:', menuData);
        setMenuPdfUrl(menuData.pdfFile);
        
        // Set the page count from API
        if (menuData.pageCount && menuData.pageCount > 0) {
          console.log('Setting page count to:', menuData.pageCount);
          setTotalPages(menuData.pageCount);
        } else {
          console.warn('No valid pageCount in response, using default:', 5);
          setTotalPages(5);
        }
      } catch (err) {
        console.error('Error fetching main menu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainMenu();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setImageLoading(true);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setImageLoading(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setImageLoading(true);
    setCurrentPage(pageNumber);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    setImageLoading(false);
    console.warn('PDF to image conversion failed');
    setError('Unable to display PDF page. Please use the download button to view the full menu.');
  };

  // Generate the correct Cloudinary transformation URL for PDF page as image
  const getPdfPageUrl = (pdfUrl, pageNumber) => {
    if (!pdfUrl) return '';
    
    // Cloudinary format: .../upload/pg_{page}/...filename.pdf
    // The transformation converts the PDF page to an image
    const transformedUrl = pdfUrl.replace('/upload/', `/upload/pg_${pageNumber},f_jpg,q_auto/`);
    console.log(`Generated URL for page ${pageNumber}:`, transformedUrl);
    return transformedUrl;
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {menuPdfUrl && (
            <a
              href={menuPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Menu
            </a>
          )}

          <h2 className="text-4xl font-bold">
            <span className="text-purple-600">Valley Rose</span>{' '}
            <span className="text-gray-800">Restaurant</span>
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 text-lg font-semibold mb-2">Failed to load menu</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Menu Display Container */}
        {!loading && !error && menuPdfUrl && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
            {/* Navigation Arrow - Previous */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-purple-50 hover:scale-110 hover:shadow-xl'
              }`}
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Navigation Arrow - Next */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-purple-50 hover:scale-110 hover:shadow-xl'
              }`}
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* PDF Display with Fixed Height - Single Page View */}
            <div className="relative w-full h-[700px] bg-gray-100 flex items-center justify-center">
              {/* Loading spinner for page transitions */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              )}
              
              {/* Convert PDF page to image using Cloudinary transformation */}
              <img
                key={currentPage}
                src={getPdfPageUrl(menuPdfUrl, currentPage)}
                alt={`Restaurant Menu - Page ${currentPage}`}
                className="max-w-full max-h-full object-contain shadow-lg"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

            {/* Pagination Dots */}
            <div className="bg-gray-50 py-6 px-6">
              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      className={`transition-all duration-300 rounded-full ${
                        currentPage === pageNumber
                          ? 'w-10 h-3 bg-purple-600'
                          : 'w-3 h-3 bg-gray-300 hover:bg-purple-400 hover:scale-125'
                      }`}
                      aria-label={`Go to page ${pageNumber}`}
                      title={`Page ${pageNumber}`}
                    />
                  );
                })}
              </div>
              {/* Page Counter */}
              <div className="text-center mt-3 text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !menuPdfUrl && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No menu available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later or contact us for menu details.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuDisplay;

