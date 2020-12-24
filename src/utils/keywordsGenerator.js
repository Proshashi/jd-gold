export function keywordsGenerator(text) {
  let arr = [];
  let str = "";
  text
    .toLowerCase()
    .split("")
    .forEach((keyword) => {
      str += keyword;
      arr.push(str);
    });
  const finalArray = [...arr, " "];
  return finalArray;
}
