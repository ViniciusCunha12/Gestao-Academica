require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// BANCO DE DADOS


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao MySQL:", erro);
        return;
    }

    console.log("MySQL conectado com sucesso!");
});


// ROTA PRINCIPAL


app.get("/", (req, res) => {
    res.json({
        mensagem: "Sistema de Gestão Acadêmica funcionando!"
    });
});



// ALUNOS


// GET - Listar todos os alunos
app.get("/alunos", (req, res) => {

    const sql = `
        SELECT
            alunos.id,
            alunos.nome,
            alunos.cpf,
            alunos.email,
            alunos.data_nascimento,
            alunos.curso_id,
            cursos.nome AS curso_nome,
            cursos.codigo AS curso_codigo
        FROM alunos
        LEFT JOIN cursos
            ON alunos.curso_id = cursos.id
        ORDER BY alunos.id
    `;

    db.query(sql, (erro, resultados) => {

        if (erro) {
            console.error("Erro ao buscar alunos:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar alunos"
            });
        }

        res.json(resultados);
    });
});


// GET - Buscar aluno por ID
app.get("/alunos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            alunos.id,
            alunos.nome,
            alunos.cpf,
            alunos.email,
            alunos.data_nascimento,
            alunos.curso_id,
            cursos.nome AS curso_nome,
            cursos.codigo AS curso_codigo
        FROM alunos
        LEFT JOIN cursos
            ON alunos.curso_id = cursos.id
        WHERE alunos.id = ?
    `;

    db.query(sql, [id], (erro, resultados) => {

        if (erro) {
            console.error("Erro ao buscar aluno:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar aluno"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json(resultados[0]);
    });
});


// POST - Cadastrar aluno
app.post("/alunos", (req, res) => {

    const {
        nome,
        cpf,
        email,
        data_nascimento,
        curso_id
    } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: "Nome é obrigatório."
        });
    }

    const sql = `
        INSERT INTO alunos
        (nome, cpf, email, data_nascimento, curso_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nome,
            cpf || null,
            email || null,
            data_nascimento || null,
            curso_id || null
        ],
        (erro, resultado) => {

            if (erro) {

                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        erro: "CPF já cadastrado."
                    });
                }

                console.error("Erro ao cadastrar aluno:", erro);

                return res.status(500).json({
                    erro: "Erro ao cadastrar aluno"
                });
            }

            res.status(201).json({
                mensagem: "Aluno cadastrado com sucesso!",
                id: resultado.insertId
            });
        }
    );
});


// PUT - Atualizar aluno
app.put("/alunos/:id", (req, res) => {

    const { id } = req.params;

    const {
        nome,
        cpf,
        email,
        data_nascimento,
        curso_id
    } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: "Nome é obrigatório."
        });
    }

    const sql = `
        UPDATE alunos
        SET
            nome = ?,
            cpf = ?,
            email = ?,
            data_nascimento = ?,
            curso_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            nome,
            cpf || null,
            email || null,
            data_nascimento || null,
            curso_id || null,
            id
        ],
        (erro, resultado) => {

            if (erro) {

                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        erro: "CPF já cadastrado."
                    });
                }

                console.error("Erro ao atualizar aluno:", erro);

                return res.status(500).json({
                    erro: "Erro ao atualizar aluno"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Aluno não encontrado"
                });
            }

            res.json({
                mensagem: "Aluno atualizado com sucesso!"
            });
        }
    );
});


// DELETE - Excluir aluno
app.delete("/alunos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM alunos
        WHERE id = ?
    `;

    db.query(sql, [id], (erro, resultado) => {

        if (erro) {
            console.error("Erro ao excluir aluno:", erro);

            return res.status(500).json({
                erro: "Erro ao excluir aluno"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json({
            mensagem: "Aluno excluído com sucesso!"
        });
    });
});



// CURSOS



// GET - Listar todos os cursos
app.get("/cursos", (req, res) => {

    const sql = `
        SELECT *
        FROM cursos
        ORDER BY id
    `;

    db.query(sql, (erro, resultados) => {

        if (erro) {
            console.error("Erro ao buscar cursos:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar cursos"
            });
        }

        res.json(resultados);
    });
});


// GET - Buscar curso por ID
app.get("/cursos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM cursos
        WHERE id = ?
    `;

    db.query(sql, [id], (erro, resultados) => {

        if (erro) {
            console.error("Erro ao buscar curso:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar curso"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Curso não encontrado"
            });
        }

        res.json(resultados[0]);
    });
});


// POST - Cadastrar curso
app.post("/cursos", (req, res) => {

    const {
        nome,
        codigo,
        duracao_semestres,
        modalidade
    } = req.body;

    if (!nome || !codigo || !duracao_semestres) {
        return res.status(400).json({
            erro: "Nome, código e duração são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO cursos
        (nome, codigo, duracao_semestres, modalidade)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nome,
            codigo,
            duracao_semestres,
            modalidade || null
        ],
        (erro, resultado) => {

            if (erro) {

                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        erro: "Já existe um curso com esse código."
                    });
                }

                console.error("Erro ao cadastrar curso:", erro);

                return res.status(500).json({
                    erro: "Erro ao cadastrar curso"
                });
            }

            res.status(201).json({
                mensagem: "Curso cadastrado com sucesso!",
                id: resultado.insertId
            });
        }
    );
});


// PUT - Atualizar curso
app.put("/cursos/:id", (req, res) => {

    const { id } = req.params;

    const {
        nome,
        codigo,
        duracao_semestres,
        modalidade
    } = req.body;

    if (!nome || !codigo || !duracao_semestres) {
        return res.status(400).json({
            erro: "Nome, código e duração são obrigatórios."
        });
    }

    const sql = `
        UPDATE cursos
        SET
            nome = ?,
            codigo = ?,
            duracao_semestres = ?,
            modalidade = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            nome,
            codigo,
            duracao_semestres,
            modalidade || null,
            id
        ],
        (erro, resultado) => {

            if (erro) {

                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        erro: "Já existe outro curso com esse código."
                    });
                }

                console.error("Erro ao atualizar curso:", erro);

                return res.status(500).json({
                    erro: "Erro ao atualizar curso"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Curso não encontrado"
                });
            }

            res.json({
                mensagem: "Curso atualizado com sucesso!"
            });
        }
    );
});


