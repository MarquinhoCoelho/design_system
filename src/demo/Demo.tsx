import { ArrowRight, BookOpen, CreditCard, Download, GraduationCap, Layers, Mail, Moon, Pencil, Plus, Search, Sun, Trash2, Users } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  ask,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Field,
  IconButton,
  InfoTip,
  Modal,
  MultiSelect,
  RadioGroup,
  Segmented,
  Select,
  Skeleton,
  Switch,
  Tabs,
  TextArea,
  Tooltip,
} from '@/components';
import { getTheme, setBrandColor, setTheme as applyTheme, type Theme } from '@/lib/theme';

const TOKENS = [
  ['bg-primary', 'primary', 'Cor da marca: ação principal'],
  ['bg-bg', 'bg', 'Fundo da página'],
  ['bg-surface', 'surface', 'Cartões e barras'],
  ['bg-surface-2', 'surface-2', 'Fundo de apoio'],
  ['bg-field', 'field', 'Campos'],
  ['bg-elevated', 'elevated', 'Menus flutuantes'],
  ['bg-fg', 'fg', 'Texto'],
  ['bg-muted', 'muted', 'Texto de apoio'],
  ['bg-success', 'success', 'Deu certo'],
  ['bg-warning', 'warning', 'Atenção'],
  ['bg-danger', 'danger', 'Erro ou ação que apaga'],
] as const;

const COURSES = [
  { value: 'excel', label: 'Excel do zero ao avançado', description: 'Publicado', icon: BookOpen },
  { value: 'ingles', label: 'Inglês para viagens', description: 'Publicado', icon: BookOpen },
  { value: 'violao', label: 'Violão para iniciantes', description: 'Rascunho', icon: BookOpen },
  { value: 'foto', label: 'Fotografia com o celular', description: 'Publicado', icon: BookOpen },
  { value: 'financas', label: 'Finanças pessoais', description: 'Publicado', icon: BookOpen },
  { value: 'oratoria', label: 'Oratória e apresentações', description: 'Rascunho', icon: BookOpen },
  { value: 'marketing', label: 'Marketing para pequenos negócios', description: 'Publicado', icon: BookOpen },
  { value: 'confeitaria', label: 'Confeitaria artesanal', description: 'Publicado', icon: BookOpen },
  { value: 'bloqueado', label: 'Curso arquivado', description: 'Não pode ser escolhido', icon: BookOpen, disabled: true },
];

