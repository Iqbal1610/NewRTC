const express=require('express.io');
var app=express();
app.http().io();
var PORT=3000;
console.log('Server Started on PORT'+PORT);
app.use(express.static(__dirname+'/public'));

app.get('/',function(req,res){
  res.render('index.ejs');
});

app.io.route('ready',function(req){
  req.io.join(req.data.chat_room);
  req.io.join(req.data.signal_room);
  app.io.room(req.data).broadcast('announce',{
    message:'New client in the '+req.data+'room'
  })
})

app.io.route('send',function(req){
  app.io.room(req.data.room).broadcast('message',{
    message:req.data.message,
    author:req.data.author
  })
})

app.io.route('signal',function(req){
  //note the use of req here for broadcasting so only the sender doesnt receive their own messages
req.io.room(req.data.room).broadcast('signaling_message',{
  type:req.data.type,
  message:req.data.message
})
})
app.listen(PORT);
