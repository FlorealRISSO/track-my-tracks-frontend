import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    backEndPort: process.env.BACKEND_PORT,
    backEndUrl: process.env.BACKEND_URL,
  },
});
