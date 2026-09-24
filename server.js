const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando!");
});

app.get("/equipamentos", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));
    res.json(dados);
});

app.get("/equipamentos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const equipamento = dados.find(item => item.id == req.params.id);

    if (!equipamento) {
        return res.status(404).json({
            mensagem: "Equipamento não encontrado"
        });
    }

    res.json(equipamento);
});

app.get("/equipamentos/busca/equipamento/:nome", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const resultado = dados.filter(item =>
        item.equipamento.toLowerCase() == req.params.nome.toLowerCase()
    );

    res.json(resultado);
});

app.get("/equipamentos/busca/local/:local", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const resultado = dados.filter(item =>
        item.local.toLowerCase() == req.params.local.toLowerCase()
    );

    res.json(resultado);
});

app.post("/equipamentos", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json", "utf8"));

    const novoEquipamento = {
        id: dados.length + 1,
        local: req.body.local,
        equipamento: req.body.equipamento,
        consumo_kwh: req.body.consumo_kwh,
        mes_referencia: req.body.mes_referencia,
        status: req.body.status
    };

    dados.push(novoEquipamento);

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 4),
        "utf8"
    );

    res.status(201).json(novoEquipamento);
});

app.delete("/equipamentos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const indice = dados.findIndex(item => item.id == req.params.id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Equipamento não encontrado"
        });
    }

    const removido = dados.splice(indice, 1);

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 4)
    );

    res.json({
        mensagem: "Equipamento excluído com sucesso",
        equipamento: removido[0]
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");

app.put("/equipamentos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const indice = dados.findIndex(item => item.id == req.params.id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "equipamento não encontrado"
        });
    }

    dados[indice] = {
        id: dados[indice].id,
        local: req.body.local,
        equipamento: req.body.equipamento,
        consumo_kwh: req.body.consumo_kwh,
        mes_referencia: req.body.mes_referencia,
        status: req.body.status
    };

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 4)
    );

    res.json(dados[indice]);
});
});