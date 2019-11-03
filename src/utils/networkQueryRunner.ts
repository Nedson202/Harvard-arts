import { client } from '..';
import { ClientObject } from './../../types';

const runNetworkQuery =
  (query: string, value: string): Promise<object> => {
    return new Promise(async (resolve) => {
      try {
        const response = await client.query({
          query,
          variables: {
            search: value,
            from: 0,
            size: 24,
            page: 1,
          },
          fetchPolicy: 'network-only',
        });

        resolve(response);
      } catch (error) {
        resolve(error);
      }
    });
  };

export default runNetworkQuery;
