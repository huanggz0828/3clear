/* @refresh reload */
import { render } from 'solid-js/web';

import './index.less';
import App from './App';

render(() => <App />, document.getElementById('root') as HTMLElement);
