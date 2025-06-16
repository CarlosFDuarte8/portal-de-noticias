# Portal de Notícias

Um aplicativo React Native para leitura de notícias com funcionalidades offline, favoritos e interface moderna.

download: https://expo.dev/accounts/carlosduarte8/projects/portal-de-noticias/builds/5d6fc7f0-1e6a-4c0e-8978-e6868202f93e

## 📱 Funcionalidades

- **Feed de Notícias**: Visualização de notícias categorizadas com suporte offline
- **Favoritos**: Sistema de marcação e gerenciamento de notícias favoritas
- **Conectividade**: Detecção automática de status de conexão com fallback offline
- **WebView**: Leitura completa de artigos em navegador interno
- **Armazenamento Local**: Cache de notícias para acesso offline

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para desenvolvimento Android)

### Configuração do Ambiente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/CarlosFDuarte8/portal-de-noticias.git
   cd portal-de-noticias
   ```

2. **Instale as dependências:**
   ```bash
   npm install ou npx expo install
   ```

3. **Configure o ambiente de desenvolvimento:**
   - Para Android: Configure Android Studio e SDK
   - Para iOS: Configure Xcode (apenas macOS)

### Executando o Aplicativo

#### Desenvolvimento com Expo Dev Client
```bash
# Iniciar o servidor de desenvolvimento
npm start ou npx expo start

# somente para Android
npm run android

```

#### Usando Expo Go (Alternativa Simplificada)
1. Instale o [Expo Go](https://expo.dev/client) no seu dispositivo
2. Execute `npm start`
3. Escaneie o QR code com o Expo Go

## 🏗️ Decisões Técnicas

### Arquitetura e Estrutura

**React Native + Expo**: Escolhido para desenvolvimento cross-platform eficiente, aproveitando o ecossistema do Expo para funcionalidades nativas.

**Estrutura de Pastas Organizada**:
```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas da aplicação
├── services/       # Integração com APIs e storage
├── contexts/       # Gerenciamento de estado global
├── hooks/          # Hooks customizados
├── routes/         # Configuração de navegação
├── theme/          # Sistema de temas
├── types/          # Definições TypeScript
└── utils/          # Funções utilitárias
```

### Gerenciamento de Estado

**Context API**: Combinação para diferentes necessidades:
- **Context API**: Para estados globais simples (conectividade, favoritos)

### Navegação

**React Navigation v7**: Biblioteca padrão para navegação em React Native:
- **Stack Navigator**: Navegação principal entre telas
- **Bottom Tabs**: Navegação por abas (Home, Favoritos)

### Interface e Tema

**React Native Paper**: Biblioteca de componentes Material Design:
- Design system consistente
- Suporte nativo a temas claro/escuro (implementado tema claro)
- Componentes acessíveis

### Conectividade e Dados

**Estratégia Offline-First**:
- **@react-native-community/netinfo**: Detecção de conectividade
- **AsyncStorage**: Armazenamento local para cache de notícias
- **Fallback automático**: Interface funciona mesmo sem conexão

**API de Notícias**:
- **NewsAPI**: Integração com serviço de notícias
- **Axios**: Cliente HTTP para requisições
- **Categorização**: Sistema de filtros por categoria

### Persistência de Dados

**AsyncStorage**: Escolhido por:
- Simplicidade de implementação
- Adequado para dados não-relacionais (favoritos, cache)
- Performance satisfatória para o escopo do projeto

### Tipagem

**TypeScript**: Tipagem forte em todo o projeto:
- Interfaces bem definidas para dados de notícias
- Tipagem de navegação
- Melhor experiência de desenvolvimento

### Performance

**Otimizações Implementadas**:
- Cache de imagens
- Lazy loading de componentes
- Gerenciamento eficiente de memória
- Compressão de dados armazenados localmente

### Acessibilidade

**Práticas Implementadas**:
- Labels descritivos em componentes
- Navegação por teclado
- Contraste adequado de cores
- Suporte a leitores de tela

## 📦 Principais Dependências

- **react-native**: Framework principal
- **expo**: Plataforma de desenvolvimento
- **@react-navigation**: Navegação
- **react-native-paper**: Componentes UI
- **axios**: Cliente HTTP
- **@react-native-async-storage/async-storage**: Armazenamento local
- **@react-native-community/netinfo**: Detecção de conectividade
- **date-fns**: Manipulação de datas

## 🔧 Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run android`: Executa no emulador/dispositivo Android
