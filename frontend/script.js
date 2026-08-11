const API_URL = "http://127.0.0.1:3000";

let alunoEditandoId = null;
let cursoEditandoId = null;
let disciplinaEditandoId = null;



// ELEMENTOS GERAIS


const menuDashboard = document.getElementById("menuDashboard");
const menuAlunos = document.getElementById("menuAlunos");
const menuCursos = document.getElementById("menuCursos");
const menuDisciplinas = document.getElementById("menuDisciplinas");

const areaDashboard = document.getElementById("areaDashboard");
const areaAlunos = document.getElementById("areaAlunos");
const areaCursos = document.getElementById("areaCursos");
const areaDisciplinas = document.getElementById("areaDisciplinas");



// NAVEGAÇÃO


function esconderAreas() {
    areaDashboard.classList.add("escondido");
    areaAlunos.classList.add("escondido");
    areaCursos.classList.add("escondido");
    areaDisciplinas.classList.add("escondido");

    menuDashboard.classList.remove("ativo");
    menuAlunos.classList.remove("ativo");
    menuCursos.classList.remove("ativo");
    menuDisciplinas.classList.remove("ativo");
}


menuDashboard.addEventListener("click", () => {
    esconderAreas();

    areaDashboard.classList.remove("escondido");
    menuDashboard.classList.add("ativo");

    carregarDashboard();
});


menuAlunos.addEventListener("click", () => {
    esconderAreas();

    areaAlunos.classList.remove("escondido");
    menuAlunos.classList.add("ativo");

    carregarAlunos();
});


menuCursos.addEventListener("click", () => {
    esconderAreas();

    areaCursos.classList.remove("escondido");
    menuCursos.classList.add("ativo");

    carregarCursos();
});


menuDisciplinas.addEventListener("click", () => {
    esconderAreas();

    areaDisciplinas.classList.remove("escondido");
    menuDisciplinas.classList.add("ativo");

    carregarDisciplinas();
});


// DASHBOARD

async function carregarDashboard() {
    try {
        const resposta = await fetch(`${API_URL}/dashboard`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("Erro ao carregar dashboard:", dados);
            return;
        }

        document.getElementById("totalAlunos").textContent =
            dados.total_alunos;

        document.getElementById("totalCursos").textContent =
            dados.total_cursos;

        document.getElementById("totalDisciplinas").textContent =
            dados.total_disciplinas;

    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
    }
}

// ALUNOS


const formAluno = document.getElementById("formAluno");
const cadastroAluno = document.getElementById("cadastroAluno");
const btnNovoAluno = document.getElementById("btnNovoAluno");
const btnCancelar = document.getElementById("btnCancelar");


