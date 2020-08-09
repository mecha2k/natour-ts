import * as mongoose from "mongoose"
import slugify from "slugify"
import validator from "validator"

interface ITour extends mongoose.Document {
  name: string
  slug: string
  duration: number
  maxGroupSize: number
  difficulty: string
  ratingsAverage: number
  ratingsQuantity: number
  price: number
  priceDiscount: number
  summary: string
  description: string
  imageCover: string
  images: mongoose.Types.Array<string>
  createdAt: Date
  startDates: mongoose.Types.Array<Date>
  secretTour: boolean
  startLocation: string
  coordinates: mongoose.Types.Array<number>
  locations: {
    type: string
    coordinates: number
    address: string
    description: string
    day: number
  }

  // guides: mongoose.Schema.ObjectId
}

const schema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"]
      // validate: [validator["isAlpha"], "Tour name must only contain characters"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: function (val: number) {
        return Math.round(val * 10) / 10
      }
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    priceDiscount: {
      type: Number
      // validate: {
      //   validator: function (val: number) {
      //     return val < this["price"]
      //   },
      //   message: "Discount price ({VALUE}) should be below regular price"
      // }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ]
    // guides: [{ type: mongoose.Schema.ObjectId, ref: "users" }]
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// schema.index({ price: 1, ratingsAverage: -1 })
// schema.index({ slug: 1 })
// schema.index({ startLocation: "2dsphere" })

// schema.virtual("durationWeeks").get(function () {
//   return this.duration / 7
// })

// schema.virtual("reviews", {
//   ref: "reviews",
//   foreignField: "tour",
//   localField: "_id"
// })

// schema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   next()
// })

// schema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } })

//   this.start = Date.now()
//   next()
// })

// schema.pre(/^find/, function (next) {
//   this.populate({ path: "guides", select: "-__v -passwordChangedAt" })

//   next()
// })

// schema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`)
//   next()
// })

// schema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   console.log(this.pipeline())
//   next()
// })

export default mongoose.model<ITour>("tours", schema)
