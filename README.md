# pokemon-tcg-mosaic

Status: 🚧 Em construção 🚧

## 🚀 Projeto

Confira online em: https://pokemon-tcg-mosaic.vercel.app

Um mosaico de uma carta de Pokemon, usando outras cartas de Pokemon.</br>
Projeto inspirado no vídeo [30,000 Pokémon Card Mosaic](https://www.youtube.com/watch?v=ZRUCJFyFWJQ).

<img 
  alt="thumbnail" 
  title="thumbnail" 
  src="github_assets/youtube_thumbnail.png" 
  width="600px" 
/>

## 🗂️ Utilização

### 🐑🐑 Clonando o repositório:

```bash
  git clone url-do-projeto.git
```

### ▶️ Rodando o App:

#### 📊 Dataset

```bash
  cd src/app                                   #change to this directory
  node getAvgColorList.js sets/starters.json   #runs this .js script with this .json file as input 
```

Input:
```json5
//file: sets/starters.json
{
  "id": "sv3pt5",
  "name": "151",
  "series": "Scarlet & Violet",
  "cards": [
    {
      "id": "1",
      "name": "Bulbasaur",
      "url": "https://images.pokemontcg.io/sv3pt5/1.png"
    },
    {
      "id": "4",
      "name": "Charmander",
      "url": "https://images.pokemontcg.io/sv3pt5/4.png"
    },
    {
      "id": "7",
      "name": "Squirtle",
      "url": "https://images.pokemontcg.io/sv3pt5/7.png"
    }
  ]
}
```

Output:
```json5
//file: cards/starters.json
[
  {
    "id": "1",
    "name": "Bulbasaur",
    "url": "https://images.pokemontcg.io/sv3pt5/1.png",
    "avgColor": [185,211,100]
  },
  {
    "id": "4",
    "name": "Charmander",
    "url": "https://images.pokemontcg.io/sv3pt5/4.png",
    "avgColor": [223,163,115]
  },
  {
    "id": "7",
    "name": "Squirtle",
    "url": "https://images.pokemontcg.io/sv3pt5/7.png",
    "avgColor": [136,187,214]
  }
]
```

Bulbasaur avgColor: [185,211,100] = ![Badge](https://img.shields.io/badge/_____-%23b9d364)</br>
Charmander avgColor: [223,163,115] = ![Badge](https://img.shields.io/badge/_____-%23dfa373)</br>
Squirtle avgColor: [136,187,214] = ![Badge](https://img.shields.io/badge/_____-%2388bbd6)</br>

#### 🖼️ Frontend

```bash
  cd pokemon-tcg-mosaic  #change to this directory
  npm install            #download dependencies to node_modules
  npm run dev            #start the project
```

Acesar pelo navegador: http://localhost:3000

Ou, confira online em: https://pokemon-tcg-mosaic.vercel.app
