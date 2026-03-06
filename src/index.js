import 'dotenv/config';
import app from './app.js';
import { runSeeds } from './seeds/index.js';

const PORT = process.env.PORT || 3000;

runSeeds()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to seed:', err);
    process.exit(1);
  });
