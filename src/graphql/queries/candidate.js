import { gql } from "@apollo/client";

export const GET_ALL_CANDIDATES = gql`
  query GetAllCandidates(
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
  ) {
    getAllCandidates(
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
    ) {
      success
      message
      currentPage
      totalPages
      totalCandidates
      candidates {
        id
        name
        email
        jobTitle
        jobRole
        location
        salary
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
      }
    }
  }
`;
