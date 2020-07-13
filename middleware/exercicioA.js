const exercicioA = function(req, res, next) {
    // valida se os alunos possuiem os atributos necessários
    console.dir(req.body)
    next()
}

module.exports = exercicioA