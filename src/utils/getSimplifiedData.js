export const getSimplifiedData = (value) => {
  let data = [];
  let counter = 1;
  value.forEach((doc) => {
    data.push({
      ...doc.data(),
      id: doc.id,
      sn: counter,
    });
    counter = counter + 1;
  });
  return data;
};
