const { User, Review } = require("../DB_connection");

const postReview = async (req, res) => {
    const { value, description, id_user, review_by } = req.body;
    ////console.log(value,description,id_user);
    try {
        const response = await Review.create({
            value,
            description,
            id_user,
            review_by
        });
        if (response)
            return res.status(200).json({ message: "Reseña creada con éxito", review: response });
        return res.status(400).json({ message: "Error al crear la reseña", error: "No se pudo insertar revise los tipos de datos" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getReviewsById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Review.findAll({
            where: {
                state: true,
                id_user: id
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ['username'] // Relacion con el modelo User
                },
                {
                    model: User,
                    as: "reviewBy",
                    attributes: ['username'] // Relacion con el modelo User
                }
            ]
        });
        if (response.length !== 0) {
            const reviews = response.map(review => {
                return {
                    review_id: review.id,
                    review_to_id: review.id_user,
                    review_to: review.user.username,
                    value: review.value,
                    description: review.description,
                    reviewed_by: review.review_by,
                    reviewed_by_id: review.reviewBy.username
                }
            });
            return res.status(200).json(reviews);
        }
        return res.status(404).json({ message: "Error al obtener reseñas", error: "No hay niguna reseña para el id seleccionado o el usuario no existe" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { value, description } = req.body;
    try {
        const review = await Review.findByPk(id,
            {
                where: {
                    state: true
                }
            });
        if (review) {
            const sucess = await review.update({
                value,
                description,
            });
            if (sucess)
                return res.status(200).json({ status: "Review actualizada!", message: `se actualizo la review  #${id} satisfactoriamente` });
            return res.status(400).json({ status: "Error en la actualizacion", message: `error: ${sucess} ` });
        }
        else
            return res.status(404).json({ status: "Error en la actualizacion", message: "no se encontro el id" });

    } catch (error) {
        return res.status(500).json({ status: "Error desconocido:", message: error.message });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findByPk(id, {
            where: {
                state: true
            }
        }
        );
        if (review) {
            const sucess = await review.update({
                ...review,
                state: false
            });
            if (sucess)
                return res.status(200).json({ status: "Exito en el borrado", message: `Se borro correctamente el Review con id ${id}` });
        }
        return res.status(404).json({ status: "Error en la busqueda", message: `No se encontro el id` });
    } catch (error) {
        return res.status(500).json({ status: "Error desconocido", message: `${error.message}` });
    }
};


module.exports = {
    postReview,
    getReviewsById,
    updateReview,
    deleteReview
};
