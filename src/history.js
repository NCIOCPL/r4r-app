import { createBrowserHistory } from 'history';

/**
 * By instantiating our history object here we can have access to it outside of the component
 * tree (especially in our thunks to allow redirecting after searches (this would otherwise be impossible)).
 */

const history = createBrowserHistory();

export default history;