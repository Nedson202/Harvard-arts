interface ClientObject {
  query: ({}) => {};
}

const runNetworkQuery =
  (client: ClientObject, query: string, value: string): Promise<object> => {
    return new Promise(() => {
      client.query({
        query,
        variables: {
          search: value,
          from: 0,
          size: 24,
          page: 1,
        },
        fetchPolicy: 'network-only',
      });
    });
  };

export default runNetworkQuery;