function Section({ id, title, about, children }: { id: string; title: string; about: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">{about}</p>
      <Card className="mt-4 space-y-6">{children}</Card>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const SECTIONS = [
  ['cores', 'Cores'],
  ['botoes', 'Botões'],
  ['campos', 'Campos'],
  ['listas', 'Listas de escolha'],
  ['escolhas', 'Marcar e alternar'],
  ['etiquetas', 'Etiquetas e avisos'],
  ['navegacao', 'Abas e janelas'],
  ['estados', 'Carregando e vazio'],
] as const;

/** Demonstração do design system: todos os componentes, nos dois temas e com qualquer cor de marca. */
export function Demo() {
  const [theme, setTheme] = useState<Theme>(getTheme());
  const [brand, setBrand] = useState('#2e7d87');

  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => void setBrandColor(brand), [brand]);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [course, setCourse] = useState('');
  const [plan, setPlan] = useState('pro');
  const [tags, setTags] = useState<string[]>(['excel', 'ingles']);
  const [agree, setAgree] = useState(true);
  const [notify, setNotify] = useState(true);
  const [access, setAccess] = useState('free');
  const [period, setPeriod] = useState('30d');
  const [tab, setTab] = useState<'dados' | 'alunos' | 'vendas'>('dados');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-border/[0.08] bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-fg"><Layers className="h-5 w-5" /></span>
          <div className="mr-auto">
            <h1 className="text-base font-bold leading-tight">Design system</h1>
            <p className="text-xs text-muted">Componentes padrão dos projetos</p>
          </div>
          <Tooltip title="Cor da marca: troque para ver todos os componentes na cor do seu projeto.">
            <label className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border/[0.14] bg-field px-2 text-xs font-semibold">
              <input type="color" value={brand} onChange={(e) => setBrand(e.target.value)} className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0" aria-label="Cor da marca" />
              Cor
            </label>
          </Tooltip>
          <IconButton icon={theme === 'dark' ? Sun : Moon} label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} size="sm" variant="secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav className="hidden lg:block" aria-label="Seções">
          <ul className="sticky top-24 space-y-1 text-sm">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-lg px-3 py-1.5 font-medium text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 space-y-12">
          <Section id="cores" title="Cores" about="Toda cor vem de um nome (token). O mesmo componente funciona no tema claro, no escuro e com a cor de qualquer marca.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {TOKENS.map(([cls, token, use]) => (
                <div key={token} className="flex items-center gap-3 rounded-xl border border-border/[0.08] p-2.5">
                  <span className={`h-10 w-10 shrink-0 rounded-lg border border-border/10 ${cls}`} />
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-xs font-semibold">{token}</span>
                    <span className="block truncate text-xs text-muted">{use}</span>
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="botoes" title="Botões" about="Um botão principal por tela. Os outros são secundários ou discretos. Vermelho só para o que apaga ou não tem volta.">
            <Row label="Tipos">
              <Button>Salvar alterações</Button>
              <Button variant="secondary">Cancelar</Button>
              <Button variant="soft">Ver detalhes</Button>
              <Button variant="ghost">Agora não</Button>
              <Button variant="danger" icon={Trash2}>Excluir curso</Button>
            </Row>
            <Row label="Tamanhos e ícones">
              <Button size="sm" icon={Plus}>Pequeno</Button>
              <Button icon={Plus}>Novo curso</Button>
              <Button size="lg" iconRight={ArrowRight}>Continuar</Button>
              <Button variant="secondary" icon={Download}>Baixar relatório</Button>
            </Row>
            <Row label="Estados">
              <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1600); }}>Clique para carregar</Button>
              <Button loading>Salvando</Button>
              <Button disabled>Desabilitado</Button>
              <Button variant="secondary" disabled>Desabilitado</Button>
            </Row>
            <Row label="Só ícone (sempre com dica)">
              <IconButton icon={Pencil} label="Editar curso" />
              <IconButton icon={Download} label="Baixar lista de alunos" variant="secondary" />
              <IconButton icon={Trash2} label="Excluir curso" variant="soft" />
              <IconButton icon={Plus} label="Adicionar aula" variant="primary" size="sm" />
            </Row>
          </Section>

          <Section id="campos" title="Campos" about="Rótulo sempre visível em cima, dica embaixo e, se algo estiver errado, a mensagem diz o que fazer.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nome do curso" placeholder="Ex.: Excel do zero" value={name} onChange={(e) => setName(e.target.value)} hint="Aparece na vitrine e no certificado." />
              <Field label="E-mail" type="email" icon={Mail} placeholder="voce@suaescola.com.br" tip="Usamos este e-mail para avisar sobre vendas e alunos novos." />
              <Field label="Senha" type="password" defaultValue="senha-de-exemplo" autoComplete="new-password" />
              <Field label="Buscar aluno" type="search" icon={Search} placeholder="Nome ou e-mail" />
              <Field label="Preço" prefix="R$" inputMode="decimal" placeholder="0,00" />
              <Field label="Endereço da escola" suffix=".seudominio.com.br" placeholder="suaescola" />
              <Field label="CPF" defaultValue="123.456.789-00" error="CPF inválido. Confira os 11 números." />
              <Field label="Plano atual" defaultValue="Profissional" disabled optional />
              <TextArea wrapperClassName="sm:col-span-2" label="Descrição" placeholder="Conte em poucas linhas o que o aluno vai aprender." value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} counter hint="Aparece na página do curso." />
            </div>
            <Row label="Tamanho pequeno (filtros e barras)">
              <Field size="sm" aria-label="Busca pequena" icon={Search} placeholder="Buscar" wrapperClassName="w-56" />
              <Field size="sm" aria-label="Data" type="date" wrapperClassName="w-44" />
            </Row>
          </Section>

          <Section id="listas" title="Listas de escolha" about="Abrem com clique ou teclado (setas, Enter, Esc). Listas longas ganham busca sozinhas, sem diferenciar acentos.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Select
                label="Plano"
                value={plan}
                onChange={setPlan}
                options={[
                  { value: 'start', label: 'Início', description: 'Até 100 alunos', icon: Layers },
                  { value: 'pro', label: 'Profissional', description: 'Até 1.000 alunos', icon: Layers },
                  { value: 'max', label: 'Ilimitado', description: 'Sem limite de alunos', icon: Layers },
                ]}
                hint="Com ícone e descrição em cada opção."
              />
              <Select label="Curso divulgado" placeholder="Escolha um curso" value={course} onChange={setCourse} options={COURSES} hint="Mais de 7 opções: aparece a busca." />
              <MultiSelect label="Cursos da trilha" value={tags} onChange={setTags} options={COURSES} hint="Várias escolhas viram etiquetas no campo." />
              <Select label="Forma de pagamento" value="" onChange={() => undefined} placeholder="Escolha uma forma" error="Escolha como você quer receber." options={[{ value: 'pix', label: 'PIX', icon: CreditCard }, { value: 'card', label: 'Cartão', icon: CreditCard }]} />
              <Select label="Estado" value="SC" onChange={() => undefined} disabled options={[{ value: 'SC', label: 'Santa Catarina' }]} />
              <div>
                <p className="label">Pequeno, para filtros</p>
                <div className="flex flex-wrap gap-2">
                  <Select size="sm" aria-label="Situação" triggerClassName="w-40" value={access} onChange={setAccess} options={[{ value: 'free', label: 'Gratuitos' }, { value: 'paid', label: 'Pagos' }, { value: 'all', label: 'Todos' }]} />
                  <Select size="sm" aria-label="Período" triggerClassName="w-44" value={period} onChange={setPeriod} options={[{ value: '7d', label: 'Últimos 7 dias' }, { value: '30d', label: 'Últimos 30 dias' }, { value: '12m', label: 'Últimos 12 meses' }]} />
                </div>
              </div>
            </div>
          </Section>

          <Section id="escolhas" title="Marcar e alternar" about="Caixa de marcar para aceitar ou incluir. Chave para ligar e desligar. Opções lado a lado quando são poucas.">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Checkbox label="Enviar convite por e-mail" hint="O aluno recebe um link para criar a própria senha." checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <Checkbox label="Opção desabilitada" disabled />
                <Switch label="Avisar por e-mail a cada venda" hint="Você pode desligar quando quiser." checked={notify} onChange={setNotify} />
                <Switch label="Chave desabilitada" checked={false} onChange={() => undefined} disabled />
              </div>
              <RadioGroup
                label="Quem pode assistir"
                cards
                value={access}
                onChange={setAccess}
                options={[
                  { value: 'free', label: 'Qualquer pessoa', hint: 'Curso gratuito, sem cadastro.' },
                  { value: 'paid', label: 'Só quem comprou', hint: 'O acesso libera quando o pagamento cai.' },
                  { value: 'all', label: 'Alunos cadastrados', hint: 'Gratuito, mas pede login.' },
                ]}
              />
            </div>
            <Row label="Opções lado a lado">
              <Segmented aria-label="Período" value={period} onChange={setPeriod} options={[{ value: '7d', label: '7 dias' }, { value: '30d', label: '30 dias' }, { value: '12m', label: '12 meses' }]} />
              <Segmented aria-label="Visualização" size="sm" value={tab} onChange={setTab} options={[{ value: 'dados', label: 'Cursos', icon: GraduationCap }, { value: 'alunos', label: 'Alunos', icon: Users }]} />
            </Row>
          </Section>

          <Section id="etiquetas" title="Etiquetas e avisos" about="Etiqueta mostra a situação de um item. Aviso explica o que houve e o que fazer. Para confirmação rápida, um aviso que some sozinho.">
            <Row label="Etiquetas">
              <Badge color="green" dot>Publicado</Badge>
              <Badge color="yellow" dot>Pendente</Badge>
              <Badge color="red" dot>Atrasado</Badge>
              <Badge>Rascunho</Badge>
              <Badge color="primary">Gratuito</Badge>
              <Badge color="primary" icon={GraduationCap}>Com certificado</Badge>
            </Row>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Alert tone="info" title="Seu período de teste termina em 5 dias">Cadastre um cartão para a escola continuar no ar.</Alert>
              <Alert tone="success" title="Recebimentos configurados">As vendas já caem direto na sua conta.</Alert>
              <Alert tone="warning" title="Você usou 85% do armazenamento" action={<Button size="sm" variant="secondary">Ver planos</Button>}>Ao chegar em 100%, novos envios ficam bloqueados.</Alert>
              <Alert tone="danger" title="Não conseguimos cobrar a mensalidade">Atualize o cartão para evitar a suspensão da escola.</Alert>
            </div>
            <Row label="Avisos rápidos, confirmação e dica">
              <Button variant="secondary" onClick={() => toast.success('Curso publicado.')}>Aviso de sucesso</Button>
              <Button variant="secondary" onClick={() => toast.error('Não foi possível salvar. Tente de novo.')}>Aviso de erro</Button>
              <Button variant="secondary" onClick={async () => { if (await ask({ title: 'Excluir este curso?', message: 'Os alunos perdem o acesso e isso não pode ser desfeito.', confirm: 'Excluir', danger: true })) toast.success('Curso excluído.'); }}>Pedir confirmação</Button>
              <Tooltip title="Explica em uma frase o que o botão faz."><Button variant="ghost">Passe o mouse</Button></Tooltip>
              <span className="flex items-center gap-1.5 text-sm font-medium">Taxa por venda <InfoTip text="Não há taxa sobre as suas vendas: só a mensalidade do plano." /></span>
            </Row>
            <Row label="Pessoas">
              <Avatar name="Marina Souza" size="sm" />
              <Avatar name="Marina Souza" />
              <Avatar name="Marina Souza" size="lg" />
            </Row>
          </Section>

          <Section id="navegacao" title="Abas e janelas" about="Abas separam assuntos da mesma página. A janela pede atenção total e avisa antes de descartar o que foi digitado.">
            <div>
              <Tabs value={tab} onChange={setTab} items={[{ id: 'dados', label: 'Dados do curso', icon: BookOpen }, { id: 'alunos', label: 'Alunos', icon: Users, count: 128 }, { id: 'vendas', label: 'Vendas', icon: CreditCard, count: 42 }]} />
              <p className="text-sm text-muted">Conteúdo da aba “{tab === 'dados' ? 'Dados do curso' : tab === 'alunos' ? 'Alunos' : 'Vendas'}”.</p>
            </div>
            <Row label="Janela">
              <Button variant="secondary" onClick={() => setModal(true)}>Abrir janela</Button>
            </Row>
            <Modal open={modal} onClose={() => setModal(false)} title="Novo cupom">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModal(false); toast.success('Cupom criado.'); }}>
                <Field label="Código" placeholder="LANCAMENTO20" />
                <Select label="Vale para" value={course} onChange={setCourse} placeholder="Todos os cursos pagos" options={COURSES} />
                <Switch label="Ativo" checked={notify} onChange={setNotify} />
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
                  <Button>Criar cupom</Button>
                </div>
              </form>
            </Modal>
          </Section>

          <Section id="estados" title="Carregando e vazio" about="Enquanto carrega, mostramos o formato do que vai aparecer. Lista vazia sempre diz qual é o próximo passo.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-border/[0.08] p-5" aria-busy="true" aria-label="Exemplo de carregamento">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <span className="flex-1 space-y-2"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-3 w-2/3" /></span>
                  </div>
                ))}
              </div>
              <EmptyState icon={GraduationCap} title="Nenhum curso ainda" action={<Button icon={Plus}>Criar primeiro curso</Button>}>Crie o curso, adicione as aulas e publique quando estiver pronto.</EmptyState>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
