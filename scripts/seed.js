// scripts/seed.js
require('dotenv').config();
const { initDb } = require('../config/db');
const User = require('../models/User');
const Article = require('../models/Article');

(async () => {
    await initDb();
    try {
        await User.create({ name: 'Admin', email: 'admin@sentinova.com', password: 'password123', role: 'admin' });
    } catch(e) { /* ignore if exists */ }

    const sample = [
        { title: 'Welcome to Sentinova', slug: 'welcome-sentinova', summary: 'First article', content: 'Hello world from Sentinova!', author: 'Admin' },
        { title: 'Node.js power in backend', slug: 'nodejs-power-backend', summary: 'Why Node.js', content: 'Node.js provides non-blocking I/O...', author: 'Admin' },
        { title: 'Redis caching explained', slug: 'redis-caching-explained', summary: 'Caching basics', content: 'Redis is great for server-side cache and pub/sub...', author: 'Admin' }
    ];

    for (const a of sample) {
        try {
            await Article.create(a);
        } catch(e){}
    }

    console.log('Seed complete. Created sample articles and admin user (admin@sentinova.com / password123)');
    process.exit(0);
})();
