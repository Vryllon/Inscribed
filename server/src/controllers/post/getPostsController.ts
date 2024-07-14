import { PostDocument } from '../../types/models/Post';
import { Post } from '../../model/Post';
import { Response } from 'express';
import { CustomJwtPayload, CustomRequest } from '../../types/requests/CustomRequest';
import { APIResponse } from '../../types/responses/APIResponse';


const getPostsController = async (req: CustomRequest, res: Response): Promise<void> => {

    try {

        // Get the user id from the request
        const userId: string = (req.user as CustomJwtPayload).userId;

        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Fetch post documents with pagination
        const posts: PostDocument[] = await Post.find({ userId }).limit(limit).skip(skip);

        // Retrieve the total count of posts for the user for pagination data
        const totalPosts = await Post.countDocuments({ userId });

        // Return paginated posts along with pagination info
        const response: APIResponse = {
            timestamp: Date.now(),
            message: 'User Posts Received',
            code: 200,
            data: {
                posts,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts
            }
        };

        res.status(response.code).json(response);
        return;
        

    }
    catch(error) {

        const response: APIResponse = {
            timestamp: Date.now(),
            message: 'Internal Server Error',
            code: 500
        };

        res.status(response.code).json(response);
        return;

    }

};

export default getPostsController;