import gql from 'graphql-tag';

export const objectsQuery = gql`
  query Object($size: Int! $page: Int!) {
    objects(size: $size, page: $page) @rest(type: "Object", path: "object?size={args.size}&page={args.page}") {
      records
    }
  }
`;

export const singleObjectQuery = gql`
  query SingleObject($id: String!) {
    object(id: $id) @rest(type: "SingleObject", path: "object/{args.id}") {
      record
    }
  }
`;
