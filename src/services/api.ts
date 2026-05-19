// Mock MERN API service
// In a real MERN stack app, these functions would make HTTP requests to an Express/Node backend
// which in turn would query MongoDB. Here we simulate that with localStorage + async delays.

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string; // In real app, hashed with bcrypt on backend
  name: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  authorId: string;
  text: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

type DB = {
  users: User[];
  posts: Post[];
  session: string | null; // current user id
};

const DB_KEY = "socialmedia_db_v1";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function defaultAvatar(name: string): string {
  // Deterministic avatar URL using DiceBear (no backend needed)
  const seed = encodeURIComponent(name.trim() || "user");
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

function seedData(): DB {
  const users: User[] = [
    {
      _id: "u_demo",
      username: "janedoe",
      email: "jane@example.com",
      password: "password123",
      name: "Jane Doe",
      bio: "Designer & coffee enthusiast ☕️",
      avatar: defaultAvatar("Jane Doe"),
      followers: [],
      following: ["u_alex", "u_mia"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      _id: "u_alex",
      username: "alexchen",
      email: "alex@example.com",
      password: "password123",
      name: "Alex Chen",
      bio: "Full-stack dev 🚀",
      avatar: defaultAvatar("Alex Chen"),
      followers: ["u_demo"],
      following: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    },
    {
      _id: "u_mia",
      username: "miajones",
      email: "mia@example.com",
      password: "password123",
      name: "Mia Jones",
      bio: "Photographer | Traveler 🌍",
      avatar: defaultAvatar("Mia Jones"),
      followers: ["u_demo"],
      following: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    },
  ];

  const posts: Post[] = [
    {
      _id: "p_1",
      authorId: "u_alex",
      text: "Just shipped a new feature! The MERN stack never disappoints 🚀 #webdev",
      likes: ["u_demo", "u_mia"],
      comments: [
        {
          _id: "c_1",
          authorId: "u_mia",
          text: "Congrats! Looks amazing 🔥",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      _id: "p_2",
      authorId: "u_mia",
      text: "Sunrise in Lisbon. No filter needed ✨",
      image:
        "https://images.unsplash.com/photo-1513624893376-4d8eb79b7d5e?w=800&auto=format&fit=crop",
      likes: ["u_alex"],
      comments: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      _id: "p_3",
      authorId: "u_demo",
      text: "Working on some new UI concepts today. What are you building?",
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
  ];

  return { users, posts, session: null };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const fresh = seedData();
      localStorage.setItem(DB_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw);
  } catch {
    const fresh = seedData();
    localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function save(db: DB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function sanitizeUser(u: User): Omit<User, "password"> {
  const { password: _p, ...rest } = u;
  void _p;
  return rest;
}

export const api = {
  async register(input: { username: string; email: string; password: string; name: string }) {
    await delay();
    const db = load();
    if (db.users.some((u) => u.username === input.username)) {
      throw new Error("Username already taken");
    }
    if (db.users.some((u) => u.email === input.email)) {
      throw new Error("Email already registered");
    }
    const user: User = {
      _id: uid(),
      username: input.username.toLowerCase(),
      email: input.email,
      password: input.password, // real app: hash on backend
      name: input.name || input.username,
      bio: "",
      avatar: defaultAvatar(input.name || input.username),
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    db.session = user._id;
    save(db);
    return sanitizeUser(user);
  },

  async login(identifier: string, password: string) {
    await delay();
    const db = load();
    const user = db.users.find(
      (u) =>
        (u.username === identifier.toLowerCase() || u.email === identifier) &&
        u.password === password,
    );
    if (!user) throw new Error("Invalid credentials");
    db.session = user._id;
    save(db);
    return sanitizeUser(user);
  },

  async logout() {
    await delay(100);
    const db = load();
    db.session = null;
    save(db);
  },

  async me() {
    await delay(100);
    const db = load();
    if (!db.session) return null;
    const user = db.users.find((u) => u._id === db.session);
    return user ? sanitizeUser(user) : null;
  },

  async getUser(id: string) {
    await delay();
    const db = load();
    const u = db.users.find((x) => x._id === id);
    return u ? sanitizeUser(u) : null;
  },

  async getUserByUsername(username: string) {
    await delay();
    const db = load();
    const u = db.users.find((x) => x.username === username.toLowerCase());
    return u ? sanitizeUser(u) : null;
  },

  async getSuggestedUsers(limit = 5) {
    await delay();
    const db = load();
    const me = db.session;
    return db.users
      .filter((u) => u._id !== me)
      .slice(0, limit)
      .map(sanitizeUser);
  },

  async updateProfile(id: string, updates: { name?: string; bio?: string; avatar?: string }) {
    await delay();
    const db = load();
    const u = db.users.find((x) => x._id === id);
    if (!u) throw new Error("User not found");
    if (updates.name !== undefined) u.name = updates.name;
    if (updates.bio !== undefined) u.bio = updates.bio;
    if (updates.avatar !== undefined) u.avatar = updates.avatar;
    save(db);
    return sanitizeUser(u);
  },

  async toggleFollow(meId: string, targetId: string) {
    await delay();
    const db = load();
    const me = db.users.find((x) => x._id === meId);
    const target = db.users.find((x) => x._id === targetId);
    if (!me || !target) throw new Error("User not found");
    if (me.following.includes(targetId)) {
      me.following = me.following.filter((id) => id !== targetId);
      target.followers = target.followers.filter((id) => id !== meId);
    } else {
      me.following.push(targetId);
      target.followers.push(meId);
    }
    save(db);
    return sanitizeUser(target);
  },

  // Posts
  async getFeed(): Promise<Post[]> {
    await delay();
    const db = load();
    return [...db.posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    await delay();
    const db = load();
    return db.posts
      .filter((p) => p.authorId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createPost(input: { authorId: string; text: string; image?: string }) {
    await delay();
    const db = load();
    const post: Post = {
      _id: uid(),
      authorId: input.authorId,
      text: input.text,
      image: input.image,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    db.posts.unshift(post);
    save(db);
    return post;
  },

  async toggleLike(postId: string, userId: string) {
    await delay(100);
    const db = load();
    const post = db.posts.find((p) => p._id === postId);
    if (!post) throw new Error("Post not found");
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }
    save(db);
    return post;
  },

  async addComment(postId: string, authorId: string, text: string) {
    await delay();
    const db = load();
    const post = db.posts.find((p) => p._id === postId);
    if (!post) throw new Error("Post not found");
    const comment: Comment = {
      _id: uid(),
      authorId,
      text,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    save(db);
    return post;
  },

  async deletePost(postId: string, userId: string) {
    await delay();
    const db = load();
    const idx = db.posts.findIndex((p) => p._id === postId && p.authorId === userId);
    if (idx === -1) throw new Error("Not allowed");
    db.posts.splice(idx, 1);
    save(db);
  },

  async reset() {
    localStorage.removeItem(DB_KEY);
  },
};

// Helper: get user object synchronously from db (for post rendering)
export function getUserSync(id: string): Omit<User, "password"> | null {
  const db = load();
  const u = db.users.find((x) => x._id === id);
  return u ? sanitizeUser(u) : null;
}

export function getUsersSync(): Omit<User, "password">[] {
  const db = load();
  return db.users.map(sanitizeUser);
}
