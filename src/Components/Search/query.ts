import gql from 'graphql-tag';

const searchQuery = gql`
  query($search: String, $from: ID, $size: ID) {
    searchResults(searchQuery: $search, from: $from, size: $size)
    @rest(type: "Search", path: "search?query={args.searchQuery}&size={args.size}&from={args.from}") {
      results
    }
  }
`;

export default searchQuery;
