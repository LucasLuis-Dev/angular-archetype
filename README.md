# Angular Archetype 🚀

Arquitetura base para projetos Angular modernos com Facade Pattern, Signals, Atomic Design e Feature-Driven Modular Architecture.

### 👥 Atores do Arquétipo

- [Lucas Luis de Souza](https://www.linkedin.com/in/lucasluis-dev/)
- [Joao Victor Pereira Silvestre Cavalcanti](/https://www.linkedin.com/in/joaovictorcavalcanti272105196/)
- [Pedro Henrique Laureano Novaes](https://www.linkedin.com/in/pedro-novaes-2258211ab/)


## 🚀 Tecnologias

- Angular 21+
- TypeScript 5.9+
- Signals (Gerenciamento de Estado Reativo)
- Standalone Components
- ngx-env/builder (Variáveis de Ambiente)
- SCSS
- Vitest

## 🏗️ Arquitetura

### Feature-Driven Modular Architecture

O projeto adota uma arquitetura modular orientada a features, onde cada funcionalidade é encapsulada em seu próprio módulo independente com:

- **Isolamento**: Cada feature contém seus próprios componentes, serviços e lógica
- **Escalabilidade**: Adicione novas features sem impactar as existentes
- **Manutenibilidade**: Código organizado por domínio de negócio
- **Reutilização**: Componentes compartilhados em `shared/` e serviços globais em `core/`
- **Lazy Loading**: Features carregadas sob demanda para melhor performance

### Facade Pattern + Signals

O projeto utiliza o padrão Facade para encapsular a lógica de negócio e gerenciamento de estado usando Angular Signals, proporcionando:

- **Reatividade**: Estado reativo com signals e computed
- **Encapsulamento**: Lógica de negócio isolada dos componentes
- **Testabilidade**: Facades facilmente testáveis
- **Manutenibilidade**: Separação clara de responsabilidades
- **Previsibilidade**: Fluxo de dados unidirecional

### Atomic Design

Componentes organizados seguindo Atomic Design:

- **Atoms**: Componentes básicos reutilizáveis (button, input, icon, label)
- **Molecules**: Combinações simples de atoms (form-field, card, search-bar)
- **Organisms**: Componentes complexos e auto-suficientes (header, sidebar, data-table)
- **Templates**: Layouts de página (layout, auth-layout)
- **Pages**: Páginas completas que compõem templates, organisms e lógica de negócio

### Estrutura de Pastas

```
src/app/
├── core/ # Serviços globais, guards, interceptors, modelos de domínio
│ ├── config/ # Configurações da aplicação
│ ├── guards/ # Route guards (auth, role-based)
│ ├── interceptors/ # HTTP interceptors
│ ├── models/ # Modelos globais (User, Auth)
│ ├── services/ # Serviços singleton (API, Storage, Auth)
│ └── utils/ # Funções utilitárias
├── shared/ # Componentes, pipes, directives compartilhados
│ ├── components/ # Atomic Design (atoms, molecules, organisms, templates)
│ ├── directives/ # Diretivas reutilizáveis
│ ├── pipes/ # Pipes customizados
│ ├── models/ # Modelos compartilhados entre features
│ └── validators/ # Validadores de formulário
└── features/ # Features modulares (feature-driven)
└── [feature-name]/
├── components/ # Componentes específicos da feature
├── facades/ # Facades para gerenciamento de estado
├── services/ # Serviços específicos da feature
├── models/ # Modelos da feature
├── pages/ # Páginas da feature
└── [feature].routes.ts # Rotas da feature
```

--- 
### 1. **Components (Componentes)**
**Responsabilidade**: Apresentação e interação com o usuário

- Recebem dados via inputs (signals)
- Emitem eventos via outputs
- Não contêm lógica de negócio complexa
- Delegam ações para Facades
- Focados em UI/UX e acessibilidade

```
@Component({...})
export class UserListComponent {
    users = input.required<User[]>();
    loading = input<boolean>(false);
    userSelected = output<User>();

    onSelectUser(user: User): void {
        this.userSelected.emit(user);
    }
}
```

### 2. **Pages (Páginas)**
**Responsabilidade**: Orquestração de componentes e integração com Facades

- Conectam Facades com Components
- Gerenciam o ciclo de vida da página
- Coordenam múltiplos componentes
- Tratam navegação e parâmetros de rota
- Fornecem Facades através de providers

```
@Component({
providers: [UserFacade]
})
export class UserListPageComponent {
    readonly facade = inject(UserFacade);

    ngOnInit(): void {
        this.facade.loadUsers();
    }

    onUserSelected(user: User): void {
        this.facade.selectUser(user);
    }
}
```

### 3. **Facades**
**Responsabilidade**: Gerenciamento de estado e lógica de negócio

- Encapsulam estado reativo com signals
- Expõem estado somente leitura
- Fornecem computed signals derivados
- Coordenam chamadas a Services
- Implementam regras de negócio
- Gerenciam loading, error e success states

```
export class UserFacade {
    private readonly userService = inject(UserService);

    private readonly usersState = signal<User[]>([]);
    private readonly loadingState = signal(false);

    readonly users = this.usersState.asReadonly();
    readonly loading = this.loadingState.asReadonly();
    readonly usersCount = computed(() => this.usersState().length);

    loadUsers(): void {
        this.loadingState.set(true);
        this.userService.getUsers().subscribe(users => {
            this.usersState.set(users);
            this.loadingState.set(false);
        });
    }
}
```

### 4. **Services**
**Responsabilidade**: Comunicação com APIs e operações de dados

- Realizam chamadas HTTP
- Transformam dados (DTOs para Models)
- Gerenciam cache quando necessário
- Isolam lógica de acesso a dados
- Retornam Observables
- Não gerenciam estado de UI
```

@Injectable()
export class UserService {
    private readonly api = inject(ApiService);

    getUsers(): Observable<User[]> {
        return this.api.get<UserDTO[]>('users').pipe(
        map(dtos => dtos.map(dto => this.mapToUser(dto)))
        );
    }

    createUser(user: CreateUserDTO): Observable<User> {
        return this.api.post<User>('users', user);
    }
}
```

### 5. **Guards**
**Responsabilidade**: Proteção e controle de acesso a rotas

- Validam autenticação e autorização
- Redirecionam usuários não autorizados
- Verificam permissões baseadas em roles
- Podem carregar dados antes da navegação
- Impedem acesso não autorizado

```
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
};
```


### 6. **Interceptors**
**Responsabilidade**: Manipulação global de requisições HTTP

- Adicionam headers de autenticação
- Tratam erros globalmente
- Implementam retry logic
- Gerenciam loading global
- Transformam requests/responses
- Implementam logging

```
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        notificationService.showError(error.message);
            return throwError(() => error);
        })
    );
};
```

### 7. **Models**
**Responsabilidade**: Definição de estruturas de dados e tipos

- Definem interfaces e types
- Documentam estrutura de dados
- Facilitam type-safety
- Separados por escopo (core, shared, feature)

```
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface CreateUserDTO {
name: string;
email: string;
password: string;
```


### 8. **Directives**
**Responsabilidade**: Comportamentos reutilizáveis para elementos DOM

- Modificam comportamento de elementos
- Adicionam funcionalidades cross-cutting
- Encapsulam manipulação de DOM
- Reutilizáveis entre features

```
import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null) {
    if (!target) return;
    
    const clickedInside = this.elementRef.nativeElement.contains(target as Node);
    
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
```

### 9. **Pipes**
**Responsabilidade**: Transformação de dados em templates

- Formatam dados para exibição
- Não modificam dados originais
- São puros por padrão
- Reutilizáveis e testáveis

```
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'document',
  standalone: true
})
export class DocumentPipe implements PipeTransform {
  transform(value: string, type: 'cpf' | 'cnpj' = 'cpf'): string {
    if (!value) return '';
    
    const cleaned = value.replace(/\D/g, '');
    
    if (type === 'cpf' && cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    if (type === 'cnpj' && cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return value;
  }
}
```


### 10. **Validators**
**Responsabilidade**: Validação de formulários

- Implementam regras de validação customizadas
- Validam campos individuais ou grupos
- Retornam objetos de erro tipados
- Reutilizáveis entre formulários

```
export class CustomValidators {
    static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
        if (!value) return null;
          const isValid = validateCPF(value);
          return isValid ? null : { cpf: { value } };
        };
    }
}
```
---
### Fluxo de Dados entre Atores

```
User Action (Component)
↓
Page Component
↓
Facade (gerencia estado)
↓
Service (API call)
↓
Interceptor (add headers, error handling)
↓
Backend API
↓
Interceptor (transform response)
↓
Service (map DTO to Model)
↓
Facade (update signals)
↓
Page Component (reage automaticamente)
↓
Component (re-render com novos dados)
```

### Princípios de Interação

1. **Components** nunca chamam **Services** diretamente
2. **Facades** não acessam **Components** diretamente
3. **Services** não gerenciam estado de UI
4. **Guards** podem injetar **Services** mas não **Facades**
5. **Interceptors** são globais e não conhecem features específicas
6. **Models** são apenas estruturas de dados (sem lógica)
7. **Pages** são o ponto de integração entre UI e lógica


## 📦 Instalação

```
npm install
```

## 🔧 Configuração de Ambiente

1. Copie o arquivo `.env.example` para `.env`:

`cp .env.example .env``


2. Configure suas variáveis de ambiente no `.env`:

```
API Configuration
NG_APP_API_URL=http://localhost:3000/api
NG_APP_API_TIMEOUT=30000

Feature Flags
NG_APP_ENABLE_ANALYTICS=false
NG_APP_ENABLE_DEBUG=true

Auth Configuration
NG_APP_AUTH_DOMAIN=
NG_APP_AUTH_CLIENT_ID=
```

3. Use as variáveis no código:

`const apiUrl = import.meta.env.NG_APP_API_URL;`

text

## 🏃 Executando

```
# Desenvolvimento
npm start
```

```
# Build de produção
npm run build:prod
```

```
# Testes
npm test
```


## 📝 Como Usar

### Criando uma Nova Feature

1. Crie a estrutura da feature em `src/app/features/my-feature/`:

```
my-feature/
├── components/ # Componentes internos da feature
├── facades/
│ └── my-feature.facade.ts
├── services/
│ └── my-feature.service.ts
├── models/
│ └── my-feature.model.ts
├── pages/
│ ├── my-feature-list-page/
│ ├── my-feature-detail-page/
│ └── my-feature-create-page/
└── my-feature.routes.ts
```


2. Crie o facade com signals para gerenciar estado:

```
@Injectable()
export class MyFeatureFacade {
private readonly dataState = signal<Data[]>([]);
readonly data = this.dataState.asReadonly();
readonly dataCount = computed(() => this.dataState().length);

    loadData(): void {
        // lógica de carregamento
    }
}
```



3. Crie o service para chamadas API:

```
@Injectable()
export class MyFeatureService {
    private readonly api = inject(ApiService);

    getData(): Observable<Data[]> {
        return this.api.get<Data[]>('my-feature');
    }
}
```

4. Crie os componentes de página:

```
@Component({
selector: 'app-my-page',
standalone: true,
providers: [MyFeatureFacade],
template: @if (facade.data(); as items) { @for (item of items; track item.id) { <div>{{ item.name }}</div> } }
})
export class MyPageComponent {
    readonly facade = inject(MyFeatureFacade);

    ngOnInit(): void {
        this.facade.loadData();
    }
}
```

5. Configure as rotas da feature:

```
// my-feature.routes.ts
export const MY_FEATURE_ROUTES: Routes = [
{
    path: '',
    loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent),
},
{
    path: ':id',
    loadComponent: () => import('./pages/detail/detail.component').then(m => m.DetailComponent),
}
];
```

6. Registre a feature nas rotas principais:

```
// app.routes.ts
{
    path: 'my-feature',
    canActivate: [authGuard],
    loadChildren: () => import('./features/my-feature/my-feature.routes').then(m => m.MY_FEATURE_ROUTES)
}
```

### Exemplo de Facade Completo

```
@Injectable()
export class MyFeatureFacade {
    private readonly service = inject(MyFeatureService);

    // State
    private readonly itemsState = signal<Item[]>([]);
    private readonly loadingState = signal<boolean>(false);
    private readonly errorState = signal<string | null>(null);
    private readonly selectedItemState = signal<Item | null>(null);

    // Public readonly signals
    readonly items = this.itemsState.asReadonly();
    readonly loading = this.loadingState.asReadonly();
    readonly error = this.errorState.asReadonly();
    readonly selectedItem = this.selectedItemState.asReadonly();

    // Computed signals
    readonly itemsCount = computed(() => this.itemsState().length);
    readonly hasItems = computed(() => this.itemsState().length > 0);

    // Actions
    loadItems(): void {
        this.loadingState.set(true);
        this.errorState.set(null);

        text
        this.service.getItems().subscribe({
          next: (items) => {
            this.itemsState.set(items);
            this.loadingState.set(false);
          },
          error: (error) => {
            this.errorState.set(error.message);
            this.loadingState.set(false);
          }
        });
    }

    selectItem(item: Item): void {
        this.selectedItemState.set(item);
    }

    addItem(item: Item): void {
        this.itemsState.update(items => [...items, item]);
    }

    updateItem(id: string, updates: Partial<Item>): void {
        this.itemsState.update(items =>
        items.map(item => item.id === id ? { ...item, ...updates } : item)
        );
    }

    removeItem(id: string): void {
    this.itemsState.update(items => items.filter(item => item.id !== id));
    }
}
```

### Exemplo de Componente Atom

```
@Component({
selector: 'app-button',
standalone: true,
template: <button [type]="type()" [disabled]="disabled() || loading()" [class]="'btn btn--' + variant() + ' btn--' + size()" (click)="handleClick()" > @if (loading()) { <span class="btn__spinner"></span> } <span class="btn__label">{{ label() }}</span> </button>
})
export class ButtonComponent {
    label = input<string>('');
    variant = input<'primary' | 'secondary' | 'danger'>('primary');
    size = input<'sm' | 'md' | 'lg'>('md');
    disabled = input<boolean>(false);
    loading = input<boolean>(false);
    type = input<'button' | 'submit' | 'reset'>('button');

    clicked = output<void>();

    handleClick(): void {
        if (!this.disabled() && !this.loading()) {
        this.clicked.emit();
        }
    }
}
```


## 🎨 Convenções de Código

### Geral
- Use signals para estado reativo
- Prefira standalone components
- Use `inject()` em vez de constructor injection
- Use `readonly` para signals expostos publicamente
- Mantenha componentes pequenos e focados (< 200 linhas)

### Nomenclatura
- **Features**: kebab-case (`user-management/`)
- **Componentes**: PascalCase + suffix (`UserListComponent`)
- **Services**: PascalCase + suffix (`UserService`)
- **Facades**: PascalCase + suffix (`UserFacade`)
- **Signals**: camelCase + "State" para privados (`userState`), sem sufixo para públicos (`user`)

### Organização
- Siga o Atomic Design para componentes compartilhados
- Mantenha facades slim e focados (uma responsabilidade)
- Coloque modelos globais em `core/models/`
- Coloque modelos compartilhados em `shared/models/`
- Coloque modelos específicos em `features/[feature]/models/`

### Rotas
- Use lazy loading para todas as features
- Agrupe rotas relacionadas em arquivos separados
- Use guards para proteção de rotas
- Defina títulos para todas as páginas

## 🧪 Testes

```
// Testando Facades
describe('MyFeatureFacade', () => {
    it('should load items', () => {
    const facade = new MyFeatureFacade();
    facade.loadItems();
    expect(facade.loading()).toBe(true);
    });
});
```

```
// Testando Componentes
describe('ButtonComponent', () => {
    it('should emit click event', () => {
    const component = new ButtonComponent();
    let clicked = false;
    component.clicked.subscribe(() => clicked = true);
    component.handleClick();
    expect(clicked).toBe(true);
    });
});
```

## 📚 Recursos

- [Angular Signals](https://angular.dev/guide/signals)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [ngx-env](https://github.com/chihab/ngx-env)
- [Feature-Driven Architecture](https://angular.io/guide/file-structure)

## 🤝 Contribuindo

1. Crie uma nova feature seguindo a estrutura proposta
2. Mantenha a consistência com os padrões estabelecidos
3. Adicione testes para novas funcionalidades
4. Atualize a documentação quando necessário

## 📄 Licença

MIT License - sinta-se livre para usar este arquétipo em seus projetos!