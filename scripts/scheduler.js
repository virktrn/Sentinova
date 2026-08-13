const cron = require('node-cron');
const { spawn } = require('child_process');

// run fetch-news every hour at minute 0
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled news fetch...');
    const p = spawn('node', ['scripts/fetchNews.js'], { stdio: 'inherit' });
    p.on('close', code => console.log('fetchNews exited with', code));
});
