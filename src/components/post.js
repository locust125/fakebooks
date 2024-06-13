import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Avatar,
} from '@mui/material';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Collapse from '@mui/material/Collapse';
import authService from 'src/services/auth-service';
import SynchronizationDialog from './synchronizationDialog';

const RecipeReviewCard = () => {
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const data = await authService.getData('getAll/post');
        if (data && data.docs && data.docs.length > 0) {
          const post = data.docs[0];
          setPostData(post);
          fetchComments(post._id);
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    const fetchComments = async (postId) => {
      try {
        const commentData = await authService.getData(`get/comments/${postId}`);
        setComments(commentData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPostData();
  }, []);

  if (!postData) {
    return <div>Cargando...</div>;
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={postData.title}
        subheader={new Date(postData.createdAt).toLocaleDateString()}
      />
      <CardMedia
        component="img"
        height="194"
        image={postData.imagePost.secureUrl} // Ajusta esta parte según la estructura de tu dato
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {postData.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
          <SynchronizationDialog
          post={postData._id}
          />
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Comentarios:</Typography>
          {comments.map((comment) => (
            <Typography key={comment._id} paragraph>
              <strong>{comment.idUser.name}:</strong> {comment.comment} <br />
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default RecipeReviewCard;
