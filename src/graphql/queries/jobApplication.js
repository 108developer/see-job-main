// src/queries/jobApplicationsQuery.js
import { gql } from "@apollo/client";

export const GET_JOB_APPLICATIONS = gql`
  query GetJobApplications(
    $recruiterId: ID
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
    $status: String
    $page: Int
    $limit: Int
  ) {
    getJobApplications(
      recruiterId: $recruiterId
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
      status: $status
      page: $page
      limit: $limit
    ) {
      success
      message
      currentPage
      totalPages
      totalApplications
      viewedCount
      shortlistedCount
      rejectedCount
      holdCount
      jobApplications {
        id
        candidateId
        fullName
        email
        phone
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
        numberOfRecruitersShortlisted
      }
    }
  }
`;

// jobRole
// salary
