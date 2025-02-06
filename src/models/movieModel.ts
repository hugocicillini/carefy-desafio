import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
    },
    releaseYear: {
      type: Number,
    },
    genre: {
      type: [String],
    },
    state: {
      type: String,
      enum: [
        'A assistir',
        'Assistido',
        'Avaliado',
        'Recomendado',
        'Não recomendado',
      ],
      default: 'A assistir',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
    history: [
      {
        action: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
