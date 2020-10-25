// server
const express = require('express');
const server = express();

// Router
const apiPostsRouter = require('./api-posts-router.js')
server.use('/api/posts', apiPostsRouter);

// Run server
server.listen(4000, () => console.log('API running on port 4000'))


