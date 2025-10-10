import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService } from '../../../services/hotelService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    type: '',
    page: 1,
    limit: 6
  });

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRoomTypes = async () => {
    try {
      const response = await hotelService.getRoomTypes();
      setRoomTypes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch room types:', error);
      // Fallback to default room types if API fails
      setRoomTypes(['Single Room', 'Double Room', 'Triple Room']);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hotelService.getRooms(filters);
      setRooms(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilters(prev => ({
      ...prev,
      type: type === 'All Rooms' ? '' : type,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const getDisplayTitle = (room) => {
    return room.title?.english || room.title || 'Room';
  };

  const getDisplayRating = (room) => {
    return room.ratingSuggestion || 4.8;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--primary-color)'}}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchRooms}
          className="px-4 py-2 text-white rounded-lg"
          style={{backgroundColor: 'var(--primary-color)'}}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--primary-color)';
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Room Type Filters */}
      <div className="flex space-x-4 mb-6">
        {['All Rooms', ...roomTypes].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
              (filter === 'All Rooms' && !filters.type) || filters.type === filter
                ? 'text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
            style={((filter === 'All Rooms' && !filters.type) || filters.type === filter) ? {backgroundColor: 'var(--primary-color)'} : {}}
          >
            {filter === 'All Rooms' ? 'All Rooms' : filter}
          </button>
        ))}
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No rooms found</p>
          </div>
        ) : (
          rooms.map((room) => (
            <Link
              to={`/hotel/preview/${room._id}`}
              key={room._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-sm relative hover:shadow-md transition-shadow"
            >
              {/* Purple Header - 80% width, above image, bottom-left radius */}
              <div
                className="absolute top-0 left-0 z-10 flex justify-between items-center px-4 py-3"
                style={{
                  width: '85%',
                  borderBottomLeftRadius: 0, // matches rounded-lg
                  borderBottomRightRadius: '0.75rem'  ,
                  backgroundColor: 'var(--primary-color)', // Use CSS custom property
                }}
              >
                <h3 className="text-xs text-white">{getDisplayTitle(room)}</h3>
                <div className="flex items-center text-sm text-white">
                  <span className="text-yellow-400 mr-1">★</span>
                  ({getDisplayRating(room)})
                </div>
              </div>

              {/* Room Image - takes full card */}
              <div className="w-full h-64">
                {room.coverImage?.url ? (
                  <img
                    src={room.coverImage.url}
                    alt={getDisplayTitle(room)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Room Image</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button 
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: 'var(--primary-color)', color: 'white'}}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--primary-color)';
            }}
          >
            <span className="text-sm">‹</span>
          </button>
          {Array.from({ length: pagination.total }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center ${
                page === pagination.current
                  ? 'text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}
              style={page === pagination.current ? {backgroundColor: 'var(--primary-color)'} : {color: 'var(--primary-color)', borderColor: 'var(--primary-color)'}}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.total}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: 'var(--primary-color)'}}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--primary-color)';
            }}
          >
            <span className="text-sm">›</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Rooms;