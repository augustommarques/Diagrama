import expressCustom from './config/express-custom';
import reload from 'reload';

const app = expressCustom();

app.listen(3000)
reload(app)