// LISTAR ALUNOS
async function carregarAlunos() {
    try {
        const resposta = await fetch(`${API_URL}/alunos`);
        const alunos = await resposta.json();

        const tabela = document.getElementById("tabelaAlunos");

        tabela.innerHTML = "";

        if (!resposta.ok) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Erro ao carregar alunos.
                    </td>
                </tr>
            `;

            return;
        }

        if (alunos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;

            return;
        }

        alunos.forEach((aluno) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${aluno.id}</td>

                <td>${aluno.nome}</td>

                <td>${aluno.cpf || "-"}</td>

                <td>${aluno.email || "-"}</td>

                <td>${aluno.curso_codigo || "-"}</td>

                <td>
                    <button
                        class="btn-editar"
                        onclick="editarAluno(${aluno.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirAluno(${aluno.id})"
                    >
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar alunos:", erro);
    }
}


// CARREGAR CURSOS NO SELECT DO ALUNO
async function carregarCursosAluno() {
    try {
        const resposta = await fetch(`${API_URL}/cursos`);
        const cursos = await resposta.json();

        const select = document.getElementById("cursoAluno");

        select.innerHTML = `
            <option value="">
                Selecione o curso
            </option>
        `;

        cursos.forEach((curso) => {
            const option = document.createElement("option");

            option.value = curso.id;

            option.textContent =
                `${curso.codigo} - ${curso.nome}`;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error("Erro ao carregar cursos:", erro);
    }
}


// NOVO ALUNO
btnNovoAluno.addEventListener("click", async () => {
    alunoEditandoId = null;

    cadastroAluno.reset();

    await carregarCursosAluno();

    document.querySelector("#formAluno h3").textContent =
        "Novo aluno";

    document.querySelector(
        "#cadastroAluno button[type='submit']"
    ).textContent = "Cadastrar";

    formAluno.classList.remove("escondido");
});


// CANCELAR ALUNO
btnCancelar.addEventListener("click", () => {
    cadastroAluno.reset();

    formAluno.classList.add("escondido");

    alunoEditandoId = null;
});


// EDITAR ALUNO
async function editarAluno(id) {
    try {
        const resposta = await fetch(`${API_URL}/alunos/${id}`);
        const aluno = await resposta.json();

        if (!resposta.ok) {
            alert(
                aluno.mensagem ||
                aluno.erro ||
                "Aluno não encontrado."
            );

            return;
        }

        alunoEditandoId = id;

        await carregarCursosAluno();

        document.getElementById("nome").value =
            aluno.nome || "";

        document.getElementById("cpf").value =
            aluno.cpf || "";

        document.getElementById("email").value =
            aluno.email || "";

        if (aluno.data_nascimento) {
            document.getElementById("data_nascimento").value =
                aluno.data_nascimento.substring(0, 10);
        } else {
            document.getElementById("data_nascimento").value = "";
        }

        document.getElementById("cursoAluno").value =
            aluno.curso_id || "";

        document.querySelector("#formAluno h3").textContent =
            "Editar aluno";

        document.querySelector(
            "#cadastroAluno button[type='submit']"
        ).textContent = "Salvar alterações";

        formAluno.classList.remove("escondido");

    } catch (erro) {
        console.error("Erro ao carregar aluno:", erro);

        alert("Erro ao carregar dados do aluno.");
    }
}


// CADASTRAR OU EDITAR ALUNO
cadastroAluno.addEventListener("submit", async (event) => {
    event.preventDefault();

    const aluno = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim(),
        data_nascimento:
            document.getElementById("data_nascimento").value,
        curso_id:
            document.getElementById("cursoAluno").value
    };

    let url = `${API_URL}/alunos`;
    let metodo = "POST";

    if (alunoEditandoId !== null) {
        url = `${API_URL}/alunos/${alunoEditandoId}`;
        metodo = "PUT";
    }

    try {
        const resposta = await fetch(url, {
            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(aluno)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(
                resultado.erro ||
                resultado.mensagem ||
                "Erro ao salvar aluno."
            );

            return;
        }

        alert(resultado.mensagem);

        cadastroAluno.reset();

        formAluno.classList.add("escondido");

        alunoEditandoId = null;

        carregarAlunos();

    } catch (erro) {
        console.error("Erro ao salvar aluno:", erro);

        alert("Não foi possível salvar o aluno.");
    }
});


// EXCLUIR ALUNO
async function excluirAluno(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este aluno?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/alunos/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(
                resultado.erro ||
                resultado.mensagem ||
                "Erro ao excluir aluno."
            );

            return;
        }

        alert(resultado.mensagem);

        carregarAlunos();

    } catch (erro) {
        console.error("Erro ao excluir aluno:", erro);

        alert("Erro ao excluir aluno.");
    }
}


// ========================================
// CURSOS
// ========================================

const formCurso = document.getElementById("formCurso");
const cadastroCurso = document.getElementById("cadastroCurso");
const btnNovoCurso = document.getElementById("btnNovoCurso");
const btnCancelarCurso =
    document.getElementById("btnCancelarCurso");


// LISTAR CURSOS
async function carregarCursos() {
    try {
        const resposta = await fetch(`${API_URL}/cursos`);
        const cursos = await resposta.json();

        const tabela =
            document.getElementById("tabelaCursos");

        tabela.innerHTML = "";

        if (!resposta.ok) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Erro ao carregar cursos.
                    </td>
                </tr>
            `;

            return;
        }

        if (cursos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Nenhum curso cadastrado.
                    </td>
                </tr>
            `;

            return;
        }

        cursos.forEach((curso) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${curso.id}</td>

                <td>${curso.codigo}</td>

                <td>${curso.nome}</td>

                <td>
                    ${curso.duracao_semestres} semestres
                </td>

                <td>
                    ${curso.modalidade || "-"}
                </td>

                <td>
                    <button
                        class="btn-editar"
                        onclick="editarCurso(${curso.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirCurso(${curso.id})"
                    >
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar cursos:", erro);
    }
}


// NOVO CURSO
btnNovoCurso.addEventListener("click", () => {
    cursoEditandoId = null;

    cadastroCurso.reset();

    document.querySelector("#formCurso h3").textContent =
        "Novo curso";

    document.querySelector(
        "#cadastroCurso button[type='submit']"
    ).textContent = "Cadastrar";

    formCurso.classList.remove("escondido");
});


// CANCELAR CURSO
btnCancelarCurso.addEventListener("click", () => {
    cadastroCurso.reset();

    formCurso.classList.add("escondido");

    cursoEditandoId = null;
});


// EDITAR CURSO
async function editarCurso(id) {
    try {
        const resposta =
            await fetch(`${API_URL}/cursos/${id}`);

        const curso = await resposta.json();

        if (!resposta.ok) {
            alert(
                curso.mensagem ||
                curso.erro ||
                "Curso não encontrado."
            );

            return;
        }

        cursoEditandoId = id;

        document.getElementById("nomeCurso").value =
            curso.nome || "";

        document.getElementById("codigoCurso").value =
            curso.codigo || "";

        document.getElementById("duracaoCurso").value =
            curso.duracao_semestres || "";

        document.getElementById("modalidadeCurso").value =
            curso.modalidade || "";

        document.querySelector("#formCurso h3").textContent =
            "Editar curso";

        document.querySelector(
            "#cadastroCurso button[type='submit']"
        ).textContent = "Salvar alterações";

        formCurso.classList.remove("escondido");

    } catch (erro) {
        console.error("Erro ao carregar curso:", erro);

        alert("Erro ao carregar curso.");
    }
}


// CADASTRAR OU EDITAR CURSO
cadastroCurso.addEventListener("submit", async (event) => {
    event.preventDefault();

    const curso = {
        nome:
            document.getElementById("nomeCurso").value.trim(),

        codigo:
            document.getElementById("codigoCurso").value.trim(),

        duracao_semestres:
            document.getElementById("duracaoCurso").value,

        modalidade:
            document.getElementById("modalidadeCurso").value
    };

    let url = `${API_URL}/cursos`;
    let metodo = "POST";

    if (cursoEditandoId !== null) {
        url = `${API_URL}/cursos/${cursoEditandoId}`;
        metodo = "PUT";
    }

    try {
        const resposta = await fetch(url, {
            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(curso)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(
                resultado.erro ||
                resultado.mensagem ||
                "Erro ao salvar curso."
            );

            return;
        }

        alert(resultado.mensagem);

        cadastroCurso.reset();

        formCurso.classList.add("escondido");

        cursoEditandoId = null;

        carregarCursos();

    } catch (erro) {
        console.error("Erro ao salvar curso:", erro);

        alert("Não foi possível salvar o curso.");
    }
});


// EXCLUIR CURSO
async function excluirCurso(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este curso?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/cursos/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(
                resultado.erro ||
                resultado.mensagem ||
                "Erro ao excluir curso."
            );

            return;
        }

        alert(resultado.mensagem);

        carregarCursos();

    } catch (erro) {
        console.error("Erro ao excluir curso:", erro);

        alert("Erro ao excluir curso.");
    }
}


// ========================================
// DISCIPLINAS
// ========================================

const formDisciplina =
    document.getElementById("formDisciplina");

const cadastroDisciplina =
    document.getElementById("cadastroDisciplina");

const btnNovaDisciplina =
    document.getElementById("btnNovaDisciplina");

const btnCancelarDisciplina =
    document.getElementById("btnCancelarDisciplina");


// LISTAR DISCIPLINAS
async function carregarDisciplinas() {
    try {
        const resposta =
            await fetch(`${API_URL}/disciplinas`);

        const disciplinas =
            await resposta.json();

        const tabela =
            document.getElementById(
                "tabelaDisciplinas"
            );

        tabela.innerHTML = "";

        if (!resposta.ok) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Erro ao carregar disciplinas.
                    </td>
                </tr>
            `;

            return;
        }

        if (disciplinas.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Nenhuma disciplina cadastrada.
                    </td>
                </tr>
            `;

            return;
        }

        disciplinas.forEach((disciplina) => {
            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    ${disciplina.id}
                </td>

                <td>
                    ${disciplina.codigo}
                </td>

                <td>
                    ${disciplina.nome}
                </td>

                <td>
                    ${disciplina.carga_horaria} horas
                </td>

                <td>
                    ${disciplina.curso_nome || "-"}
                </td>

                <td>
                    <button
                        class="btn-editar"
                        onclick="editarDisciplina(${disciplina.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirDisciplina(${disciplina.id})"
                    >
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(
            "Erro ao carregar disciplinas:",
            erro
        );
    }
}


// CARREGAR CURSOS NO SELECT DA DISCIPLINA
async function carregarCursosNoSelect() {
    try {
        const resposta =
            await fetch(`${API_URL}/cursos`);

        const cursos =
            await resposta.json();

        const select =
            document.getElementById(
                "cursoDisciplina"
            );

        select.innerHTML = `
            <option value="">
                Selecione o curso
            </option>
        `;

        cursos.forEach((curso) => {
            const option =
                document.createElement("option");

            option.value = curso.id;

            option.textContent =
                `${curso.codigo} - ${curso.nome}`;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error(
            "Erro ao carregar cursos:",
            erro
        );
    }
}


// NOVA DISCIPLINA
btnNovaDisciplina.addEventListener(
    "click",
    async () => {

        disciplinaEditandoId = null;

        cadastroDisciplina.reset();

        await carregarCursosNoSelect();

        document.querySelector(
            "#formDisciplina h3"
        ).textContent = "Nova disciplina";

        document.querySelector(
            "#cadastroDisciplina button[type='submit']"
        ).textContent = "Cadastrar";

        formDisciplina.classList.remove(
            "escondido"
        );
    }
);


// CANCELAR DISCIPLINA
btnCancelarDisciplina.addEventListener(
    "click",
    () => {

        cadastroDisciplina.reset();

        formDisciplina.classList.add(
            "escondido"
        );

        disciplinaEditandoId = null;
    }
);


// EDITAR DISCIPLINA
async function editarDisciplina(id) {
    try {
        const resposta = await fetch(
            `${API_URL}/disciplinas/${id}`
        );

        const disciplina =
            await resposta.json();

        if (!resposta.ok) {
            alert(
                disciplina.mensagem ||
                disciplina.erro ||
                "Disciplina não encontrada."
            );

            return;
        }

        disciplinaEditandoId = id;

        await carregarCursosNoSelect();

        document.getElementById(
            "nomeDisciplina"
        ).value =
            disciplina.nome || "";

        document.getElementById(
            "codigoDisciplina"
        ).value =
            disciplina.codigo || "";

        document.getElementById(
            "cargaHorariaDisciplina"
        ).value =
            disciplina.carga_horaria || "";

        document.getElementById(
            "cursoDisciplina"
        ).value =
            disciplina.curso_id || "";

        document.querySelector(
            "#formDisciplina h3"
        ).textContent =
            "Editar disciplina";

        document.querySelector(
            "#cadastroDisciplina button[type='submit']"
        ).textContent =
            "Salvar alterações";

        formDisciplina.classList.remove(
            "escondido"
        );

    } catch (erro) {
        console.error(
            "Erro ao carregar disciplina:",
            erro
        );

        alert("Erro ao carregar disciplina.");
    }
}


// CADASTRAR OU EDITAR DISCIPLINA
cadastroDisciplina.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const disciplina = {
            nome:
                document.getElementById(
                    "nomeDisciplina"
                ).value.trim(),

            codigo:
                document.getElementById(
                    "codigoDisciplina"
                ).value.trim(),

            carga_horaria:
                document.getElementById(
                    "cargaHorariaDisciplina"
                ).value,

            curso_id:
                document.getElementById(
                    "cursoDisciplina"
                ).value
        };

        let url =
            `${API_URL}/disciplinas`;

        let metodo = "POST";

        if (disciplinaEditandoId !== null) {
            url =
                `${API_URL}/disciplinas/${disciplinaEditandoId}`;

            metodo = "PUT";
        }

        try {
            const resposta = await fetch(
                url,
                {
                    method: metodo,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            disciplina
                        )
                }
            );

            const resultado =
                await resposta.json();

            if (!resposta.ok) {
                alert(
                    resultado.erro ||
                    resultado.mensagem ||
                    "Erro ao salvar disciplina."
                );

                return;
            }

            alert(resultado.mensagem);

            cadastroDisciplina.reset();

            formDisciplina.classList.add(
                "escondido"
            );

            disciplinaEditandoId = null;

            carregarDisciplinas();

        } catch (erro) {
            console.error(
                "Erro ao salvar disciplina:",
                erro
            );

            alert(
                "Não foi possível salvar a disciplina."
            );
        }
    }
);


// EXCLUIR DISCIPLINA
async function excluirDisciplina(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir esta disciplina?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/disciplinas/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado =
            await resposta.json();

        if (!resposta.ok) {
            alert(
                resultado.erro ||
                resultado.mensagem ||
                "Erro ao excluir disciplina."
            );

            return;
        }

        alert(resultado.mensagem);

        carregarDisciplinas();

    } catch (erro) {
        console.error(
            "Erro ao excluir disciplina:",
            erro
        );

        alert("Erro ao excluir disciplina.");
    }
}

// INICIAR SISTEMA

carregarAlunos();