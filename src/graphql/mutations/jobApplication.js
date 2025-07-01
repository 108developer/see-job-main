// src/queries/jobApplicationsQuery.js
import { gql } from "@apollo/client";

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus(
    $applicationId: ID!
    $status: String!
    $recruiterId: ID!
  ) {
    updateJobApplicationStatus(
      applicationId: $applicationId
      status: $status
      recruiterId: $recruiterId
    ) {
      success
      message
    }
  }
`;

export const BULK_UPDATE_JOB_APPLICATION_STATUS = gql`
  mutation BulkUpdateJobApplicationStatus(
    $applicationIds: [ID!]
    $status: String!
    $recruiterId: ID!
  ) {
    bulkUpdateJobApplicationStatus(
      applicationIds: $applicationIds
      status: $status
      recruiterId: $recruiterId
    ) {
      success
      message
      updatedCount
    }
  }
`;

export const UPDATE_CANDIDATE_STATUS = gql`
  mutation UpdateCandidateStatus(
    $candidateId: ID!
    $status: String!
    $recruiterId: ID!
  ) {
    updateCandidateStatus(
      candidateId: $candidateId
      status: $status
      recruiterId: $recruiterId
    ) {
      success
      message
    }
  }
`;

export const BULK_UPDATE_CANDIDATE_STATUS = gql`
  mutation BulkUpdateCandidateStatus(
    $candidateIds: [ID!]!
    $status: String!
    $recruiterId: ID!
  ) {
    bulkUpdateCandidateStatus(
      candidateIds: $candidateIds
      status: $status
      recruiterId: $recruiterId
    ) {
      success
      message
      updatedCount
    }
  }
`;