// DELETE - Excluir curso
app.delete("/cursos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM cursos
        WHERE id = ?
    `;

    db.query(sql, [id], (erro, resultado) => {

        if (erro) {
            console.error("Erro ao excluir curso:", erro);

            return res.status(500).json({
                erro: "Erro ao excluir curso"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Curso não encontrado"
            });
        }

        res.json({
            mensagem: "Curso excluído com sucesso!"
        });
    });
});


// DISCIPLINAS


// GET - Listar todas as disciplinas
app.get("/disciplinas", (req, res) => {

    const sql = `
        SELECT
            disciplinas.id,
            disciplinas.nome,
            disciplinas.codigo,
            disciplinas.carga_horaria,
            disciplinas.curso_id,
            cursos.nome AS curso_nome,
            cursos.codigo AS curso_codigo
        FROM disciplinas
        INNER JOIN cursos
            ON disciplinas.curso_id = cursos.id
        ORDER BY disciplinas.id
    `;

    db.query(sql, (erro, resultados) => {

        if (erro) {
            console.error("Erro ao buscar disciplinas:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar disciplinas"
            });
        }

        res.json(resultados);
    });
});


// GET - Buscar disciplina por ID
app.get("/disciplinas/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            disciplinas.id,
            disciplinas.nome,
            disciplinas.codigo,
            disciplinas.carga_horaria,
            disciplinas.curso_id,
            cursos.nome AS curso_nome,
            cursos.codigo AS curso_codigo
        FROM disciplinas
        INNER JOIN cursos
            ON disciplinas.curso_id = cursos.id
        WHERE disciplinas.id = ?
    `;

    db.query(sql, [id], (erro, resultados) => {

        if (erro) {
            console.error("Erro ao buscar disciplina:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar disciplina"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Disciplina não encontrada"
            });
        }

        res.json(resultados[0]);
    });
});


// POST - Cadastrar disciplina
app.post("/disciplinas", (req, res) => {

    const {
        nome,
        codigo,
        carga_horaria,
        curso_id
    } = req.body;

    if (!nome || !codigo || !carga_horaria || !curso_id) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO disciplinas
        (nome, codigo, carga_horaria, curso_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nome,
            codigo,
            carga_horaria,
            curso_id
        ],
        (erro, resultado) => {

            if (erro) {

                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        erro: "Já existe uma disciplina com esse código."
                    });
                }

                console.error("Erro ao cadastrar disciplina:", erro);

                return res.status(500).json({
                    erro: "Erro ao cadastrar disciplina"
                });
            }

            res.status(201).json({
                mensagem: "Disciplina cadastrada com sucesso!",
                id: resultado.insertId
            });
        }
    );
});


// PUT - Atualizar disciplina
app.put("/disciplinas/:id", (req, res) => {

    const { id } = req.params;

    const {
        nome,
        codigo,
        carga_horaria,
        curso_id
    } = req.body;

    if (!nome || !codigo || !carga_horaria || !curso_id) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql = `
        UPDATE disciplinas
        SET
            nome = ?,
            codigo = ?,
            carga_horaria = ?,
            curso_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            nome,
            codigo,
            carga_horaria,
            curso_id,
            id
        ],
        (erro, resultado) => {

            if (erro) {

                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        erro: "Já existe outra disciplina com esse código."
                    });
                }

                console.error("Erro ao atualizar disciplina:", erro);

                return res.status(500).json({
                    erro: "Erro ao atualizar disciplina"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Disciplina não encontrada"
                });
            }

            res.json({
                mensagem: "Disciplina atualizada com sucesso!"
            });
        }
    );
});


// DELETE - Excluir disciplina
app.delete("/disciplinas/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM disciplinas
        WHERE id = ?
    `;

    db.query(sql, [id], (erro, resultado) => {

        if (erro) {
            console.error("Erro ao excluir disciplina:", erro);

            return res.status(500).json({
                erro: "Erro ao excluir disciplina"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Disciplina não encontrada"
            });
        }

        res.json({
            mensagem: "Disciplina excluída com sucesso!"
        });
    });
});

// DASHBOARD


app.get("/dashboard", (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM alunos) AS total_alunos,
            (SELECT COUNT(*) FROM cursos) AS total_cursos,
            (SELECT COUNT(*) FROM disciplinas) AS total_disciplinas
    `;

    db.query(sql, (erro, resultados) => {

        if (erro) {
            console.error("Erro ao carregar dashboard:", erro);

            return res.status(500).json({
                erro: "Erro ao carregar dashboard"
            });
        }

        res.json(resultados[0]);
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});