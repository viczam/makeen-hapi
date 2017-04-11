import { createAPIActionTypes } from 'lib/redux/helpers';

const namespace = 'account';

export const PRELOAD = createAPIActionTypes({ namespace, type: 'PRELOAD' });
