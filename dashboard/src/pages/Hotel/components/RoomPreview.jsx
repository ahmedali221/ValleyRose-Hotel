import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { hotelService } from '../../../services/hotelService';

const RoomPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await hotelService.getRoom(id);
        setRoom(res.data);
      } catch (e) {
        setError(e.message || 'Failed to load room');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const title = room?.title?.english || room?.title || 'Room';
  const price = room?.pricePerNight ? `€${room.pricePerNight} / Night` : '';
  const rating = room?.ratingSuggestion || 4.8;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="text-purple-600 mb-4">◀ Back</button>
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="text-purple-600 flex items-center gap-2">
        <span>◀</span> Back
      </button>

   {/* Hero Preview */}
   <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-black">
        {room.coverImage?.url ? (
          <img src={room.coverImage.url} alt={title} className="w-full h-72 object-cover opacity-80" />
        ) : (
          <div className="w-full h-72 bg-gray-200" />
        )}
        
        {/* Thumbnail overlay in bottom-right corner */}
        {room.thumbnailImage?.url && (
          <img 
            src={room.thumbnailImage.url} 
            alt={`${title} thumbnail`} 
            className="absolute bottom-4 right-4 w-32 h-32 object-cover border-4 border-white shadow-lg rounded" 
          />
        )}

        {/* Purple ribbon */}
        <div
          className="absolute top-4 left-4 text-white px-4 py-2 flex items-center gap-3"
          style={{
            width: '85%',
            backgroundColor: '#9333ea',
            borderBottomRightRadius: '0.75rem'
          }}
        >
          <div className="font-semibold">{price}</div>
          <div className="flex items-center text-sm opacity-90">
            <span className="text-yellow-300 mr-1">★</span>
            ({rating})
          </div>
        </div>

        {/* Title and short blurb overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h2 className="text-2xl font-serif mb-2 drop-shadow">{title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed opacity-95">
            {(room.description?.english || '').slice(0, 260)}
          </p>
        </div>
      </div>

      {/* Gallery heading */}
      <div>
        <h3 className="text-2xl font-serif mb-1">A Glimpse Into Your Stay</h3>
        <p className="text-sm text-gray-500">Take a closer look at our rooms, restaurant, and the peaceful charm of Valley Rose.</p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-4 gap-4">
        {room.serviceGallery?.length ? (
          room.serviceGallery.map((img, idx) => (
            <div key={idx} className="aspect-square rounded overflow-hidden border border-gray-200 bg-gray-100">
              <img src={img.url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))
        ) : (
          <div className="col-span-4 text-gray-500">No gallery images</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Link to={`/hotel`} className="px-6 py-2 rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50">Delete</Link>
        <Link to={`/hotel`} className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Update</Link>
      </div>

      <p className="text-center text-xs text-gray-400">© 2022-2025 by ValleyRose.com, Inc.</p>
    </div>
  );
};

export default RoomPreview;


