<div align="center">
	<img alt="Weekend Cover" src="/.github/assets/weekend-example.png" />
</div>

# Fines de Semana Largos

<div align="center">
	<a href="https://nextjs.org" aria-label="Framework">
		<img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=Next.js&labelColor=000" />
	</a>
	<img alt="Top Language" src="https://img.shields.io/github/languages/top/bribkn/weekend?style=for-the-badge&labelColor=000" />
	<a href="https://github.com/bribkn/weekend/blob/main/LICENSE" aria-label="License">
		<img alt="License" src="https://img.shields.io/github/license/bribkn/weekend?style=for-the-badge&labelColor=000" />
	</a>
</div>

<div align="center">
	<i>
		Web que te dice cuándo son los próximos fines de semana largos en Chile y te permite simular fines de semana largos según los días libres que puedes pedir.<br />
		Calculadora visual y moderna construida con Next.js, Framer Motion y shadcn/ui.
	</i>
</div>

---

## 📚 Contents

1. [Overview](#overview)
2. [Stack](#stack)
3. [Highlights](#highlights)
4. [Setup](#setup)
5. [Acknowledgements](#acknowledgements)

## <a name="overview">Overview</a>

Esta web te muestra los próximos fines de semana largos en Chile y te permite calcular, según los feriados y los días libres que puedes pedir, cuáles son las mejores combinaciones para aprovecharlos al máximo.

## <a name="stack">Stack</a>

- Next.js 15 (App Router)
- shadcn/ui
- Framer Motion
- Tailwind CSS

## <a name="highlights">Highlights</a>

- App Router con Next.js 15
- UI responsiva y accesible
- SEO meta tags
- Husky, Lint Staged y Prettier preconfigurados
- Transiciones animadas con Framer Motion

## <a name="setup">Setup</a>

### Requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v20 recomendado)
- [npm](https://pnpm.io/) (instalar vía Corepack o `npm install -g pnpm`)

### Instalación

```bash
git clone https://github.com/bribkn/weekend.git
cd weekend
npm install
```

### Configuración

1. Para habilitar integraciones externas, agrega tus credenciales en un archivo `.env` en la raíz del proyecto.
2. Edita el contenido y las secciones en `components/custom/` según tus necesidades.
3. Ajusta configuraciones globales en `app/layout.tsx` y `app/page.tsx` si lo requieres.

### Ejecutar localmente

```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000) para ver la web en acción.
