import gql from 'graphql-tag';

const publicationQuery = gql`
  query($year: String, $page: ID, $size: ID) {
    publicationData(year: $year, page: $page, size: $size)
    @rest(type: "Publications", path: "publications?size={args.size}&page={args.page}&year={args.year}") {
      publications
    }
  }
`;

export default publicationQuery;
