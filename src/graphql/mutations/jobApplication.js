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
