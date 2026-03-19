export const FALLBACK_CROP_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAABGdS8pAAAAG1BMVEUAAAD///////////////////////////////+Nj4xxAAAACHRSTlMAgK8Jm1pK+Lq5f3YAAAGxSURBVHja7dixDoMwEETRzP//p5m2i0sQYQWJp0vS0p0j6xQyZQGx9oRr6dFJ4x2h2y5d1nqKpQAAAAAAAAAAAAAAAAAAAHgB2Eiv3zvU7J2b6Yd1fU5pU2c2xN3bV4vWm0P2lD6s8F4o2l7j2c9P+4b+o1mGx6lXQ4r1tGzUo4zGq3n8m7q8p3o6p3j4x3b9fGq6dY5b7V7W1F8mU8d6k2Vd2b3bK5xw9Y0t6g1n3G2r2r2a9g7y8W2b6vY6PZ5c0b0p+q1q4g8n5o7e2s6x2Xz5g+4q8s1Q2Q0w2wQ9X7t0Xxv0d8w3k7Z6t7s6m6J9vXvFJw8u8V8d7S7b9l5u9r5V8m8X7r7p5g5b5h5Z5o7o8Y9b9m9n+7v3m0p7tPq5fQ9bV5ZrV9fF3i3m8i9k8X7l7T7p6k6d5b6b7s8m7o9u+Qw0g5o9H5y4AAAAAAAAAAAAAAAAAAAAAAAB4fQz+AtR2j4m6X7gAAAAASUVORK5CYII=";

export const getCropImageUrl = (crop) => {
  if (crop?.image) return crop.image;
  const name = crop?.name || crop?.cropName || "farm produce";
  return `https://source.unsplash.com/featured/?${encodeURIComponent(name)}`;
};
