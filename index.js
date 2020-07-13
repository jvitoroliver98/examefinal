const express = require ('express')
const app = express()
const exercicioA = require('./middleware/exercicioA')

const PORT = process.env.PORT || 3333

let Alunos = []

app.use(express.json())
app.use(express.urlencoded())

app.post('/aluno', exercicioA, (req, res) => {
    const erros = validate(req.body)

    if(!erros.length) {
      const aluno = {...req.body, id: +new Date()}
      Alunos.push(aluno)
      return res.send(aluno)
    }

    if (erros.length) {
      return res.status(401).send(erros)
    }
})

app.get('/alunos', (req, res) => {
  return res.send(Alunos)
})

app.get('/alunos/:id' , (req, res) => {
    const { id } = req.params
    const txt = new RegExp(id, 'i')

    const alunoByid = Alunos.find(item => item.id == id)
    const alunoByMatricula = Alunos.find(item => item.matricula == id)
    const alunoByName = Alunos.find(item => item.nome.match(txt))

    if (alunoByid) {
      return res.json(alunoByid)
    }
    if (alunoByMatricula) {
      return res.json(alunoByMatricula)
    }
    if (alunoByName) {
      return res.json(alunoByName)
    }
    return res.status(404).send({ mensagem: 'Não existe Aluno com essa identificação' })
})

app.put('/aluno/:id', (req, res) => {
  const { id } = req.params
  const erros = validate(req.body)
  const aluno = Alunos.find( item => item.id == id)

  if (erros.length) {
    return res.status(401).send(erros)
  }
  if (!aluno) {
    return res.status(404).send({ mensagem: 'Não existe Aluno com este id' })
  }
  if (aluno) {
    const update = { ...aluno, ...req.body }
    const updateAlunos = Alunos.filter(item => item.id != id)
    updateAlunos.push(update)
    Alunos = updateAlunos
    return res.send(update)
  }
})

app.delete('/aluno/:id', (req, res) => {
  const { id } = req.params
  const aluno = Alunos.find( item => item.id == id)

  if (!aluno) {
    return res.status(404).send({ mensagem: 'Não existe Aluno com este id' })
  }

  if (aluno) {
    const updateAlunos = Alunos.filter(item => item.id != id)
    Alunos = updateAlunos
  }
})

const validate = (user) => {
  const erros = []
  const makeMsg =  (field) => (`O campo ${field} não existe no corpo da requisição!'`)
  const requireds = ['nome', 'idade', 'curso', 'matricula']
  requireds.map((item) => {
    if (!user[item]) {
      erros.push({campo:item, mensagem: makeMsg(item)})
    }
  })
  return erros
}

app.listen(PORT, () => {
     console.log ('Servidor ativado')
})
