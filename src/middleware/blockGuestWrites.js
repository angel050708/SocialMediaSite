export function blockGuestWrites(req, res, next) {
  if (req.user?.isGuest && req.method !== "GET") {
    return res.status(403).json({ error: "Guest accounts are read-only" });
  }
  next();
}
