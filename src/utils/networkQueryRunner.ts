import { ClientObject } from './../../types';
import { client } from '..';

const runNetworkQuery =
  (query: string, value: string): Promise<object> => {
    return new Promise(async (resolve, reject) => {
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
        reject(error);
      }
    });
  };

export default runNetworkQuery;
