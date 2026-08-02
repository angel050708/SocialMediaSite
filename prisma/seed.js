import "dotenv/config";
import crypto from "node:crypto";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const USER_COUNT = 15;
const MAX_POSTS_PER_USER = 5;
const FOLLOW_CHANCE = 0.3;
const FOLLOW_ACCEPTED_CHANCE = 0.8;
const LIKE_CHANCE = 0.4;
const COMMENT_CHANCE = 0.5;
const SEED_PASSWORD = "Password123!";

function gravatarUrl(email) {
  const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

async function clearData() {
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();
}

async function createUsers(passwordHash) {
  const users = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const base = faker.internet
      .username()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    const username = `${base || "user"}${i}`;
    const email = faker.internet.email({ firstName: username });
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        displayName: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        avatarUrl: gravatarUrl(email),
      },
    });
    users.push(user);
  }
  return users;
}

async function createFollows(users) {
  for (const follower of users) {
    for (const target of users) {
      if (follower.id === target.id || Math.random() >= FOLLOW_CHANCE) {
        continue;
      }
      const status = Math.random() < FOLLOW_ACCEPTED_CHANCE ? "ACCEPTED" : "PENDING";
      await prisma.follow.create({ data: { followerId: follower.id, followingId: target.id, status } });
    }
  }
}

async function createPosts(users) {
  const posts = [];
  for (const author of users) {
    const postCount = faker.number.int({ min: 0, max: MAX_POSTS_PER_USER });
    for (let i = 0; i < postCount; i++) {
      const post = await prisma.post.create({
        data: { authorId: author.id, content: faker.lorem.paragraph() },
      });
      posts.push(post);
    }
  }
  return posts;
}

async function createLikesAndComments(users, posts) {
  for (const post of posts) {
    for (const user of users) {
      if (user.id === post.authorId) {
        continue;
      }
      if (Math.random() < LIKE_CHANCE) {
        await prisma.like.create({ data: { postId: post.id, userId: user.id } });
      }
      if (Math.random() < COMMENT_CHANCE) {
        await prisma.comment.create({
          data: { postId: post.id, authorId: user.id, content: faker.lorem.sentence() },
        });
      }
    }
  }
}

async function main() {
  console.log("Clearing existing data...");
  await clearData();

  console.log(`Creating ${USER_COUNT} users (password: ${SEED_PASSWORD})...`);
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);
  const users = await createUsers(passwordHash);

  console.log("Creating follow relationships...");
  await createFollows(users);

  console.log("Creating posts...");
  const posts = await createPosts(users);

  console.log("Creating likes and comments...");
  await createLikesAndComments(users, posts);

  console.log(`Done. Users: ${users.length}, Posts: ${posts.length}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
