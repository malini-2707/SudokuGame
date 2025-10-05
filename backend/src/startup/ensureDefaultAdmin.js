import bcrypt from 'bcrypt';
import User from '../models/User.js';

export async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const displayName = process.env.ADMIN_DISPLAY_NAME || 'Admin';
  if (!email || !password) {
    console.warn('ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping default admin creation');
    return;
  }
  let admin = await User.findOne({ email, role: 'admin' });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await User.create({ email, displayName, passwordHash, role: 'admin', online: false, lastActiveAt: new Date() });
    console.log('Default admin created');
  } else {
    // Optionally ensure displayName
    if (admin.displayName !== displayName) {
      admin.displayName = displayName;
      await admin.save();
    }
  }
}
