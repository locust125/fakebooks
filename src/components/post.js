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
  const [postsData, setPostsData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const data = await authService.getData('getAll/post');
        if (data && data.docs) {
          setPostsData(data.docs);
          const initialExpandedState = {};
          data.docs.forEach(post => {
            initialExpandedState[post._id] = false;
            fetchComments(post._id);
          });
          setExpanded(initialExpandedState);
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    const fetchComments = async (postId) => {
      try {
        const commentData = await authService.getData(`get/comments/${postId}`);
        setComments(prevComments => ({ ...prevComments, [postId]: commentData }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPostsData();
  }, []);

  const handleExpandClick = (postId) => {
    setExpanded(prevExpanded => ({ ...prevExpanded, [postId]: !prevExpanded[postId] }));
  };

  if (!postsData.length) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
    }}>
      {postsData.map(postData => (
        <Card sx={{ maxWidth: '100%', marginBottom: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} key={postData._id}>
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
            image={postData.imagePost.secureUrl}
            alt={postData.title}
          />
          <CardContent style={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {postData.content}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <SynchronizationDialog post={postData._id} />
            <IconButton
              onClick={() => handleExpandClick(postData._id)}
              aria-expanded={expanded[postData._id]}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded[postData._id]} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Comentarios:</Typography>
              {(comments[postData._id] || []).map((comment) => (
                <Typography key={comment._id} paragraph>
                  <strong>{comment.idUser.name}:</strong> {comment.comment} <br />
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </Typography>
              ))}
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default RecipeReviewCard;
