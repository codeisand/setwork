module.exports = function(io, User, _){

    const userDAta = new User();

    io.on('connection', (socket) => {
        socket.on('refresh', (data)=> {
           io.emit('refreshPage', {} ); 
        });


        socket.on('online', (data)=> {
            socket.join(data.room);
            userDAta.EnterRoom(socket.id, data.user, data.room);
            const list = userDAta.GetList(data.room);
            io.emit('UsersOnline', _.uniq(list));
         });


        socket.on('disconnect', ()=> {
            const user = userDAta.RemoveUser(socket.id);
            if(user){
                const userArray = userDAta.GetList(user.room);
                const arr = _.uniq(userArray);
                _.remove(arr, n => n === user.name);
                io.emit('UsersOnline', arr);
            }
        });
    });
}