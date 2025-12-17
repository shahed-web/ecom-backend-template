import {app} from './app'
import { envConfig } from './config/env.config';
const port = envConfig.PORT
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 