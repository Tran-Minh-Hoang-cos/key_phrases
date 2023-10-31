/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTranEcho = /* GraphQL */ `
  mutation CreateTranEcho(
    $input: CreateTranEchoInput!
    $condition: ModelTranEchoConditionInput
  ) {
    createTranEcho(input: $input, condition: $condition) {
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
export const updateTranEcho = /* GraphQL */ `
  mutation UpdateTranEcho(
    $input: UpdateTranEchoInput!
    $condition: ModelTranEchoConditionInput
  ) {
    updateTranEcho(input: $input, condition: $condition) {
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
export const deleteTranEcho = /* GraphQL */ `
  mutation DeleteTranEcho(
    $input: DeleteTranEchoInput!
    $condition: ModelTranEchoConditionInput
  ) {
    deleteTranEcho(input: $input, condition: $condition) {
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
export const createTranSchema = /* GraphQL */ `
  mutation CreateTranSchema(
    $input: CreateTranSchemaInput!
    $condition: ModelTranSchemaConditionInput
  ) {
    createTranSchema(input: $input, condition: $condition) {
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
export const updateTranSchema = /* GraphQL */ `
  mutation UpdateTranSchema(
    $input: UpdateTranSchemaInput!
    $condition: ModelTranSchemaConditionInput
  ) {
    updateTranSchema(input: $input, condition: $condition) {
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
export const deleteTranSchema = /* GraphQL */ `
  mutation DeleteTranSchema(
    $input: DeleteTranSchemaInput!
    $condition: ModelTranSchemaConditionInput
  ) {
    deleteTranSchema(input: $input, condition: $condition) {
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
