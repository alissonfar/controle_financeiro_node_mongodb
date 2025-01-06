const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();



const app = express()
const port = 3000
mongoose.connect(process.env.DB_CONNECTION_STRING)
app.use(express.json())

const transacaoSchema = new mongoose.Schema({
    descricao: {
      type: String,
      required: true // Garantir que a descrição seja obrigatória
    },
    data_transacao: {
      type: Date,
      default: Date.now // Define a data atual como padrão se não for fornecida
    },
    valor_total: {
      type: Number,
      required: true // Garantir que o valor total seja obrigatório
    },
    participantes: [{
      nome_participante: {
        type: String,
        required: true
      },
      valor_participante: {
        type: Number,
        required: true // Garantir que o valor do participante seja fornecido
      },
      Status: {
        type: String,
        enum: ['pendente', 'pago_parcial', 'pago_total'],
        default: 'pendente'
      }
    }],
    categoria: {
      type: String,
      required: true // Garantir que a categoria seja fornecida
    },
    metodo_pagamento: {
      type: String,
      required: true // Garantir que o método de pagamento seja fornecido
    },
    status: {
        type: String,
        enum: ['pendente', 'pago_parcial', 'pago_total'],
        default: 'pendente'
    }
  });
  
  // Criando o modelo a partir do schema
  const Transacoes = mongoose.model('Transacoes', transacaoSchema);

app.get('/', async (req, res) => { 
    const transacoes = await Transacoes.find()
    res.send(transacoes)
})


app.post('/', async (req, res) => {
    try {
      const { descricao, valor_total, participantes, categoria, metodo_pagamento, status } = req.body;
  
      // Verificar se os campos obrigatórios foram fornecidos
      if (!descricao || !valor_total || !participantes || !categoria || !metodo_pagamento) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }
  
      // Criando uma nova transação
      const transacao = new Transacoes({
        descricao,
        valor_total,
        participantes,
        categoria,
        metodo_pagamento
      });
  
      // Salvando a transação no banco de dados
      const novaTransacao = await transacao.save();
  
      // Retornando a transação criada como resposta
      return res.status(201).json({
        message: 'Transação criada com sucesso!',
        transacao: novaTransacao
      });
    } catch (error) {
      // Tratamento de erro
      return res.status(500).json({ error: 'Erro ao criar transação.', details: error.message });
    }
  });


app.delete('/:id', async (req, res) => {
    const transacoes = await Transacoes.findByIdAndDelete(req.params.id)
    return res.send(transacoes)

})


app.put('/:id', async (req, res) => {
    const transacoes = await Transacoes.findByIdAndUpdate(req.params.id, req.body, { new: true})
    return res.send(transacoes)
})


app.listen(port, () => {
    console.log('Tudo funcionando nessa caralea.')
})