const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    ratingSuggestion: { type: Number, min: 1, max: 5 },
    type: { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
    coverImage: ImageSchema,
    thumbnailImage: ImageSchema,
    serviceGallery: { type: [ImageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);


