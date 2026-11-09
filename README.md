# Blog Platform with Comments

A full-stack blogging platform where users can register, log in, write posts and discuss them in comments.

**Stack:** Spring Boot 3 (Java 17) + Spring Security (JWT) + Spring Data JPA · H2 / MySQL · React 18 (Vite) + React Router + Axios

## Features
- User registration, login, JWT authentication (BCrypt-hashed passwords)
- Create, edit, delete blog posts (only the author can edit/delete)
- Comment section on every post (login required to comment; a comment can be deleted by its author or the post owner)
- Search posts by title, pagination, "My Posts" page
- RESTful API with validation and consistent JSON error responses
- Database integration via JPA (H2 by default, MySQL optional)

## Project structure
```
blog-platform/
├── backend/    Spring Boot REST API
│   └── src/main/java/com/blogplatform/
│       ├── model/        User, Post, Comment entities
│       ├── repository/   Spring Data JPA repositories
│       ├── dto/          Request/response objects
│       ├── service/      Business logic + ownership checks
│       ├── controller/   Auth, Post, Comment endpoints
│       ├── security/     JWT util, filter, security config
│       └── exception/    Global error handling
└── frontend/   React app (Vite)
    └── src/ pages/, components/, AuthContext.jsx, api.js
```

## Prerequisites
- JDK 17+ and Maven 3.8+
- Node.js 18+

## Run the backend
```bash
cd backend
mvn spring-boot:run
```
API runs at http://localhost:8080. Default database is a file-based H2 DB (`backend/data/`), so nothing to install.
H2 console: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/blogdb`, user `sa`, empty password).

**Using MySQL instead:** open `backend/src/main/resources/application.properties`, comment the H2 block, uncomment the MySQL block and set your password. The database `blogdb` is created automatically.

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. If the backend runs on a different URL, copy `.env.example` to `.env` and edit `VITE_API_URL`.

## API endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/posts?search=&page=&size=` | No | List posts (paginated, newest first) |
| GET | `/api/posts/{id}` | No | Get one post |
| GET | `/api/posts/mine` | Yes | Posts of the logged-in user |
| POST | `/api/posts` | Yes | Create post |
| PUT | `/api/posts/{id}` | Yes (owner) | Edit post |
| DELETE | `/api/posts/{id}` | Yes (owner) | Delete post and its comments |
| GET | `/api/posts/{postId}/comments` | No | List comments of a post |
| POST | `/api/posts/{postId}/comments` | Yes | Add comment |
| DELETE | `/api/comments/{id}` | Yes (comment author or post owner) | Delete comment |

Send the token as `Authorization: Bearer <token>`.

### Quick test with curl
```bash
# register
curl -X POST localhost:8080/api/auth/register -H "Content-Type: application/json" \
  -d '{"username":"karthi","email":"karthi@example.com","password":"secret123"}'

# create a post (replace TOKEN)
curl -X POST localhost:8080/api/posts -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Hello","content":"My first post"}'

# comment on post 1
curl -X POST localhost:8080/api/posts/1/comments -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" \
  -d '{"content":"Nice post!"}'
```

## Notes
- The JWT secret in `application.properties` is for development; set the `JWT_SECRET` environment variable (Base64, 32+ bytes) for anything real.
- Tokens expire after 24 hours (`app.jwt.expiration-ms`).
- Possible extensions: comment editing, post categories/tags, likes, image upload, role-based admin.
