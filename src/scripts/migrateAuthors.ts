import mongoose from "mongoose";
import dotenv from "dotenv";
import { Author } from "../models/Author.model";

dotenv.config();

/**
 * Migration Script
 * Converts existing Audiobooks that have an `author` field (string)
 * to instead have an `authorId` referencing the new Author collection.
 */
async function migrateAuthors() {
    try {
        const mongoUri = process.env.MONGO_URI;
        const databaseName = process.env.DB_NAME;
        if (!mongoUri) {
            console.error("Missing MONGO_URI in environment.");
            process.exit(1);
        }
        await mongoose.connect(mongoUri,{dbName: databaseName});
        console.log("Connected to MongoDB for migration...");

        const db = mongoose.connection.db;

        // Find all audiobooks
        const audiobooks = await db!.collection("audiobooks").find({}).toArray();
        console.log(`Found ${audiobooks.length} audiobooks to process.`);

        const authorMap = new Map<string, mongoose.Types.ObjectId>();

        for (const book of audiobooks) {
            // If this audiobook still has the old string `author` field and hasn't been migrated yet
            if (book.author && !book.authorId) {
                const authorName = book.author.trim();

                // Check if we already created an Author doc for this name in our Map
                let authorId = authorMap.get(authorName);

                if (!authorId) {
                    // Check DB just in case
                    let authorDoc = await Author.findOne({ name: authorName });
                    if (!authorDoc) {
                        console.log(`Creating new Author: ${authorName}`);
                        authorDoc = await Author.create({ name: authorName });
                    }
                    authorId = authorDoc._id as mongoose.Types.ObjectId;
                    authorMap.set(authorName, authorId);
                }

                // Update the audiobook document to use authorId instead of author
                await db!.collection("audiobooks").updateOne(
                    { _id: book._id },
                    {
                        $set: { authorId: authorId },
                        $unset: { author: "" }
                    }
                );
                console.log(`Migrated audiobook: ${book.title}`);
            }
        }

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateAuthors();
