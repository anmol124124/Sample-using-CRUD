# 📚 Exam Management System

A full-stack web application for managing exams with Sequelize ORM implementation, built with Node.js, Express, and React.

## 🎯 Project Overview

This project is an exam management system that allows users to create, read, update, and delete exams with file attachments. The system features role-based access control and uses Sequelize ORM for efficient database operations.

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, TEACHER, STUDENT)
- Password hashing with bcrypt
- Token blacklisting with Redis

### 📝 Exam Management
- ✅ **Create exams** with titles, descriptions, and scheduled times
- ✅ **Read/List exams** with filtering and pagination
- ✅ **Update exams** with edit functionality (NEW!)
- ✅ **Delete exams** with confirmation
- ✅ **File attachments** support for exams

### 🎨 Modern UI
- Beautiful gradient design with purple theme
- Card-based layout for better UX
- Statistics dashboard
- Responsive design for all devices
- Smooth animations and hover effects

### 🗄️ Database & ORM
- **Sequelize ORM** implementation (NEW!)
- PostgreSQL database
- Model associations and relationships
- Eager loading for optimized queries
- Automatic password hashing with hooks

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize ORM** - Database ORM for PostgreSQL
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS-in-JS** - Inline styling with React

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Docker (recommended for databases)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd sample
```

### 2. Start Database Services
```bash
# Using Docker (recommended)
docker-compose up -d postgres redis

# Or install locally:
# PostgreSQL (port 5432)
# Redis (port 6379)
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env with your credentials:
# PGHOST=localhost
# PGPASSWORD=your_password
# JWT_SECRET=your_secret_key

# Start the backend
npm run dev
```

Backend will be available at: http://localhost:4000

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login    - User login
POST   /api/auth/logout   - User logout
```

### Exams
```
GET    /api/exams         - List all exams
GET    /api/exams/:id     - Get exam by ID
POST   /api/exams         - Create new exam (ADMIN/TEACHER only)
PUT    /api/exams/:id     - Update exam (ADMIN/TEACHER only)
DELETE /api/exams/:id     - Delete exam (ADMIN only)
```

### Files
```
GET    /api/files/download?path=... - Download file
DELETE /api/files/:id               - Delete file (ADMIN only)
```

## 🗄️ Sequelize ORM Implementation

This project uses **Sequelize ORM** instead of raw SQL queries for better maintainability and security.

### Models Created

#### User Model
```javascript
// Features: Password hashing, validation, roles
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true },
  password_hash: { type: DataTypes.TEXT }, // Maps to password_hash column
  role: { type: DataTypes.STRING(32) },
  created_at: { type: DataTypes.DATE }
});
```

#### Exam Model
```javascript
// Features: Associations, timestamps, validation
const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.UUID, primaryKey: true },
  title: { type: DataTypes.STRING(255) },
  description: { type: DataTypes.TEXT },
  scheduled_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.UUID, references: { model: 'users' } }
});
```

#### File Model
```javascript
// Features: File metadata, associations
const File = sequelize.define('File', {
  filename: { type: DataTypes.TEXT },
  mimetype: { type: DataTypes.TEXT },
  size_bytes: { type: DataTypes.BIGINT },
  exam_id: { type: DataTypes.UUID, references: { model: 'exams' } }
});
```

### Model Associations
```javascript
// User -> Exam (One-to-Many)
User.hasMany(Exam, { foreignKey: 'created_by', as: 'exams' });
Exam.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Exam -> File (One-to-Many)
Exam.hasMany(File, { foreignKey: 'exam_id', as: 'files' });
File.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

// User -> File (One-to-Many)
User.hasMany(File, { foreignKey: 'uploaded_by', as: 'uploadedFiles' });
File.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
```

### ORM Benefits Implemented

