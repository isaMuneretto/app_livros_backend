//importando o framework express
const express = require("express");
//importando o framework express.Router
const router = express.Router();

//dados de conexão com o bd
const dbKnex = require("../data/db_config");


//método get ele retorna todas as editoras do banco de dados
router.get("/", async (req, res) => {
    try {
        //para obter as editoras pode-se utilizar .select().orderBy() ou apenas .orderBy()
        const editoras = await dbKnex("editoras").orderBy("id", "desc");
        res.status(200).json(editoras); //retorna statusCode ok e os dados
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e msg
    }
});

//método post é usado para inclusão
router.post("/", async (req, res) => {
    //faz a desestruturação dos dados recebidos no corpo da requisição

    const { nome, cidade, estado, telefone, rua, cep } = req.body;

    //se algum dos campos não foi passado, irá enviar uma mensagem de erro ao retornar
    if (!nome || !cidade || !estado || !telefone || !rua || !cep) {
        res.status(400).json({ msg: "Enviar nome, cidade, estado, telefone, rua e cep da editora." });
        return;
    }
    //caso ocorra algum erro na inclusão, o programa irá capturar(catch) o erro
    try {
        //insert, faz a inserção na tabela editoras(e retorna o id do registro inserido)
        const novo = await dbKnex("editoras").insert({ nome, cidade, estado, telefone, rua, cep });
        res.status(201).json({ id: novo[0] }); //statuscode indica Create
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e msg
    }
});

//método put é usado para alteração. id indica o registro a ser alterado
router.put("/:id", async (req, res) => {
    const id = req.params.id; //
    const { rua } = req.body; //campo a ser alterado
    try {
        //altera o campo rua, no registro cujo id coincidir com o parametro passado
        await dbKnex("editoras").update({ rua }).where({ id });
        res.status(200).json(); //statusCode indica ok
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e msg
    }
});

//método delete é usado para exclusão
router.delete("/:id", async (req, res) => {
    const { id } = req.params; //id do registro a ser excluído
    try {
        await dbKnex("editoras").del().where({ id });
        res.status(200).json(); //statusCode indica Ok
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e msg
    }
});

module.exports = router;

