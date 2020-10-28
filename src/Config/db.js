const mongodb=require('mongoose');

exports.Connect=()=>{
  const connection=mongodb.connect(process.env.MONGODB,
        {useCreateIndex:true,
        useNewUrlParser:true,
        useFindAndModify:true,
    useUnifiedTopology:true})
    .then(()=>console.log(`ket noi database`))
    .catch(err=>{console.log(`ket noi database ${err}`)})
}