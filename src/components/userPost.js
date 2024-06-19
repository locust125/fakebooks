import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Collapse,
} from '@mui/material';
import authService from 'src/services/auth-service';
import SynchronizationDialog from './synchronizationDialog';

const RecipeReviewCard = () => {
  const [postsData, setPostsData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const userData = JSON.parse(localStorage.userinfo);
        const idUser = userData?.id;
        console.log('Fetching user data for ID:', idUser); // Log for debugging
        const data = await authService.getData(`user/info/${idUser}`);
        console.log('Received data:', data); // Log for debugging
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

    const fetchComments = async postId => {
      try {
        console.log('Fetching comments for post ID:', postId); // Log for debugging
        const commentData = await authService.getData(`get/comments/${postId}`);
        console.log('Received comment data for post ID:', postId, commentData); // Log for debugging
        setComments(prevComments => ({
          ...prevComments,
          [postId]: commentData,
        }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPostsData();
  }, []);

  const handleExpandClick = postId => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [postId]: !prevExpanded[postId],
    }));
  };

  if (!postsData.length) {
    return <div>Cargando...</div>;
  }

  const getInitials = name => {
    return name
      ? name
          .split(' ')
          .map(n => n[0])
          .join('')
      : 'R';
  };

  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
      }}
    >
      {postsData.map(postData => (
        <Card sx={{ maxWidth: 345 }} key={postData._id}>
          <CardMedia
            component="img"
            alt={postData.title}
            height="140"
            image={postData.imagePost.secureUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {postData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {postData.content}
            </Typography>
          </CardContent>
          <CardActions>
            <SynchronizationDialog post={postData._id} />
            <Button
              onClick={() => handleExpandClick(postData._id)}
              aria-expanded={expanded[postData._id]}
              aria-label="show more"
              size="small"
            >
              Learn More
            </Button>
          </CardActions>
          <Collapse in={expanded[postData._id]} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comentarios:
              </Typography>
              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '0 16px',
                }}
              >
                {(comments[postData._id] || []).map(comment => (
                  <div
                    key={comment._id}
                    style={{
                      marginBottom: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      paddingBottom: '8px',
                    }}
                  >
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      {comment.idUser.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ margin: '8px 0' }}
                    >
                      {comment.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default RecipeReviewCard;
