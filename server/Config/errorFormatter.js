const errorFormatter = (errors)=>{
let temp = {
errors: {
}
};
  for(const err in errors.errors){
   temp['errors'][err] = errors.errors[err].message;
}
return temp;
}
module.exports = errorFormatter;
