import * as Nomes from "./material_de_referencia/nomes";

type Genero = "masculino" | "feminino";
type ClasseSocial = "alta" | "baixa" | "sem_classe";
type Raca =
  | "elfo"
  | "humano_ocidental"
  | "humano_oriental"
  | "anao"
  | "drow"
  | "halfling"
  | "demonio"
  | "orc"
  | "gnomo"
  | "draconico"
  | "goblin";

interface Personagem {
  nome: string;
  sobrenome: string;
  genero: Genero;
  classeSocial: ClasseSocial;
  raca: Raca;
  // Aqui você pode adicionar mais características depois
  // como: idade, altura, cor dos olhos, etc.
}

const configuracaoNomes = {
  elfo: Nomes.nomes_elficos,
  humano_ocidental: Nomes.nomes_humanos_ocidentais,
  humano_oriental: Nomes.nomes_humanos_orientais,
  anao: Nomes.nomes_anoes,
  drow: Nomes.nomes_drow,
  halfling: Nomes.nomes_halfling,
  demonio: Nomes.nomes_demonios,
  orc: Nomes.nomes_orcs,
  gnomo: Nomes.nomes_gnomos,
  draconico: Nomes.nomes_draconicos,
  goblin: Nomes.nomes_goblins,
} as const;

function escolherAleatorio<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

interface OpcoesGeracao {
  raca?: Raca;
  genero?: Genero;
  classeSocial?: ClasseSocial;
}

export function gerarPersonagem(opcoes: OpcoesGeracao = {}): Personagem {
  const raca = opcoes.raca ?? "humano_ocidental";
  const genero =
    opcoes.genero ?? (Math.random() > 0.5 ? "masculino" : "feminino");
  const nomes = configuracaoNomes[raca];

  const nome = escolherAleatorio(nomes.nome[genero]);

  let sobrenome: string;
  let classeSocial: ClasseSocial;

  if (nomes.sobrenome.sem_classe) {
    sobrenome = escolherAleatorio(nomes.sobrenome.sem_classe);
    classeSocial = "sem_classe";
  } else {
    classeSocial =
      opcoes.classeSocial ?? (Math.random() > 0.7 ? "alta" : "baixa");
    sobrenome = escolherAleatorio(
      classeSocial === "alta"
        ? nomes.sobrenome.alta_classe!
        : nomes.sobrenome.baixa_classe!,
    );
  }

  return {
    nome,
    sobrenome,
    genero,
    classeSocial,
    raca,
  };
}

// Função para gerar múltiplos personagens
export function gerarPersonagens(
  quantidade: number,
  raca: Raca = "humano_ocidental",
): Personagem[] {
  return Array.from({ length: quantidade }, () => gerarPersonagem({ raca }));
}
