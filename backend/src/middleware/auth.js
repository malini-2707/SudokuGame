import jwt from 'jsonwebtoken';

export function auth(requiredRole = null) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

export function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
