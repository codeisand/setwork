module.exports = function(io){
    io.on('connection', (socket) => {
        socket.on('join chat', (params)=> {
        //    io.emit('refreshPage', {} ); 
        socket.join(params.room1);
        socket.join(params.room2);
        });

        socket.on('start_typing', (data) => {
            io.to(data.receiver).emit('is_typing', data);
        });

        socket.on('stop_typing', (data) => {
            io.to(data.receiver).emit('hasStop_typing', data);
        });
    });
}