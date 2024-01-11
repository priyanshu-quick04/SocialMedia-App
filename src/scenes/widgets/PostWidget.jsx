import { ChatBubbleOutlineOutlined } from "@mui/icons-material";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import { FavoriteOutlined } from "@mui/icons-material";
import { ShareOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Typography } from '@mui/material';
import { useTheme } from "@emotion/react";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import { useDispatch,useSelector} from "react-redux";
import {setPost} from "../../state";
import { useState } from "react";



const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
}) => {
    const [isComments, setIsComments,] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.token);
    const loggedInUserId = useSelector((state)=>state.user._id);
    const isLiked = Boolean(likes(loggedInUserId));
    const likeCount = Object.keys(likes).length;

    const {palette} = useTheme();
    const primary = palette.primary.main;
    const main = palette.neutral.main;

    const patchLike = async() => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`,{
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "COntent-Type": "application/json"
            },
            body: JSON.stringify({userId : loggedInUserId})
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost}));
    };

    return(
        <WidgetWrapper m="2rem 0">
            <Friend friendId={postUserId}
            name={name}
            subtitle = {location}
            userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{mt : "1rem"}}>
                {description}
            </Typography>
            {picturePath && (
                <img width="100%"
                    height="auto"
                    alt = "post"
                    style={{borderRadius:"0.75rem" , marginTop: "0.75rem"}}
                    src={`http://localhost:3001/assets/${picturePath}`}
                />
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween  gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ?(
                                <FavoriteOutlined sx={{ color: primary}} />
                            ) : (
                                <FavoriteBorderOutlined/>
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={()=> setIsComments(!isComments)}>
                            <ChatBubbleOutlineOutlined/>
                        </IconButton>
                        <Typography>{comments.length }</Typography>
                    </FlexBetween>
                </FlexBetween>

                <IconButton><ShareOutlined/></IconButton>
            </FlexBetween>
            {isComments &&(
                <Box mt="0.5rem">
                    {comments.map((comment,i)=>(
                        <Box key={`${name}-${i}`}>
                            <Divider/>
                            <Typography sx={{color: main, m: "0.5rem 0", pl: "1rem"}}>
                                {comment}
                            </Typography>
                        </Box>
                    ))}
                    <Divider/>
                </Box>
            )}
        </WidgetWrapper>
    )
}

export default PostWidget;

