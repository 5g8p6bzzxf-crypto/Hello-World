# Publicar o site com GitHub Pages

O site usa apenas HTML, CSS e JavaScript no navegador. Não precisa de servidor, banco de dados ou processo de build.

## Ativar a publicação

1. Abra o repositório: https://github.com/5g8p6bzzxf-crypto/Hello-World
2. Entre em **Settings**.
3. No menu lateral, abra **Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione `main` e a pasta `/ (root)).
6. Clique em **Save**.
7. Aguarde o GitHub concluir a publicação. Volte à seção **Pages** para ver o endereço disponibilizado.

Como o repositório se chama `Hello-World`, o endereço esperado para um projeto de usuário/organização é:

`https://5g8p6bzzxf-crypto.github.io/Hello-World/`

O endereço só estará acessível depois que o GitHub Pages for ativado e a implantação terminar. Se a conta ou as configurações de visibilidade exigirem outro método, use o endereço indicado em **Settings → Pages**.

## Atualizar o site

Faça commit das alterações nos arquivos `index.html`, `style.css` ou `script.js) na branch `main`. O GitHub Pages publica novamente a versão atualizada automaticamente.

## Testar localmente

Abra `index.html` no navegador. Para uma simulação mais próxima de um site publicado, execute um servidor local a partir da raiz do projeto:

```bash
python -m http.server 8000
```

Depois, acesse http://localhost:8000.

## Solução de problemas

- Confirme que a fonte de publicação está em `main` e `/ (root)`.
- Confirme que `index.html` está na raiz do repositório.
- Aguarde alguns minutos após salvar as configurações.
- Veja o estado da implantação na aba **Actions** e o endereço publicado em **Settings → Pages**.
