// src/queries/jobApplicationsQuery.js
import { gql } from "@apollo/client";

export const GET_JOB_APPLICATIONS = gql`
  query GetJobApplications(
    $jobId: ID!
    $skills: [String]
    $location: String
    $jobTitle: String
    $jobRole: String
    $jobTypes: [String]
    $salaryMin: Float
    $salaryMax: Float
    $experienceMin: Int
    $experienceMax: Int
    $degree: String
    $gender: String
    $ageMin: Int
    $ageMax: Int
    $page: Int
    $limit: Int
  ) {
    getJobApplications(
      jobId: $jobId
      skills: $skills
      location: $location
      jobTitle: $jobTitle
      jobRole: $jobRole
      jobTypes: $jobTypes
      salaryMin: $salaryMin
      salaryMax: $salaryMax
      experienceMin: $experienceMin
      experienceMax: $experienceMax
      degree: $degree
      gender: $gender
      ageMin: $ageMin
      ageMax: $ageMax
      page: $page
      limit: $limit
    ) {
      success
      message
      currentPage
      totalPages
      totalApplications
      jobApplications {
        id
        fullName
        email
        jobTitle
        location
        experience
        degree
        gender
        age
        currentSalary
        expectedSalary
        matchedSkills
        unmatchedSkills
        skills
        profilePic
        resume
        board
        medium
        mode
        appliedAt
        status
        answers {
          questionId
          questionText
          answer
        }
      }
    }
  }
`;

// jobRole
// salary
