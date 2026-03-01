import { User } from "../models/User.model";
import { Audiobook } from "../models/Audiobook.model";
import { Category } from "../models/Category.model";
import { Review } from "../models/Review.model";
import { Playlist } from "../models/Playlist.model";
import { ListeningHistory } from "../models/ListeningHistory.model";

export class AdminService {
    async getDashboardStats() {
        // Run all count queries in parallel to save time
        const [
            totalUsers,
            totalAudiobooks,
            totalCategories,
            totalReviews,
            totalPlaylists,
            totalListens,
        ] = await Promise.all([
            User.countDocuments(),
            Audiobook.countDocuments(),
            Category.countDocuments(),
            Review.countDocuments(),
            Playlist.countDocuments(),
            ListeningHistory.countDocuments(),
        ]);

        // Aggregate Most popular audiobooks based on reviewsCount + averageRating or likes
        const popularAudiobooks = await Audiobook.find()
            .sort({ averageRating: -1, reviewsCount: -1, likesCount: -1 })
            .limit(5)
            .select("title authorId averageRating reviewsCount likesCount")
            .populate("authorId", "name");

        // Check new users in the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newUsersLastWeek = await User.countDocuments({
            createdAt: { $gte: oneWeekAgo },
        });

        return {
            totals: {
                users: totalUsers,
                audiobooks: totalAudiobooks,
                categories: totalCategories,
                reviews: totalReviews,
                playlists: totalPlaylists,
                listens: totalListens,
            },
            newUsersLastWeek,
            popularAudiobooks,
        };
    }
}

export const adminService = new AdminService();
