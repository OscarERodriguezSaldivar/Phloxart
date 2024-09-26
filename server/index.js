const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


app.use(cors());


app.use(express.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'front', 'public', 'img')); // Ruta absoluta a la carpeta 'img'
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para la imagen
    }
  });
  const upload = multer({ storage: storage });


const db = mysql.createConnection({
    host: "",
    user: "",
    port: "",
    password: "",
    database: ""
});


db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});


app.post("/create", (req, resp) => {
    const usu = req.body.user;
    const correo = req.body.email;
    const pass = req.body.pass;
    db.query('insert into users(nomUser,correoUser,passUser) VALUES(?,?,?)',
        [usu, correo, pass],
        (err, data) => {
            if (err) {
                console.error('Error al insertar datos:', err);
                resp.status(500).send("Error al insertar datos");
            } else {
                resp.send("Informacion insertada");
            }
        }
    )
});


app.post("/login", (req, resp) => {
    const usuario = req.body.usuario;
    const pass = req.body.pass;

    
        db.query('SELECT * FROM users WHERE nomUser = ? AND passUser = ?', [usuario, pass], (err, result) => {

        if (err) {
            console.error('Error al realizar la consulta:', err);
            resp.status(500).send({ success: false, error: "Error al iniciar sesión" });
        } else {
            if (result.length > 0) {
                resp.status(200).json({
                    success: true,
                    message: "Inicio de sesión exitoso",
                    usuario: {
                        usuario: result[0].nomUser
                    }
                });

            } else {
                resp.status(401).send({ success: false, message: "Credenciales incorrectas" });
            }
        }
    });
});


app.post("/informacion-adicional", upload.single('foto'), (req, resp) => {
    const correo = req.body.email;
    const apellidoPaterno = req.body.apellidoPaterno;
    const apellidoMaterno = req.body.apellidoMaterno;
    const nombres = req.body.nombres;
    const edad = req.body.edad;
    const descripcion = req.body.descripcion;
    const area = req.body.area;
    const fotoName = req.file ? req.file.filename : null; 
    const sqlQuery = 'UPDATE users SET apellidoM_Users = ?, apellidoP_Users = ?, nombres_Users = ?, edad_Users = ?, foto_Users = ?, descripcion_Users = ?, area_Users = ? WHERE correoUser = ?';
    db.query(
      sqlQuery,
      [apellidoMaterno, apellidoPaterno, nombres, edad, fotoName, descripcion, area, correo],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar datos:', err);
          resp.status(500).send("Error al actualizar datos");
        } else {
          resp.send("Información adicional actualizada correctamente");
        }
      }
    );
  });


app.get("/obtener-informacion-usuario/:nombreUsuario", (req, res) => {
    const nombreUsuario = req.params.nombreUsuario;
    db.query('SELECT * FROM users WHERE nomUser = ?', [nombreUsuario], (err, result) => {
        if (err) {
            console.error('Error al obtener la información del usuario:', err);
            res.status(500).send("Error al obtener la información del usuario");
        } else {
            
            if (result.length > 0) {
                res.send(result[0]); 
            } else {
                res.status(404).send("Usuario no encontrado");
            }
        }
    });
});

app.get("/categorias", (req, res) => {
    db.query('SELECT * FROM categoria', (err, result) => {
        if (err) {
            console.error('Error al obtener las categorías:', err);
            res.status(500).send("Error al obtener las categorías");
        } else {
            res.json(result); // Envía las categorías en formato JSON
        }
    });
});

app.post("/crear-publicacion", upload.single('post_foto'), (req, resp) => {
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);

    const { post_titulo, post_descripcion, post_usuarioid, post_categoriaid } = req.body;
    const post_foto = req.file ? req.file.filename : null; 

    console.log('Valores a insertar en la base de datos:');
    console.log('post_titulo:', post_titulo);
    console.log('post_descripcion:', post_descripcion);
    console.log('post_usuarioid:', post_usuarioid);
    console.log('post_categoriaid:', post_categoriaid);
    console.log('post_foto:', post_foto);

    const sqlQuery = 'INSERT INTO publicacion (post_titulo, post_descripcion, post_foto, post_usuarioid, post_categoriaid) VALUES (?, ?, ?, ?, ?)';
    
    db.query(
        sqlQuery,
        [post_titulo, post_descripcion, post_foto, post_usuarioid, post_categoriaid],
        (err, result) => {
            if (err) {
                console.error('Error al insertar la publicación:', err);
                resp.status(500).send("Error al insertar la publicación");
            } else {
                resp.send("Publicación creada correctamente");
            }
        }
    );
});


// Obtener todas las publicaciones con el nombre del usuario que las hizo
app.get("/publicaciones", (req, res) => {
    db.query('SELECT p.post_id, p.post_titulo, p.post_descripcion, p.post_foto, p.post_usuarioid, p.post_categoriaid, u.nomUser AS nombre_usuario, c.categoria_nombre AS nombre_categoria FROM publicacion p JOIN users u ON p.post_usuarioid = u.ID_User JOIN categoria c ON p.post_categoriaid = c.categoria_id', (err, result) => {
        if (err) {
            console.error('Error al obtener las publicaciones:', err);
            res.status(500).send("Error al obtener las publicaciones");
        } else {
            res.json(result); // Envía las publicaciones en formato JSON con el nombre del usuario y de la categoría
        }
    });
});

