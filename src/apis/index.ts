export const getData = async () => {
  const response = await fetch('./src/data/mock_data.json');
  const { response: data } = await response.json();

  return data;
};
