// src/graphql/queriesFilter.js

import { gql } from "@apollo/client";

// Query for getting locations
export const GET_LOCATIONS = gql`
  query GetLocations($searchTerm: String) {
    locations(searchTerm: $searchTerm) {
      _id
      locality
      city
      state
      country
      pinCode
      fullAddress
    }
  }
`;

export const GET_JOB_TITLES_SEARCH = gql`
  query GetJobTitleSearch($searchTerm: String) {
    jobTitles(searchTerm: $searchTerm) {
      _id
      value
      label
    }
  }
`;

// Query for getting locations
export const GET_CITY_STATE_COUNTRY = gql`
  query GetCityStateCountry($searchTerm: String) {
    cityStateCountry(searchTerm: $searchTerm) {
      _id
      city
      state
      country
    }
  }
`;

// Query for getting industries
export const GET_INDUSTRIES = gql`
  query GetIndustries($searchTerm: String) {
    industries(searchTerm: $searchTerm) {
      _id
      uniqueId
      name
      description
    }
  }
`;

// Query for getting job types
export const GET_JOB_TYPES = gql`
  query GetJobTypes {
    getJobTypes {
      _id
      value
      label
    }
  }
`;

// Query for getting job types
export const GET_JOB_TITLES = gql`
  query GetJobTitles {
    getJobTitle {
      _id
      value
      label
    }
  }
`;

// Query for getting job types
export const GET_JOB_ROLES = gql`
  query GetJobRoles {
    getJobRole {
      _id
      value
      label
    }
  }
`;

// Query for getting job types
export const GET_DEGREES = gql`
  query GetDegrees {
    getDegree {
      _id
      value
      label
    }
  }
`;

// Query for searching all iin one
export const SEARCH_ALL = gql`
  query searchAll($query: String) {
    searchAll(query: $query) {
      _id
      name
      type
    }
  }
`;

// Query for searching skills
export const SEARCH_SKILLS = gql`
  query searchSkills($query: String) {
    searchSkills(query: $query) {
      _id
      name
    }
  }
`;

// Query for searching job titles
export const SEARCH_JOB_TITLES = gql`
  query searchJobTitles($query: String!) {
    searchJobTitles(query: $query) {
      _id
      value
      label
    }
  }
`;

// Query for searching job titles
export const SEARCH_JOB_ROLES = gql`
  query searchJobRoles($query: String!) {
    searchJobRoles(query: $query) {
      _id
      value
      label
    }
  }
`;

// Query for searching degrees
export const SEARCH_DEGREES = gql`
  query searchDegrees($query: String!) {
    searchDegrees(query: $query) {
      _id
      value
      label
    }
  }
`;

// Query for searching mediums
export const SEARCH_MEDIUMS = gql`
  query searchMedium($query: String!) {
    searchMedium(query: $query) {
      _id
      name
    }
  }
`;

// Query for searching percentage ranges
export const SEARCH_PERCENTAGE_RANGES = gql`
  query searchPercentageRange($query: String!) {
    searchPercentageRange(query: $query) {
      _id
      value
      label
    }
  }
`;

// Query for searching job types
export const SEARCH_JOB_TYPES = gql`
  query searchJobTypes($query: String!) {
    searchJobTypes(query: $query) {
      _id
      value
      label
    }
  }
`;