✅ **Type Safety** - Models define data types and constraints
✅ **Associations** - Automatic relationship management
✅ **Validation** - Built-in data validation
✅ **Hooks** - Automatic password hashing before save
✅ **Eager Loading** - Optimized queries with JOINs
✅ **SQL Injection Protection** - Parameterized queries
✅ **Transaction Support** - Database consistency
✅ **Migration Ready** - Easy schema changes

## 📁 Project Structure

```
sample/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/          # Database and Redis config
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   ├── uploads/         # File storage
│   │   └── server.js        # Entry point
│   ├── scripts/             # Database scripts
│   ├── .env.example         # Environment template
│   └── package.json         # Dependencies
├── frontend/                # React client
│   ├── src/
│   │   ├── components/      # React components
│   │   └── App.jsx          # Main app
│   ├── index.html           # Entry point
│   └── package.json         # Dependencies
├── sql/                     # Database schema
└── docker-compose.yml       # Container setup
```

## 🔧 Development Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Sync database models
npm run db:create

# Reset database (CAUTION!)
npm run db:reset

# Seed database
npm run db:seed
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Environment Variables

Create `.env` file in backend directory:

```env
# Node Environment
NODE_ENV=development
PORT=4000

# PostgreSQL Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=exam_mgmt
PGUSER=postgres
PGPASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# File Upload
UPLOAD_DIR=./src/uploads
MAX_UPLOAD_BYTES=52428800
```

## 🧪 Testing

### Health Checks
```bash
# Test backend
curl http://localhost:4000/health

# Test database connection
curl http://localhost:4000/health/db

# Test Redis connection
curl http://localhost:4000/health/redis
```

### API Testing
```bash
# Login (get token first)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# List exams (with auth token)
curl http://localhost:4000/api/exams \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create exam (ADMIN/TEACHER only)
curl -X POST http://localhost:4000/api/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Exam",
    "description": "Test Description",
    "scheduled_at": "2025-10-15T10:00:00"
  }'
```

## 🚨 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **SQL Injection Protection** - Sequelize parameterized queries
- **Role-based Access** - ADMIN, TEACHER, STUDENT permissions
- **File Upload Validation** - Size and type restrictions

## 📈 Performance Optimizations

- **Eager Loading** - Reduces N+1 query problems
- **Connection Pooling** - Efficient database connections
- **Redis Caching** - Session and token management
- **Query Optimization** - Indexed fields and efficient queries
- **File Streaming** - Large file uploads/downloads

## 🔄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Exams Table
```sql
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  attachment_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id),
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 🐳 Docker Setup

### Start All Services
```bash
docker-compose up -d
```

### Manual Database Setup
```bash
# Create database
createdb exam_mgmt

# Run schema
psql -d exam_mgmt -f sql/schema.sql

# Run seed data
psql -d exam_mgmt -f sql/seed.sql
```

## 📚 ORM Query Examples

### Find All Exams with Creator
```javascript
const exams = await models.Exam.findAll({
  include: [
    { model: models.User, as: 'creator' }
  ],
  order: [['created_at', 'DESC']]
});
```

### Find Exam by Title
```javascript
const exam = await models.Exam.findOne({
  where: { title: 'CGL SSC' }
});
```

### Create Exam with File
```javascript
const exam = await models.Exam.create({
  title: 'Test Exam',
  description: 'Description',
  scheduled_at: new Date(),
  created_by: userId
});

await models.File.create({
  exam_id: exam.id,
  filename: 'document.pdf',
  mimetype: 'application/pdf',
  size_bytes: 1024000,
  uploaded_by: userId
});
```

### Update Exam
```javascript
const exam = await models.Exam.findByPk(examId);
exam.title = 'Updated Title';
exam.updated_at = new Date();
await exam.save();
```

## 🚀 Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Support

For questions or issues:
1. Check the application logs
2. Verify database connections
3. Review environment configuration
4. Check Sequelize ORM documentation

---

**Made with ❤️ using Node.js, Express, Sequelize ORM, and React**
