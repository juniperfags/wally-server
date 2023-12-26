export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL || 'db/sql',
    synchronization: process.env.DATABASE_SYNC || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
