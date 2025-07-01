import { gql } from "@apollo/client";

export const GET_ALL_CANDIDATES = gql`
  query GetAllCandidates(
    $employerId: ID
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
    $freshness: String
    $page: Int
    $limit: Int
  ) {
    getAllCandidates(
      employerId: $employerId
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
      freshness: $freshness
      page: $page
      limit: $limit
    ) {
      success
      message
      currentPage
      totalPages
      totalCandidates
      totalCount
      viewedCount
      shortlistedCount
      rejectedCount
      holdCount
      allowedResume
      candidates {
        id
        name
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

        recruiterStatus
        updatedAt
      }
    }
  }
`;

// jobRole
// salary
// mode
// medium
