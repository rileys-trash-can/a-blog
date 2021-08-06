posts = [

    {"id":4,
    "rating":{"+":50,"-":30}},

    {"id":3,
    "rating":{"+":50,"-":990}},
    {"id":1,
    "rating":{"+":50,"-":10}},
    {"id":2,
    "rating":{"+":50,"-":20}},
]

let filterMap = {};
posts.forEach((item, index) => {
  if (!filterMap[item.id] || filterMap[item.id].rating < ( posts.rating["+"] - posts.rating["-"]) ) {
    // calc item rating:
    let newitem = item
    newitem.rating = item.rating["+"] - item.rating["-"]
    filterMap[item.id] = newitem;
  }
})

let result = [];

for (let id in filterMap) {
  result.push(filterMap[id]);
}
result.sort((a , b) => {
   return b.rating - a.rating;
});
let sorted = []
result.forEach((elem, i) => {
    sorted.push(elem.id)
})

console.log(sorted)