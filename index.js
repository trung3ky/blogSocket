const io = require('socket.io')(8900,{
    cors: {
        origin: 'https://localhost:3000'
    }
})
const rooms = {}
const users = {}
io.on('connection', (socket) => {
    socket.on('user-connected', function(data) {
        users[data] = socket.id
    })

    socket.on('create-room-like', data => {
        if(rooms[`room-like-${data.idPost}`]) return 
        rooms[`room-like-${data.idPost}`] = {
            owner: data.idUser,
            users : []
        }
    })

    socket.on('send-like', data => {
        rooms[`room-like-${data.idBlog}`].users.push(data.idUserLike)
        socket.to(users[rooms[`room-like-${data.idBlog}`].owner]).emit('have-like-owner', {
            idBlog: data.idBlog,
            idUserLike: data.idUserLike
        })

        for(let item in users){   
            socket.to(users[item]).emit('have-like', 'có người like')
        }
        // rooms[`room-like-${data.idBlog}`].users.map(item => {
        //     socket.to(users[item]).emit('have-like', 'có người like')
        // })
        // socket.to(rooms[`room-like-${data.idBlog}`].users).emit('have-like', 'có người like')
    })

    socket.on('remove-like', data => {
        socket.to(users[rooms[`room-like-${data.idBlog}`].owner]).emit('remove-like-owner', 'owner: có người rời')
        rooms[`room-like-${data.idBlog}`].users.map((item, index) => {
            if(item === data.idUserLike){
                rooms[`room-like-${data.idBlog}`].users.splice(index, 1)
            }
        })
        for(let item in users){
            socket.to(users[item]).emit('cancel-like', 'có người bỏ like')   
        }

        // if(rooms[`room-like- {data.idBlog}`].users[socket.id]){
        // delete rooms[`room-like-${data.idBlog}`].users[socket.id]
        // socket.broadcast.emit('cancel-like', 'có người like')
        // console.log(rooms)
        // }
    })


    // socket.on('disconnect', () => {
    //     console.log('disconnect')
    // })
})
