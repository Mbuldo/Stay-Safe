-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    notifications_enabled BOOLEAN DEFAULT 1,
    data_sharing BOOLEAN DEFAULT 0,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'system',
    privacy_level TEXT DEFAULT 'standard',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    score REAL NOT NULL,
    responses TEXT NOT NULL,
    ai_analysis TEXT,
    recommendations TEXT,
    resources TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT,
    url TEXT,
    image_url TEXT,
    type TEXT NOT NULL,
    difficulty TEXT,
    estimated_read_time INTEGER,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL,
    resource_id TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    category TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    read BOOLEAN DEFAULT 0,
    action_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_category ON assessments(category);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- Educational articles table
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    author TEXT DEFAULT 'Stay-Safe Team',
    read_time INTEGER,
    tags TEXT,
    featured BOOLEAN DEFAULT 0,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);

-- User bookmarks
CREATE TABLE IF NOT EXISTS article_bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    article_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE(user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON article_bookmarks(user_id);

-- Campus resources table
CREATE TABLE IF NOT EXISTS campus_resources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT DEFAULT 'Nairobi',
    phone TEXT,
    email TEXT,
    website TEXT,
    hours TEXT,
    services TEXT,
    cost_info TEXT,
    student_friendly BOOLEAN DEFAULT 1,
    free_services TEXT,
    latitude REAL,
    longitude REAL,
    verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_type ON campus_resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON campus_resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_city ON campus_resources(city);