export const FormatImageUrl = baseURL => {
  const baseURLString = new String(baseURL).toString();

  const imageURL = baseURLString.replace('.jpg1', '.jpg?');
  const miniImageURL = imageURL.replace('IMG_', 'mini_IMG_');
  const thumbImageURL = imageURL.replace('IMG_', 'thumb_IMG_');
  return {
    imageURL,
    miniImageURL,
    thumbImageURL,
  };
};
