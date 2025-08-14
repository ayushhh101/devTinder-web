export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An unexpected error occurred.';
  } else if (error.request) {
    return 'Network error. Please check your internet connection.';
  } else {
    return 'Something went wrong. Please try again.';
  }
};
