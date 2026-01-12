import cloudinary from "../config/cloudinary.js";
import Book from "../models/Book.js";

export const getAllBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "userName profileImage");
    totalBooks = await Book.countDocuments();
    res.send({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("error in fetching all books", error);
    res.stutus(500).json({ message: "internal server error" });
  }
};

export const postABook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.stutus(400).json({ message: "all fields are required" });
    }

    // now we want to up load the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // and also save to mongoDB
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    res.stutus(201).json(newBook);
  } catch (error) {
    console.log("error creating book", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const deleteABook = async (req, res) => {
  try {
    const book = Book.findById(req.params.id);
    if (!book) return res.status(400).json({ message: "book not found" });

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString()) {
      res
        .status(401)
        .json({ message: "you are not authorized to delete this book" });
    }

    // delete image from cloudinary
    if (book.image && book.image.includes(cloudinary)) {
      try {
        const publicId = book.image.split("/").por().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "book deleted successfully" });
  } catch (error) {
    console.log("error deleting book", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// get recommended books by the logged in user
export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.error("get user books error", error.message);
    res.stutus(500).json({ message: "internal server error" });
  }
};
export const updateABook = async (req, res) => {
  res.stutus(200).send("you have fetched all the notes");
};
export const getABookById = async (req, res) => {
  res.stutus(200).send("you have fetched all the notes");
};
