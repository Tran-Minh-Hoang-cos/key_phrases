/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTranEcho = /* GraphQL */ `
  subscription OnCreateTranEcho($filter: ModelSubscriptionTranEchoFilterInput) {
    onCreateTranEcho(filter: $filter) {
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
export const onUpdateTranEcho = /* GraphQL */ `
  subscription OnUpdateTranEcho($filter: ModelSubscriptionTranEchoFilterInput) {
    onUpdateTranEcho(filter: $filter) {
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
export const onDeleteTranEcho = /* GraphQL */ `
  subscription OnDeleteTranEcho($filter: ModelSubscriptionTranEchoFilterInput) {
    onDeleteTranEcho(filter: $filter) {
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
export const onCreateTranSchema = /* GraphQL */ `
  subscription OnCreateTranSchema(
    $filter: ModelSubscriptionTranSchemaFilterInput
  ) {
    onCreateTranSchema(filter: $filter) {
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
export const onUpdateTranSchema = /* GraphQL */ `
  subscription OnUpdateTranSchema(
    $filter: ModelSubscriptionTranSchemaFilterInput
  ) {
    onUpdateTranSchema(filter: $filter) {
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
export const onDeleteTranSchema = /* GraphQL */ `
  subscription OnDeleteTranSchema(
    $filter: ModelSubscriptionTranSchemaFilterInput
  ) {
    onDeleteTranSchema(filter: $filter) {
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
export const onCreateTranLoadFile = /* GraphQL */ `
  subscription OnCreateTranLoadFile(
    $filter: ModelSubscriptionTranLoadFileFilterInput
  ) {
    onCreateTranLoadFile(filter: $filter) {
      id
      filename
      document
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTranLoadFile = /* GraphQL */ `
  subscription OnUpdateTranLoadFile(
    $filter: ModelSubscriptionTranLoadFileFilterInput
  ) {
    onUpdateTranLoadFile(filter: $filter) {
      id
      filename
      document
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTranLoadFile = /* GraphQL */ `
  subscription OnDeleteTranLoadFile(
    $filter: ModelSubscriptionTranLoadFileFilterInput
  ) {
    onDeleteTranLoadFile(filter: $filter) {
      id
      filename
      document
      createdAt
      updatedAt
      __typename
    }
  }
`;
