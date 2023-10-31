/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const echo = /* GraphQL */ `
  query Echo($msg: String) {
    echo(msg: $msg)
  }
`;
export const getTranEcho = /* GraphQL */ `
  query GetTranEcho($id: ID!) {
    getTranEcho(id: $id) {
      id
      message
      transchema {
        id
        name
        msg
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      tranSchemaEchoesId
      __typename
    }
  }
`;
export const listTranEchos = /* GraphQL */ `
  query ListTranEchos(
    $filter: ModelTranEchoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTranEchos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        message
        createdAt
        updatedAt
        tranSchemaEchoesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTranSchema = /* GraphQL */ `
  query GetTranSchema($id: ID!) {
    getTranSchema(id: $id) {
      id
      name
      msg
      echoes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTranSchemas = /* GraphQL */ `
  query ListTranSchemas(
    $filter: ModelTranSchemaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTranSchemas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        msg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
