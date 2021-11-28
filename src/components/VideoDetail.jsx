import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import _ from 'lodash';
import { Typography, Box } from '@mui/material';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ReactPlayer from 'react-player';
import { useMoralis } from 'react-moralis';

import { useStateContext } from '../contexts/StateContextProvider';
import Loader from './Loader';

const VideoDetail = () => {
  const { id } = useParams();
  const { Moralis, isInitialized, account } = useMoralis();
  const { retrieveNFTDetails } = useStateContext();
  const [videoStats, setVideoStats] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const { isLoading, data } = useQuery(['NFTDetails', id], () =>
    retrieveNFTDetails(id)
  );

  useEffect(async () => {
    if (!isInitialized) {
      return;
    }

    const VideoStats = Moralis.Object.extend('VideoStats');
    const query = new Moralis.Query(VideoStats);
    query.equalTo('nftId', id);
    const results = await query.find();
    let vs;

    if (results.length) {
      vs = results[0];
    } else {
      vs = new VideoStats();
      vs.set('nftId', id);
      vs.set('likes', []);
      vs.set('dislikes', []);
      vs.set('views', 0);
    }

    vs.set('views', vs.get('views') + 1);
    await vs.save();
    setVideoStats(vs);
    setLikes(vs.get('likes'));
    setDislikes(vs.get('dislikes'));
  }, [id, isInitialized]);

  const videoDetail = data?.nft;
  const videoSrc = videoDetail?.metadata.playbackId
    ? `https://cdn.livepeer.com/hls/${videoDetail?.metadata.playbackId}/index.m3u8`
    : videoDetail?.metadata.external_url;

  function likeVideo() {
    if (!account) {
      alert('Please connect wallet to perform this action');
      return;
    }

    let newLikes;
    if (_.includes(likes, account)) {
      newLikes = _.remove(likes, account);
    } else {
      newLikes = [...likes, account];
    }

    videoStats.set('likes', newLikes);
    videoStats.save();
    setLikes(newLikes);
  }

  function dislikeVideo() {
    if (!account) {
      alert('Please connect wallet to perform this action');
      return;
    }

    let newDislikes;
    if (_.includes(dislikes, account)) {
      newDislikes = _.remove(dislikes, account);
    } else {
      newDislikes = [...dislikes, account];
    }

    videoStats.set('dislikes', newDislikes);
    videoStats.save();
    setDislikes(newDislikes);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      className="video-detail-container"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          mt: 10,
        }}
      >
        <Box className="video-detail">
          <ReactPlayer className="video-card" controls url={videoSrc} />
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {videoDetail?.metadata.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ opacity: 0.7 }}>
              <Typography>
                {parseInt(videoStats?.get('views')).toLocaleString('en-US')}
                views
              </Typography>
              <Typography>
                {new Date(videoDetail?.updated_date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box
              sx={{
                opacity: 0.7,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
              }}
              className="like-dislike"
            >
              <Typography
                sx={{
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                }}
                onClick={likeVideo}
              >
                <ThumbUpAltOutlinedIcon
                  color={_.includes(likes, account) ? 'primary' : ''}
                />
                <Typography>
                  {parseInt(likes.length).toLocaleString('en-US')}
                </Typography>
              </Typography>
              <Typography
                sx={{
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1,
                }}
                onClick={dislikeVideo}
              >
                <ThumbDownAltOutlinedIcon
                  color={_.includes(dislikes, account) ? 'primary' : ''}
                />
                <Typography>
                  {parseInt(dislikes.length).toLocaleString('en-US')}
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Typography>{videoDetail?.metadata.description}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoDetail;