// Endpoint para borrar una publicación
app.delete("/borrar-publicacion/:postId", (req, res) => {
    const postId = req.params.postId; // Obtén el ID de la publicación de los parámetros de la solicitud
    
    // Ejecuta la consulta SQL para eliminar la publicación con el ID especificado
    db.query('DELETE FROM publicacion WHERE post_id = ?', [postId], (err, result) => {
        if (err) {
            console.error('Error al borrar la publicación:', err);
            res.status(500).send("Error al borrar la publicación");
        } else {
            res.send("Publicación borrada correctamente");
        }
    });
});

app.post("/comentar-publicacion/:postId", (req, res) => {
    const postId = req.params.postId; // Obtén el ID de la publicación de los parámetros de la solicitud
    const { comment } = req.body; // Obtén el texto del comentario del cuerpo de la solicitud
    const userId = req.body.userId // Supongamos que aquí obtienes el ID del usuario actualmente autenticado
    
    // Aquí debes realizar la lógica para guardar el comentario en la base de datos
    // Debes insertar el comentario en la tabla correspondiente, vinculado al ID del usuario y al ID de la publicación
    
    // Ejemplo de consulta SQL para insertar el comentario en la base de datos
    const sqlQuery = 'INSERT INTO comentario (coment_texto, coment_usuario, coment_publicacion) VALUES (?, ?, ?)';
    db.query(sqlQuery, [comment, userId, postId], (err, result) => {
        if (err) {
            console.error('Error al guardar el comentario en la base de datos:', err);
            res.status(500).send("Error al guardar el comentario en la base de datos");
        } else {
            res.send("Comentario guardado correctamente");
        }
    });
});

app.get("/obtener-comentarios-publicacion/:postId", (req, res) => {
    const postId = req.params.postId; // Obtén el ID de la publicación de los parámetros de la solicitud
    
    // Realiza la consulta SQL para obtener los comentarios de la publicación
    const sqlQuery = 'SELECT * FROM comentario WHERE coment_publicacion = ?';
    db.query(sqlQuery, [postId], (err, results) => {
        if (err) {
            console.error('Error al obtener los comentarios de la publicación:', err);
            res.status(500).send("Error al obtener los comentarios de la publicación");
        } else {
            res.json(results); // Envia los comentarios como respuesta en formato JSON
        }
    });
});

app.post("/guardar-valoracion", (req, res) => {
    const { valoracion, userId, postId } = req.body; // Obtén la valoración, el ID del usuario y el ID de la publicación desde el cuerpo de la solicitud
    
    // Aquí debes realizar la lógica para guardar la valoración en la base de datos
    // Debes insertar la valoración en la tabla correspondiente, vinculada al ID del usuario y al ID de la publicación
    
    // Ejemplo de consulta SQL para insertar la valoración en la base de datos
    const sqlQuery = 'INSERT INTO valoracion (valoracion, valoracion_usuario, valoracion_publicacion) VALUES (?, ?, ?)';
    db.query(sqlQuery, [valoracion, userId, postId], (err, result) => {
        if (err) {
            console.error('Error al guardar la valoración en la base de datos:', err);
            res.status(500).send("Error al guardar la valoración en la base de datos");
        } else {
            res.send("Valoración guardada correctamente");
        }
    });
});


app.get("/obtener-promedio-valoracion-publicacion/:postId", (req, res) => {
    const postId = req.params.postId;
    db.query('SELECT AVG(valoracion) AS promedio FROM valoracion WHERE valoracion_publicacion = ?', [postId], (err, result) => {
        if (err) {
            console.error('Error al obtener el promedio de la valoración:', err);
            res.status(500).send("Error al obtener el promedio de la valoración");
        } else {
            const promedio = result[0].promedio || 0; // Si no hay valoraciones, el promedio es 0
            res.json({ promedio }); // Envia el promedio como respuesta en formato JSON
        }
    });
});

app.delete("/borrar-comentario/:comentarioId", (req, res) => {
    const comentarioId = req.params.comentarioId; // Obtén el ID del comentario de los parámetros de la solicitud

    // Ejecuta la consulta SQL para eliminar el comentario con el ID especificado
    db.query('DELETE FROM comentario WHERE comentario_id = ?', [comentarioId], (err, result) => {
        if (err) {
            console.error('Error al borrar el comentario:', err);
            res.status(500).send("Error al borrar el comentario");
        } else {
            res.send("Comentario borrado correctamente");
        }
    });
});

// Ruta para editar un comentario
app.put("/editar-comentario/:comentarioId", (req, res) => {
    const comentarioId = req.params.comentarioId; // Obtén el ID del comentario de los parámetros de la solicitud
    const nuevoTexto = req.body.text; // Obtén el nuevo texto del comentario del cuerpo de la solicitud
    console.log(req);
    // Ejecuta la consulta SQL para actualizar el texto del comentario con el ID especificado
    db.query('UPDATE comentario SET coment_texto=? WHERE comentario_id=?', [nuevoTexto, comentarioId], (err, result) => {
        if (err) {
            console.error('Error al editar el comentario:', err);
            res.status(500).send("Error al editar el comentario");
        } else {
            res.send("Comentario editado correctamente");
        }
    });
});





// Puerto en el que escucha el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
