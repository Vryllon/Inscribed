import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../types/APIResponse';
import { CustomRequest, CustomJwtPayload } from '../../types/CustomRequest'; 
import { Response } from 'express';
import { Comment, IComment } from '../../models/comment';

const getPostCommentsController = async (req: CustomRequest, res: Response): Promise<void> => {

    try {

        // Get the userId from the request
        const userId: string = (req.user as CustomJwtPayload).userId;

        // Get postId from query parameters
        const postId = req.query.postId as string;
        
        // Validate postId
        if (!postId) {
            const response: APIResponse = {
                message: 'postId is required',
                code: StatusCodes.BAD_REQUEST,
            };
            res.status(response.code).json(response);
            return;
        }

        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Fetch comment documents with pagination
        const comments: IComment[] = await Comment.find({ postId })
        .populate('userId', 'username')
        .limit(limit).skip(skip);

        // Retrieve the total count of comments for the post for pagination data
        const totalComments = await Comment.countDocuments({ postId });

        // Send success response
        const response: APIResponse = {
            message: 'Comments fetched successfully',
            code:    StatusCodes.OK,
            data: {
                comments,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments
            }
        };

        res.status(response.code).json(response);
        return;

    }

    catch(error) {

        // Log error
        console.error(`Error while getting post comments: ${error}`);

        // Send error response
        const response: APIResponse = {
            message: 'Internal Server Error',
            code:    StatusCodes.INTERNAL_SERVER_ERROR
        };

        res.status(response.code).json(response);
        return;

    }

};

export default getPostCommentsController;