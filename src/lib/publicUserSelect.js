export const publicUserSelect = {
  id: true,
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  isGuest: true,
  createdAt: true,
};

export const selfUserSelect = {
  ...publicUserSelect,
  email: true,
};
